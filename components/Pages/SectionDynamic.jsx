import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { Sections } from "@/sections";
import { toast } from "react-toastify";
import { nanoid } from "nanoid"; // ✅ ใช้ nanoid เพื่อสร้าง id ที่ไม่ซ้ำ
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Menu, MenuItem } from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { RiDeleteBinLine } from "react-icons/ri";
import { db } from "@/services/firebase";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { Popover } from "@mui/material";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default function SectionDynamic({ page, sections, onClose }) {
  const [selectedSections, setSelectedSections] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { lang } = useLanguage();
  const { update } = useDB("pages");

  console.log("page", page);

  useEffect(() => {
    if (sections && sections.length > 0) {
      const withIds = sections.map((sec) => ({
        ...sec,
        id: sec.id || nanoid(),
      }));
      setSelectedSections(withIds);
    } else {
      setSelectedSections([]);
    }
  }, [sections]);

  // ✅ ฟังก์ชันเลือก Section และป้องกันการเลือกซ้ำ
  const handleSelectedSection = (section) => {
    const newSection = {
      id: nanoid(), // สร้าง id
      component: section.name,
    };
    setSelectedSections((prev) => [...prev, newSection]);
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group], // toggle true/false
    }));
  };

  // ✅ ฟังก์ชันลบ Section ออกจาก `selectedSections`
  const handleRemoveSection = (id) => {
    setSelectedSections((prev) => prev.filter((s) => s.id !== id));
  };

  // ✅ ฟังก์ชันจัดการลากเปลี่ยนตำแหน่ง
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSelectedSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ✅ คลิกขวาเพื่อเปิด Context Menu
  const handleContextMenu = (event, id) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      id,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleSubmit = async () => {
    if (selectedSections.length > 0 && page?.slug) {
      try {
        const now = new Date();
        const docRef = doc(db, "pages_slug", page.slug); // 👉 ชื่อเอกสารตาม slug
        const docSnap = await getDoc(docRef);

        // ✅ สำคัญ! sanitize sections ก่อน save
        const cleanSections = selectedSections
          .map((s) => ({
            id: s.id || nanoid(),
            component: typeof s.component === "string" ? s.component : "", // ป้องกันพัง
            contentId: s.contentId || null,
          }))
          .filter((s) => s.component); // กรอง component ว่างออก

        if (docSnap.exists()) {
          // ✅ ถ้าเอกสารมีอยู่แล้ว ➔ update
          await updateDoc(docRef, {
            page: page.slug,
            sections: cleanSections,
            updateAt: now,
          });
        } else {
          // ✅ ถ้าเอกสารยังไม่มี ➔ create ใหม่
          await setDoc(docRef, {
            id: nanoid(),
            page: page.slug,
            sections: cleanSections,
            createAt: now,
            updateAt: now,
          });
        }

        toast.success("บันทึกข้อมูลสำเร็จแล้ว!");
        onClose();
      } catch (error) {
        console.error(error);
        toast.error("บันทึกข้อมูลไม่สำเร็จ!");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* รายการ Sections ที่สามารถเลือกได้ */}
        <div className="flex flex-col px-4 w-1/2 gap-2">
          <h2 className="text-lg font-bold">{lang["available_sections"]}</h2>
          <span className="text-sm text-gray-500 mb-2">
            {lang["available_sections_desc"]}
          </span>

          {/* GROUP SECTIONS */}
          {Object.entries(
            Sections.reduce((acc, section) => {
              if (!acc[section.group]) acc[section.group] = [];
              acc[section.group].push(section);
              return acc;
            }, {})
          ).map(([groupName, groupSections]) => (
            <div
              key={groupName}
              className="border border-gray-300 rounded-md overflow-hidden"
            >
              {/* Group Title */}
              <div
                onClick={() => toggleGroup(groupName)}
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 cursor-pointer flex justify-between items-center font-bold"
              >
                <span>{groupName}</span>
                <span>
                  {expandedGroups[groupName] ? (
                    <IoIosArrowDown />
                  ) : (
                    <IoIosArrowBack />
                  )}
                </span>
              </div>

              {/* Section Items (only show when expanded) */}
              {expandedGroups[groupName] && (
                <div className="flex flex-col gap-2 p-2 bg-white dark:bg-gray-800">
                  {groupSections.map((section) => (
                    <div
                      key={section.name}
                      className="relative flex items-center gap-4 p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={(e) => {
                        if (selectedPreview === section.name) {
                          // ถ้ากดอันเดิม ให้ปิด
                          setSelectedPreview(null);
                          setAnchorEl(null);
                        } else {
                          // ถ้ากดอันใหม่
                          setSelectedPreview(section.name);
                          setAnchorEl(e.currentTarget);
                        }
                      }}
                      onDoubleClick={() => {
                        handleSelectedSection(section);
                        setSelectedPreview(null);
                        setAnchorEl(null);
                      }}
                    >
                      <Image
                        src={section?.thumbnail}
                        alt={section.name}
                        width={30}
                        height={30}
                      />
                      <div className="text-sm font-medium">{section.name}</div>

                      {/* ✅ Tooltip Preview */}
                      <Popover
                        open={
                          Boolean(anchorEl) && selectedPreview === section.name
                        }
                        anchorEl={anchorEl}
                        onClose={() => {
                          setSelectedPreview(null);
                          setAnchorEl(null);
                        }}
                        anchorOrigin={{
                          vertical: "center",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "center",
                          horizontal: "left",
                        }}
                      >
                        <div className="flex flex-col items-center p-4 w-64">
                          <Image
                            src={section.thumbnail}
                            width={400}
                            height={400}
                            alt="preview"
                          />
                          <h3 className="text-md font-bold mt-2">
                            {section.description.th}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {section.description.en}
                          </p>
                        </div>
                      </Popover>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* รายการ Sections ที่เลือกแล้ว */}
        <div className="flex flex-col px-4 w-1/2 gap-2">
          <h2 className="text-lg font-bold">{lang["select_section"]}</h2>
          <span className="text-sm text-gray-500 mb-2">
            {lang["select_section_desc"]}
          </span>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedSections.map((sec) => sec.id)} // <-- ensure unique id
              strategy={verticalListSortingStrategy}
            >
              <div className="w-full gap-2">
                {selectedSections.length > 0 &&
                  selectedSections.map((sec) => (
                    <SortableItem key={sec.id} id={sec.id}>
                      <div
                        className="flex border border-gray-200 rounded-lg bg-gray-100 p-4 items-center cursor-move"
                        onContextMenu={(e) => handleContextMenu(e, sec.id)}
                      >
                        {sec.component}
                      </div>
                    </SortableItem>
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-5 w-full">
        <button
          className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md ${
            selectedSections.length === 0 && "opacity-50 cursor-not-allowed"
          }`}
          disabled={selectedSections.length === 0}
          onClick={handleSubmit}
        >
          {lang["save"]}
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
          onClick={() => onClose()}
        >
          {lang["cancel"]}
        </button>
      </div>

      {/* Context Menu สำหรับลบ Section */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            handleRemoveSection(contextMenu.id);
            handleCloseContextMenu();
          }}
        >
          <div className="flex items-center gap-2 hover:text-red-500">
            <RiDeleteBinLine />
            <span className="text-sm font-bold">ลบ</span>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

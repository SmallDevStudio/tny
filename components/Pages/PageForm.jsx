import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useDB from "@/hooks/useDB";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Sections } from "../Layouts/Sections";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import UploadImage from "../btn/UploadImage";
import OpenLibrary from "../btn/OpenLibrary";
import useLanguage from "@/hooks/useLanguage";
import { db } from "@/services/firebase";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

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

export default function PageForm({ page, onClose }) {
  const [selectedSections, setSelectedSections] = useState([]);
  const [form, setForm] = useState({
    name: "",
    title: { en: "", th: "" },
    description: { en: "", th: "" },
    slug: "",
  });
  const [isSlugEdited, setIsSlugEdited] = useState(false); // ตรวจสอบว่าแก้ไข slug เองหรือไม่
  const { data: session } = useSession();
  const router = useRouter();
  const [contextMenu, setContextMenu] = useState(null);
  const [useSection, setUseSection] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);

  const { lang } = useLanguage();

  // เมื่อ `name.en` เปลี่ยนแปลง ให้สร้าง `slug` อัตโนมัติ เว้นแต่เคยแก้ไขแล้ว
  useEffect(() => {
    if (form.name !== "") {
      const newSlug = generateSlug(form.name);
      console.log(newSlug);
      setForm((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [form.name]);

  // ฟังก์ชันสร้าง `slug`
  const generateSlug = (text) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // ลบอักขระพิเศษ
      .replace(/\s+/g, "-"); // แปลงช่องว่างเป็น `-`
  };

  // อัปเดตค่า `form` และตรวจสอบว่าแก้ไข `slug` หรือไม่
  const handleChange = (field, lang, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleSlugChange = (value) => {
    setIsSlugEdited(true); // บอกว่าผู้ใช้แก้ไข slug แล้ว
    setForm((prev) => ({ ...prev, slug: value }));
  };

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

  const handleAddSection = (sec) => {
    setSelectedSections((prev) => [
      ...prev,
      { ...sec, id: `${sec.name}-${Date.now()}` },
    ]);
  };

  const handleRemoveSection = (id) => {
    setSelectedSections((prev) => prev.filter((item) => item.id !== id));
  };

  const handleContextMenu = (event, id) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      id,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleSubmitPage = async () => {
    if (!form.slug) {
      setError(lang["slug_required"]);
      toast.error(lang["slug_required"]);
      return;
    }

    const pageRef = doc(db, "pages", form.slug);
    const pageSnap = await getDoc(pageRef);

    if (pageSnap.exists()) {
      setError(lang["slug_already_exists"]);
      toast.error(lang["slug_already_exists"]); // แจ้งเตือนว่ามี slug นี้แล้ว
      return; // ❌ หยุดการทำงาน
    }

    const data = {
      ...form,
      sections: selectedSections,
      content: "",
      template: { base: "default", page: "page" },
      creator: session.user.id,
    };

    console.log(data);

    try {
      await setDoc(pageRef, data);
      toast.success(lang["page_added_successfully"]);
      handleClearForm();
      router.push("/admin/pages");
    } catch (error) {
      console.error("Error adding page:", error);
      toast.error(lang["something_went_wrong"]);
    }
  };

  const handleClearForm = () => {
    setForm({
      name: { en: "", th: "" },
      title: { en: "", th: "" },
      description: { en: "", th: "" },
      slug: "",
    });
    setSelectedSections([]);
    setFiles(null);
    onClose();
  };

  const handleRemoveCover = () => {
    setFiles(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          {page ? lang["edit_page"] : lang["add_page"]}
        </h2>
        {/* form */}
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["name"]} <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_name"]})
              </span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["name_write"]}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="slug"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["slug"]} <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_slug"]})
              </span>
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500
                                    ${error ? "border-red-500" : ""}`}
              placeholder={lang["slug_write"]}
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {error}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["title"]} <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_title"]})
              </span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={form?.title.th}
              onChange={(e) => handleChange("title", "th", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["title_write"] + " (Thai)"}
              required
            />
            <input
              type="text"
              name="title"
              id="title"
              value={form?.title.en}
              onChange={(e) => handleChange("title", "en", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["title_write"] + " (English)"}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["description"]}
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_description"]})
              </span>
            </label>
            <textarea
              type="text"
              name="description"
              id="description"
              value={form?.description.th}
              onChange={(e) =>
                handleChange("description", "th", e.target.value)
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["description_write"] + " (Thai)"}
              rows={4}
            />
            <textarea
              type="text"
              name="description"
              id="description"
              value={form?.description.en}
              onChange={(e) =>
                handleChange("description", "en", e.target.value)
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["description_write"] + " (English)"}
              rows={4}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="cover"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["cover"]} <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_cover"]})
              </span>
            </label>
            {files && (
              <div className="flex flex-col w-full mb-2">
                <div className="relative">
                  <Image
                    src={files.url}
                    width={1000}
                    height={1000}
                    alt="Cover"
                    className="w-full h-auto rounded-lg"
                    priority
                  />
                  <Tooltip
                    title={lang["remove-image"]}
                    placement="bottom"
                    arrow
                  >
                    <button
                      type="button"
                      className="absolute top-0 right-0 m-2 p-1 text-white bg-red-500 rounded-full hover:bg-red-600"
                      onClick={() => handleRemoveCover()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                </div>
                <span className="text-sm mt-2">
                  <strong className="mr-2 text-orange-500">File Name:</strong>{" "}
                  {files.file_name}
                </span>
              </div>
            )}
            <OpenLibrary onUpload={setFiles} folder="cover" size={24} />
          </div>
        </div>

        {/* Section And Selected Section */}
        {/*<div className="flex items-center mt-4 mb-2">
                        <input 
                            type="checkbox" 
                            name="useSection" 
                            id="useSection"
                            checked={useSection}
                            onChange={(e) => setUseSection(e.target.checked)} 
                        />
                        <label 
                            htmlFor="useSection" 
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            ใช้ Section
                        </label>
                    </div>*/}
        {useSection && (
          <div className="gap-1 sm:grid-cols-2 sm:gap-2 mt-4">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              เลือก Section{" "}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 sm:col-span-4">
              {/* Section */}
              <div className="w-full gap-2 border border-gray-200 rounded-lg bg-gray-100 p-4 sm:grid-cols-2 sm:gap-4">
                {Sections.filter(
                  (sec) =>
                    !selectedSections.some((sel) => sel.name === sec.name)
                ).map((sec) => (
                  <div
                    key={sec.id}
                    className="p-2 border bg-white rounded-lg cursor-pointer hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSection(sec);
                    }}
                  >
                    {sec.name}
                  </div>
                ))}
              </div>
              {/* Selected Section */}
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                autoScroll={{ enabled: true }}
              >
                <SortableContext
                  items={selectedSections.map((sec) => sec.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="w-full gap-2 border border-gray-200 rounded-lg bg-gray-100 p-4">
                    {selectedSections.map((sec) => (
                      <SortableItem key={sec.id} id={sec.id}>
                        <div
                          className="p-2 border bg-white rounded-lg flex justify-between items-center"
                          onContextMenu={(e) => handleContextMenu(e, sec.id)}
                        >
                          {sec.name}
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            type="submit"
            className="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleSubmitPage}
          >
            {isEditing ? lang["update"] : lang["save"]}
          </button>
          <button
            type="button"
            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleClearForm}
          >
            {lang["cancel"]}
          </button>
        </div>
      </div>

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
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
            handleClose();
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

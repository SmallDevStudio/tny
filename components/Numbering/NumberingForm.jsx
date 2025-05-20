import { useState, useEffect, useRef } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { Divider } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import useDB from "@/hooks/useDB";
import { db } from "@/services/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { useSession } from "next-auth/react";

const optionItems = [
  { value: "courses", name: "Courses" },
  { value: "blogs", name: "blog" },
  { value: "order", name: "Order" },
  { value: "invoice", name: "Invoice" },
  { value: "payment", name: "Payment" },
];

const items = [
  "prefix",
  "group",
  "subgroup",
  "year",
  "month",
  "day",
  "number_digits",
  "suffix",
];

const SortableItem = ({ id, onContextMenu }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onContextMenu={(e) => onContextMenu(e, id)}
      className="text-xs px-2 py-0.5 bg-gray-200 rounded-full cursor-move hover:bg-gray-300"
    >
      {id}
    </div>
  );
};

export default function NumberingForm({ document, onClose, newNumbering }) {
  const [form, setForm] = useState({
    document: "",
    prefix: "",
    suffix: "",
    number_digits: 5,
    start_number: 1,
    year: false,
    month: false,
    day: false,
    group: [],
    subgroup: [],
  });
  const [groups, setGroups] = useState({});
  const [subGroups, setSubGroups] = useState({});
  const [openGroup, setOpenGroup] = useState(false);
  const [openSubGroup, setOpenSubGroup] = useState(false);
  const [lastNumber, setLastNumber] = useState(0);

  const [previewCode, setPreviewCode] = useState("");
  const [formatCode, setFormatCode] = useState(items);
  const [contextMenu, setContextMenu] = useState(null);
  const [removedItems, setRemovedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { lang } = useLanguage();
  const { update, add } = useDB("document_numbering");
  const { subscribe: groupData } = useDB("groups");
  const { subscribe: subGroupData } = useDB("subgroups");
  const { data: session } = useSession();

  const contextMenuRef = useRef(null); // ✅ ป้องกันปัญหา null

  useEffect(() => {
    if (newNumbering) {
      setForm({
        document: "",
        prefix: "",
        suffix: "",
        number_digits: 5,
        start_number: 1,
        year: false,
        month: false,
        day: false,
        group: [],
        subgroup: [],
      });
    }
  }, [newNumbering]);

  // ดึงข้อมูล groups
  useEffect(() => {
    const unsubscribe = groupData((data) => {
      if (data) {
        setGroups(data);
        // ตั้งค่าเริ่มต้นให้ form.group มีค่า value เป็นค่าว่าง
        setForm((prev) => ({
          ...prev,
          group: data.map((g) => ({ name: g.name, value: "" })),
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // ดึงข้อมูล subgroups
  useEffect(() => {
    const unsubscribe = subGroupData((data) => {
      if (data) {
        setSubGroups(data);
        setForm((prev) => ({
          ...prev,
          subgroup: data.map((sg) => ({ name: sg.name, value: "" })),
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // ฟังก์ชันสร้าง Preview Code
  useEffect(() => {
    generatePreviewCode();
  }, [form, formatCode]);

  useEffect(() => {
    if (document) {
      setForm({
        document: document.document,
        prefix: document.prefix,
        suffix: document.suffix,
        number_digits: document.number_digits,
        start_number: document.start_number,
        year: document.year,
        month: document.month,
        day: document.day,
        group: document.group ? document.group : groups,
        subgroup: document.subgroup ? document.subgroup : subGroups,
      });
    }
  }, [document]);

  const generatePreviewCode = () => {
    const {
      prefix,
      suffix,
      number_digits,
      start_number,
      year,
      month,
      day,
      group,
      subgroup,
    } = form;

    const yearValue = year ? new Date().getFullYear().toString().slice(-2) : "";
    const monthValue = month
      ? (new Date().getMonth() + 1).toString().padStart(2, "0")
      : "";
    const dayValue = day
      ? new Date().getDate().toString().padStart(2, "0")
      : "";
    const groupValue = group.length > 0 ? group[0]?.value || "" : "";
    const subgroupValue = subgroup.length > 0 ? subgroup[0]?.value || "" : "";
    const numberValue = start_number.toString().padStart(number_digits, "0");

    const code = formatCode
      .map((item) => {
        switch (item) {
          case "prefix":
            return prefix;
          case "group":
            return groupValue;
          case "subgroup":
            return subgroupValue;
          case "year":
            return yearValue;
          case "month":
            return monthValue;
          case "day":
            return dayValue;
          case "number_digits":
            return numberValue;
          case "suffix":
            return suffix;
          default:
            return "";
        }
      })
      .join("");

    setPreviewCode(code);
    setLastNumber(numberValue);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = formatCode.indexOf(active.id);
      const newIndex = formatCode.indexOf(over.id);
      setFormatCode(arrayMove(formatCode, oldIndex, newIndex));
    }
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, item });
  };

  const removeFormatItem = (item) => {
    setFormatCode(formatCode.filter((i) => i !== item));
    setRemovedItems([...removedItems, item]);
    setContextMenu(null);
  };

  const addFormatItem = (item) => {
    setFormatCode([...formatCode, item]);
    setRemovedItems(removedItems.filter((i) => i !== item));
    setContextMenu(null);
  };

  const handleClear = () => {
    setForm({
      document: "",
      prefix: "",
      suffix: "",
      number_digits: 5,
      start_number: 1,
      year: false,
      month: false,
      day: false,
      group: [],
      subgroup: [],
    });
  };

  const handleSubmit = async () => {
    if (!form.document) {
      toast.error(lang["document_select_error"]);
      return;
    }

    // Filter formatCode เฉพาะที่แสดงจริง
    const filteredFormatCode = formatCode.filter((item) => {
      switch (item) {
        case "prefix":
          return !!form.prefix;
        case "suffix":
          return !!form.suffix;
        case "number_digits":
          return !!form.number_digits;
        case "year":
          return form.year;
        case "month":
          return form.month;
        case "day":
          return form.day;
        case "group":
          return openGroup;
        case "subgroup":
          return openSubGroup;
        default:
          return false;
      }
    });

    try {
      setLoading(true);
      const docRef = doc(db, "numbering", form.document);
      const docSnap = await getDoc(docRef);

      // หา last_number ใหม่
      let lastNumber = form.start_number;
      if (!docSnap.exists()) {
        const snapshot = await getDocs(collection(db, form.document));

        const maxId = snapshot.docs
          .map((doc) => {
            const id = doc.id;
            const parsed = parseInt(id, 10);
            return isNaN(parsed) ? 0 : parsed;
          })
          .reduce((max, curr) => Math.max(max, curr), 0);

        lastNumber = maxId + 1;
      }

      const dataToSave = {
        ...form,
        group: openGroup ? form.group : [],
        subgroup: openSubGroup ? form.subgroup : [],
        formatCode: filteredFormatCode,
        previewCode,
        last_number: lastNumber ? lastNumber : form.start_number,
        updated_by: session?.user?.userId,
        updated_at: new Date().toISOString(),
      };

      if (docSnap.exists()) {
        await updateDoc(docRef, dataToSave);
        toast.success(lang["numbering_updated_successfully"]);
      } else {
        dataToSave.created_by = session?.user?.userId;
        dataToSave.created_at = new Date().toISOString();
        await setDoc(docRef, dataToSave);
        toast.success(lang["numbering_created_successfully"]);
      }

      handleClear();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(lang["error_occured"]);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันอัปเดตค่า group หรือ subgroup
  const handleChange = (type, value, name) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.name === name ? { ...item, value } : item
      ),
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 w-[600px] h-full">
      <div className="flex flex-row justify-between items-center bg-orange-500 text-white p-2 w-full">
        <h2>{document ? "แก้ไข" : "เพิ่ม"}</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:text-gray-500"
        >
          <IoClose size={20} />
        </button>
      </div>

      <div className="flex flex-col px-4 py-2">
        <span className="text-gray-600">Preview Code</span>
        <div className="flex items-center justify-center text-lg font-bold text-blue-600 bg-gray-100 p-2 rounded-md">
          {previewCode}
        </div>
      </div>

      <Divider />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={formatCode}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col bg-gray-100 px-4 pt-2 pb-4 gap-4">
            <span>เลื่อนเพื่อเปลี่ยนตำแหน่ง</span>
            <div className="flex flex-wrap gap-2 bg-gray-100 rounded-md">
              {formatCode.map((item) => {
                const isVisible = (() => {
                  switch (item) {
                    case "prefix":
                      return !!form.prefix;
                    case "suffix":
                      return !!form.suffix;
                    case "number_digits":
                      return !!form.number_digits;
                    case "year":
                      return form.year;
                    case "month":
                      return form.month;
                    case "day":
                      return form.day;
                    case "group":
                      return openGroup;
                    case "subgroup":
                      return openSubGroup;
                    default:
                      return false;
                  }
                })();

                return isVisible ? (
                  <SortableItem
                    key={item}
                    id={item}
                    onContextMenu={handleContextMenu}
                  />
                ) : null;
              })}
            </div>
          </div>
        </SortableContext>
      </DndContext>

      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute bg-white border shadow-md p-2 rounded-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="block px-2 py-1 text-red-500 hover:bg-gray-200"
            onClick={() => removeFormatItem(contextMenu.item)}
          >
            ลบ {contextMenu.item}
          </button>
        </div>
      )}

      {removedItems.length > 0 && (
        <div className="p-4">
          <span className="text-gray-600">เพิ่มกลับ:</span>
          <div className="flex flex-wrap gap-2">
            {removedItems.map((item) => (
              <button
                key={item}
                className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => addFormatItem(item)}
              >
                + {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <Divider />

      {/* Form */}
      <div className="flex flex-col px-4 py-2 gap-2">
        <div>
          <label htmlFor="document">{lang["documents"]}</label>
          <select
            name="document"
            id="document"
            value={form?.document}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            onChange={(e) => setForm({ ...form, document: e.target.value })}
          >
            <option value="">-- {lang["select_option"]} --</option>
            {optionItems.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="prefix">Prefix</label>
            <input
              type="text"
              name="prefix"
              id="prefix"
              value={form?.prefix}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              onChange={(e) => setForm({ ...form, prefix: e.target.value })}
            />
          </div>

          <div className="flex flex-row items-center gap-2">
            <label htmlFor="suffix">Suffix</label>
            <input
              type="text"
              name="suffix"
              id="suffix"
              value={form?.suffix}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              onChange={(e) => setForm({ ...form, suffix: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-row items-center gap-2">
          <label htmlFor="number_digits">{lang["number_digits"]}</label>
          <input
            type="number"
            name="number_digits"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-20 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={form?.number_digits}
            onChange={(e) =>
              setForm({ ...form, number_digits: e.target.value })
            }
          />
          <span className="text-xs text-red-500">
            ({lang["number_digits_placeholder"]})
          </span>
        </div>

        <div className="flex flex-row items-center gap-2">
          <label htmlFor="start_number">{lang["start_number"]}</label>
          <input
            type="number"
            name="start_number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-20 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={form?.start_number}
            onChange={(e) => setForm({ ...form, start_number: e.target.value })}
          />
          <span className="text-xs text-red-500">
            ({lang["start_number_placeholder"]})
          </span>
        </div>

        <div className="flex flex-row items-center gap-6">
          <div className="flex flex-row items-center gap-1">
            <input
              type="checkbox"
              name="year"
              checked={form?.year}
              onChange={(e) => setForm({ ...form, year: e.target.checked })}
            />
            <label htmlFor="year">Year</label>
          </div>

          <div className="flex flex-row items-center gap-1">
            <input
              type="checkbox"
              name="month"
              checked={form?.month}
              onChange={(e) => setForm({ ...form, month: e.target.checked })}
            />
            <label htmlFor="month">Month</label>
          </div>

          <div className="flex flex-row items-center gap-1">
            <input
              type="checkbox"
              name="day"
              checked={form?.day}
              onChange={(e) => setForm({ ...form, day: e.target.checked })}
            />
            <label htmlFor="day">Day</label>
          </div>
        </div>

        <div className="flex flex-row items-center gap-8">
          <div>
            <input
              type="checkbox"
              name="openGroup"
              checked={openGroup}
              onChange={(e) => setOpenGroup(e.target.checked)}
            />
            <label htmlFor="openGroup">{lang["group"]}</label>
          </div>

          <div>
            <input
              type="checkbox"
              name="openSubGroup"
              checked={openSubGroup}
              onChange={(e) => setOpenSubGroup(e.target.checked)}
            />
            <label htmlFor="subGroups">{lang["subgroup"]}</label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {openGroup && (
            <div>
              <h3 className="font-semibold">{lang["group"]}</h3>
              {groups.length > 0 ? (
                groups.map((group, index) => (
                  <div key={index} className="flex flex-row items-center gap-2">
                    <label>{group.name}</label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-20 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      value={
                        form.group.find((g) => g.name === group.name)?.value ||
                        ""
                      }
                      onChange={(e) =>
                        handleChange("group", e.target.value, group.name)
                      }
                    />
                  </div>
                ))
              ) : (
                <span>{lang["null_select_option"]}</span>
              )}
            </div>
          )}

          {openSubGroup && (
            <div>
              <h3 className="font-semibold">{lang["subgroup"]}</h3>
              {subGroups.length > 0 ? (
                subGroups.map((subgroup, index) => (
                  <div key={index} className="flex flex-row items-center gap-2">
                    <label>{subgroup.name}</label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-20 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      value={
                        form.subgroup.find((sg) => sg.name === subgroup.name)
                          ?.value || ""
                      }
                      onChange={(e) =>
                        handleChange("subgroup", e.target.value, subgroup.name)
                      }
                    />
                  </div>
                ))
              ) : (
                <span>{lang["null_select_option"]}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <Divider />

      <div className="flex flex-row items-center justify-center gap-4 p-4">
        <button
          className="w-full py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg"
          onClick={handleSubmit}
        >
          {lang["save"]}
        </button>

        <button
          className="w-full py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
          onClick={handleClear}
        >
          {lang["cancel"]}
        </button>
      </div>
    </div>
  );
}

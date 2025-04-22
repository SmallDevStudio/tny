import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "@/components/btn/UploadImage";
import Image from "next/image";
import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { IoClose } from "react-icons/io5";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function FormContentHightLight({
  title,
  setTitle,
  description,
  setDescription,
  contents,
  setContents,
  language,
  setLanguage,
  setEditMode,
  handleSubmit,
}) {
  const [dataPath, setDataPath] = useState("");
  const [data, setData] = useState({});
  const { t, lang } = useLanguage();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchContentList = async () => {
      if (dataPath) {
        const q = query(collection(db, dataPath), where("active", "==", true));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(data);
      }
    };

    fetchContentList();
  }, [dataPath]);

  const e = (data) => {
    return data?.[language] || "";
  };

  const handleSelectContent = (item) => {
    const exists = contents.find((c) => c.id === item.id);

    if (exists) {
      setContents((prev) => prev.filter((c) => c.id !== item.id));
    } else if (contents.length < 5) {
      setContents((prev) => [...prev, item]);
    } else {
      toast.error("สามารถเลือกได้สูงสุด 4 รายการ");
    }
  };

  const handleRemoveContent = (item) => {
    setContents((prev) => prev.filter((c) => c.id !== item.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = contents.findIndex((c) => c.id === active.id);
      const newIndex = contents.findIndex((c) => c.id === over.id);
      setContents((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleClear = () => {
    setLanguage("th");
    setEditMode(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col border border-gray-300 rounded-md p-4 gap-2 shadow-lg">
        <div className="flex flex-col gap-2">
          <label htmlFor="title">{lang["title"]}</label>
          <input
            type="text"
            id="title-th"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={title?.th}
            onChange={(e) => setTitle({ ...title, th: e.target.value })}
            placeholder="TH"
          />
          <input
            type="text"
            id="title-en"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={title?.en}
            onChange={(e) => setTitle({ ...title, en: e.target.value })}
            placeholder="EN"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description">{lang["description"]}</label>
          <textarea
            type="text"
            id="description-th"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={description?.th}
            onChange={(e) =>
              setDescription({ ...description, th: e.target.value })
            }
            placeholder="TH"
            rows={4}
          />
          <textarea
            type="text"
            id="description-en"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={description?.en}
            onChange={(e) =>
              setDescription({ ...description, en: e.target.value })
            }
            placeholder="EN"
            rows={4}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col border rounded-xl p-2">
              <h3>Contents</h3>
              <div className="flex flex-row items-center gap-2">
                <label htmlFor="data">Data:</label>
                <select
                  id="data"
                  value={dataPath}
                  onChange={(e) => setDataPath(e.target.value)}
                  className="border rounded-md p-1"
                >
                  <option value="">Select Data</option>
                  <option value="courses">Courses</option>
                  <option value="blogs">Blog</option>
                  <option value="articles">Article</option>
                  <option value="news">News</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {data && data.length > 0 ? (
                  data
                    .filter((item) => !contents.find((c) => c.id === item.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-row items-center gap-2 cursor-pointer border rounded-xl px-2 py-1 bg-gray-100 hover:bg-gray-200"
                        onClick={() => handleSelectContent(item)}
                      >
                        <span className="text-sm">{e(item.name)}</span>
                      </div>
                    ))
                ) : (
                  <span className="text-sm">No data</span>
                )}
              </div>
            </div>

            {/* Selected Content */}
            <div className="border rounded-xl p-2">
              <h3>Select Contents</h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={contents.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2 mt-2">
                    {contents.length > 0 ? (
                      contents.map((item) => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          renderLabel={e}
                          handleRemoveContent={handleRemoveContent}
                        >
                          <div className="flex flex-row items-center justify-between gap-2 cursor-pointer border rounded-xl px-2 py-1 bg-gray-100 hover:bg-gray-200">
                            <span className="text-sm">{e(item.name)}</span>
                            <IoClose
                              size={20}
                              className="cursor-pointer text-red-500"
                              onClick={(e) => {
                                e.stopPropagation(); // ✅ ป้องกัน drag event
                                handleRemoveContent(item);
                              }}
                            />
                          </div>
                        </SortableItem>
                      ))
                    ) : (
                      <span className="text-sm">No data</span>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 w-full mt-5">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 p-2 rounded-md text-white font-bold"
          >
            {lang["save"]}
          </button>

          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-600 p-2 rounded-md text-white font-bold"
          >
            {lang["cancel"]}
          </button>
        </div>
      </div>
    </div>
  );
}

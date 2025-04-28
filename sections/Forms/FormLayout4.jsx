import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "@/components/btn/UploadImage";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
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
import SelectContents from "@/components/Selected/SelectContents";

export default function FormLayout4({
  title,
  setTitle,
  description,
  setDescription,
  image,
  setImage,
  contents,
  setContents,
  contentCollection,
  setContentCollection,
  style,
  setStyle,
  type,
  setType,
  language,
  setLanguage,
  setEditMode,
  handleSubmit,
}) {
  const [contentsData, setContentsData] = useState([]);
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (contentCollection) {
      const fetchData = async () => {
        try {
          const q = query(
            collection(db, contentCollection),
            where("active", "==", true)
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setContentsData(data);
        } catch (error) {
          console.error("Error fetching contents:", error);
          setContentsData([]); // set เป็น empty ถ้า error
        }
      };
      fetchData();
    } else {
      setContentsData([]); // ถ้าเลือก blank ให้เคลียร์
    }
  }, [contentCollection]); // ✅ อย่าลืมเพิ่ม contentCollection ตรงนี้

  const e = (data) => {
    return data?.[language] || "";
  };

  const handleUpload = (newImages) => {
    // newImages = array of uploaded image objects [{url: "..."}]
    setImage((prev) => [...(prev || []), ...newImages]);
  };

  const handleImageRemove = (indexToRemove) => {
    setImage((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClear = () => {
    setTitle({});
    setDescription({});
    setImage([]);
    setLanguage("th");
    setEditMode(false);
  };

  const handleSelectContent = (item) => {
    const alreadySelected = contents.find((c) => c.id === item.id);
    if (!alreadySelected) {
      setContents((prev) => [
        ...prev,
        {
          ...item,
          page: contentCollection, // 👉 เพิ่ม page ที่เลือกไว้ลงไปในข้อมูลนี้
        },
      ]);
    }
  };

  const handleRemoveContent = (id) => {
    setContents((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full">
      {/* Edit Mode */}
      <div className="flex flex-col border border-gray-300 rounded-md p-4 gap-2 shadow-lg">
        <div className="flex flex-col gap-2">
          <label htmlFor="title">{lang["title"]}</label>
          <input
            type="text"
            id="title-th"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={title.th}
            onChange={(e) => setTitle({ ...title, th: e.target.value })}
            placeholder="TH"
          />
          <input
            type="text"
            id="title-en"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={title.en}
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
            value={description.th}
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
            value={description.en}
            onChange={(e) =>
              setDescription({ ...description, en: e.target.value })
            }
            placeholder="EN"
            rows={4}
          />
        </div>

        <div className="flex flex-row items-center gap-8">
          <div>
            <label htmlFor="gap">{lang["gap"]}</label>
            <input
              type="number"
              name="gap"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={style.gap}
              onChange={(e) => setStyle({ ...style, gap: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="cols">{lang["cols"]}</label>
            <input
              type="number"
              name="cols"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={style.cols}
              onChange={(e) => setStyle({ ...style, cols: e.target.value })}
            />
          </div>
        </div>

        {/* Upload Image */}
        <div className="flex flex-row items-center gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="type">{lang["select_type"]}</label>
            <select
              name="type"
              id="type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-32 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">{lang["select_type"]}</option>
              <option value="images">{lang["images"]}</option>
              <option value="contents">{lang["content"]}</option>
            </select>
          </div>

          {type === "contents" && (
            <div className="flex flex-col">
              <label htmlFor="selectContent">
                {lang["select_content"]}
                <select
                  name="selectContent"
                  id="selectContent"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-32 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={contentCollection}
                  onChange={(e) => setContentCollection(e.target.value)}
                >
                  <option value="">{lang["select_content"]}</option>
                  <option value="courses">{lang["courses"]}</option>
                  <option value="blogs">{lang["blog"]}</option>
                  <option value="articles">{lang["articles"]}</option>
                  <option value="news">{lang["news"]}</option>
                </select>
              </label>
            </div>
          )}
        </div>
        <div>
          <SelectContents
            contents={contents}
            setContents={setContents}
            contentsData={contentsData}
            contentCollection={contentCollection}
          />
        </div>
        {type === "images" && (
          <div className="flex flex-col gap-2 w-full">
            <div className="relative">
              {image &&
                image.length > 0 &&
                image.map((m, index) => (
                  <div key={index} className="relative inline-block m-1">
                    <Image
                      src={m.url}
                      alt={`image-${index}`}
                      width={120}
                      height={120}
                      className="object-cover rounded-md border"
                    />
                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => handleImageRemove(index)}
                    >
                      <IoClose size={14} />
                    </button>
                  </div>
                ))}
            </div>
            <UploadImage size={24} onUpload={handleUpload} folder="sections" />
          </div>
        )}

        {/* Save Button */}
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

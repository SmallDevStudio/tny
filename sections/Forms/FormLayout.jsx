import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import Layout3 from "@/sections/Layout3";
import UploadImage from "@/components/btn/UploadImage";
import useDB from "@/hooks/useDB";
import Image from "next/image";
import TiptapEditor from "@/components/Tiptap/TiptapEditor";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

export default function FormLayout({
  title,
  setTitle,
  description,
  setDescription,
  image,
  setImage,
  contents,
  setContents,
  language,
  setLanguage,
  setEditMode,
  handleSubmit,
}) {
  const { t, lang } = useLanguage();

  const e = (data) => {
    return data?.[language] || "";
  };

  const handleUpload = (image) => {
    setImage(image[0]);
  };

  const handleContentChange = (newContent) => {
    setContents((prevContent) => ({
      ...prevContent,
      [language]: newContent, // ✅ อัปเดตค่าของภาษาที่เลือกเท่านั้น
    }));
  };

  const handleClear = () => {
    setTitle({});
    setDescription({});
    setImage({});
    setContents({});
    setLanguage("th");
    setEditMode(false);
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

        {/* Upload Image */}
        <div className="flex flex-col gap-2 w-full">
          <div className="relative">
            {image && image.url && (
              <Image
                src={image.url}
                alt="image"
                width={200}
                height={200}
                className="object-cover"
                priority
              />
            )}
          </div>
          <UploadImage size={24} onUpload={handleUpload} folder="sections" />
        </div>

        {/* Editor */}
        <div className=" w-full">
          <div className="flex flex-row items-center justify-end gap-2 w-full">
            <button
              className={`px-4 py-1 rounded-md font-bold transition ${
                language === "th"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => setLanguage("th")}
            >
              TH
            </button>
            <button
              className={`px-4 py-1 rounded-md font-bold transition ${
                language === "en"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>
          <TiptapEditor
            content={contents[language]}
            onChange={handleContentChange}
          />
        </div>

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

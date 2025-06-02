import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "@/components/btn/UploadImage";
import Image from "next/image";
import TiptapEditor from "@/components/Tiptap/TiptapEditor";

export default function FormCustoms({
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

  const handleClear = () => {
    setLanguage("th");
    setEditMode(false);
    setTiptapContent({});
  };

  const handleContentChange = (content, lang) => {
    setContents((prev) => ({ ...prev, [lang]: content }));
  };

  console.log("contents", contents);
  console.log("language", language);

  return (
    <div className="w-full">
      {/* Edit Mode */}
      <div className="flex flex-col border border-gray-300 rounded-md p-4 gap-2 shadow-lg">
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

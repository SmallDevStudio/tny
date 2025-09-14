import React, { useState, useEffect } from "react";
import axios from "axios";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Tooltip, Slide, Dialog, Divider } from "@mui/material";
import { IoClose } from "react-icons/io5";
import dynamic from "next/dynamic";
const TiptapEditor = dynamic(() => import("@/components/Tiptap/TiptapEditor"), {
  ssr: false,
});

export default function VideoModal({ data, onEdit, onClose }) {
  const [title, setTitle] = useState({ th: "", en: "" });
  const [description, setDescription] = useState({ th: "", en: "" });
  const [content, setContent] = useState({
    th: "กรอกรายละเอียด",
    en: "Start typing here...",
  });
  const [thumbnail, setThumbnail] = useState("");
  const [language, setLanguage] = useState("th");

  const { t, lang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setThumbnail(data.thumbnail);
      setTitle({ th: data.title.th, en: data.title.en });
      setDescription({ th: data.description.th, en: data.description.en });
      setContent({ th: data.content.th, en: data.content.en });
    }
  }, [data]);

  const handleClear = () => {
    setThumbnail(null);
    setTitle({ th: "", en: "" });
    setDescription({ th: "", en: "" });
    setContent({ th: "กรอกรายละเอียด", en: "Start typing here..." });
    setLanguage("th");
    onClose();
  };

  const handleEdit = () => {
    if (!title.th || !title.en) {
      toast.error(t("please_fill_in_title"));
      return;
    }
    const editData = {
      ...data,
      title,
      description,
      content,
    };
    onEdit(editData);
  };

  const handleContentChange = (newContent) => {
    setContent((prevContent) => ({
      ...prevContent,
      [language]: newContent, // ✅ อัปเดตค่าของภาษาที่เลือกเท่านั้น
    }));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-row items-center justify-between bg-orange-500 p-2 text-white">
        <span className="font-bold text-lg">{lang["video_management"]}</span>
        <button onClick={onClose}>
          <IoClose size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 bg-white p-4">
        {/* video & thumbnail */}
        <div className="flex flex-col gap-2">
          {/* Video Thumbnail */}
          {thumbnail && (
            <div>
              <Image
                src={thumbnail}
                alt="thumbnail"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="title" className="block font-bold">
            {lang["title"]}:
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex flex-row items-center gap-2">
              <label htmlFor="title.th" className="block font-bold">
                TH:
              </label>
              <input
                name="title-th"
                value={title.th}
                onChange={(e) => setTitle({ ...title, th: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["title_placeholder"] + " (th)"}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <label htmlFor="title.en" className="block font-bold">
                EN:
              </label>
              <input
                name="title-en"
                value={title.en}
                onChange={(e) => setTitle({ ...title, en: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["title_placeholder"] + " (en)"}
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block font-bold">
            {lang["description"]}:
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex flex-row gap-2">
              <label htmlFor="description.th" className="block font-bold">
                TH:
              </label>
              <textarea
                name="description-th"
                value={description.th}
                onChange={(e) =>
                  setDescription({ ...description, th: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["description_placeholder"] + " (th)"}
                rows="4"
              />
            </div>
            <div className="flex flex-row gap-2">
              <label htmlFor="description.en" className="block font-bold">
                EN:
              </label>
              <textarea
                name="description-th"
                value={description.en}
                onChange={(e) =>
                  setDescription({ ...description, en: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["description_placeholder"] + " (en)"}
                rows="4"
              />
            </div>
          </div>

          {/* Editor */}
          <div className="w-full mt-4">
            <div className="flex flex-row items-center gap-1 w-full">
              <button
                className={`px-4 py-1 rounded-t-md font-bold transition ${
                  language === "th"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
                onClick={() => setLanguage("th")}
              >
                TH
              </button>
              <button
                className={`px-4 py-1 rounded-t-md font-bold transition ${
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
              content={content[language]}
              onChange={(contents) => handleContentChange(contents)}
            />
          </div>
        </div>
        <Divider />
        <div className="flex flex-row justify-center items-center gap-4">
          <Tooltip title={lang["save"]} placement="top">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
              onClick={handleEdit}
            >
              {lang["save"]}
            </button>
          </Tooltip>
          <Tooltip title={lang["cancel"]} placement="top">
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              onClick={handleClear}
            >
              {lang["cancel"]}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

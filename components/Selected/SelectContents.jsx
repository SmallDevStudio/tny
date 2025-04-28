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

export default function SelectContents({
  contentsData,
  contents,
  setContents,
  contentCollection,
}) {
  const { t, lang } = useLanguage();
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
    contentsData.length > 0 && (
      <div className="grid grid-cols-2 bg-gray-50 rounded-lg w-full">
        {/* contents data */}
        <div className="flex flex-col gap-2 px-4 py-2">
          <span>{lang["content"]}:</span>
          {contentsData.map((m) => (
            <div
              key={m.id}
              className="flex items-center px-2 py-1 bg-gray-200 hover:bg-gray-300 cursor-pointer w-1/2 rounded-full"
              onClick={() => handleSelectContent(m)}
            >
              <span>{t(m.name)}</span>
            </div>
          ))}
        </div>
        {/* select content */}
        <div className="flex flex-col gap-2 px-4 py-2">
          <span>{lang["select_content"]}:</span>
          {contents &&
            contents.map((item, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between px-2 py-1 bg-white rounded-md shadow-sm w-1/2"
              >
                <span>{t(item.name)}</span>
                <IoClose
                  size={18}
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleRemoveContent(item.id)}
                />
              </div>
            ))}
        </div>
      </div>
    )
  );
}

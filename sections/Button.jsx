import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import { toast } from "react-toastify";
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

export default function ButtonSession({
  contentId,
  pageData,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [buttons, setButtons] = useState([]);
  const [color, setColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [text, setText] = useState({ th: "", en: "" });
  const [url, setUrl] = useState({ th: "", en: "" });

  const { lang, t, selectedLang } = useLanguage();

  return (
    pageData?.button?.useButton && (
      <div className="my-2 text-center">
        <Link href={pageData.button.link} target="_blank">
          <button
            className="px-4 py-2 text-white"
            style={{
              backgroundColor: pageData.button.color || "#000000",
            }}
          >
            {selectedLang === "th"
              ? pageData.button.text.th
              : pageData.button.text.en}
          </button>
        </Link>
      </div>
    )
  );
}

import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import FormContentList from "./Forms/FormContentList";
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
import ContentCard from "@/components/Card/ContentCard";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useRouter } from "next/router";

const sampleData = {
  title: {
    th: "ทดสอบหัวเรื่อง",
    en: "Sample title",
  },
  description: {
    th: "คำอธิบายภาษาไทย",
    en: "English description",
  },
  image: {
    url: "/images/sections/sample-image-500x210.png",
  },
  contents: [
    {
      id: 1,
      image: { url: "/images/sections/sample-image-500x210.png" },
      title: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      slug: "1",
    },
    {
      id: 2,
      image: { url: "/images/sections/sample-image-500x210.png" },
      title: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      slug: "2",
    },
    {
      id: 3,
      image: { url: "/images/sections/sample-image-500x210.png" },
      title: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      slug: "3",
    },
    {
      id: 4,
      image: { url: "/images/sections/sample-image-500x210.png" },
      title: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      slug: "3",
    },
  ],
  style: {
    bgColor: "#757474",
    titleColor: "#f5f2f2",
    titleFontSize: "40px",
    desecriptionColor: "#f5f2f2",
    descriptionFontSize: "20px",
    gap: 8,
    cols: 3,
  },
};

export default function ContentList({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [contents, setContents] = useState("");
  const [contentList, setContentList] = useState([]);
  const [style, setStyle] = useState({});

  const router = useRouter();

  const { t, lang } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) return;

      const sectionRef = doc(db, "sections", contentId);
      const sectionSnap = await getDoc(sectionRef);

      if (sectionSnap.exists()) {
        const data = sectionSnap.data();
        setTitle(data?.title || sampleData.title);
        setDescription(data?.description || sampleData.description);
        setContents(data?.contents);
        setStyle(data?.style || sampleData.style);
      } else {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setStyle(sampleData.style);
      }
    };

    fetchData();
  }, [contentId]); // ✅ ต้องมี dependency contentId

  useEffect(() => {
    const fetchContentList = async () => {
      if (!contents) {
        setContentList(sampleData.contents);
        return;
      } else {
        const q = query(collection(db, contents), where("active", "==", true));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContentList(data);
      }
    };

    fetchContentList();
  }, [contents]);

  const e = (data) => data?.[language] || "";

  const handleSubmit = async () => {
    const newData = {
      title,
      description,
      contents,
      style,
      component: "contentList",
    };

    try {
      if (contentId) {
        // update
        const sectionRef = doc(db, "sections", contentId);
        await setDoc(sectionRef, newData, { merge: true });
        toast.success("อัปเดตข้อมูลเรียบร้อย");
      } else {
        // create
        const docRef = await addDoc(collection(db, "sections"), newData);
        toast.success("สร้าง section ใหม่เรียบร้อย: " + docRef.id);
      }

      setEditMode(false);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
      toast.error("บันทึกไม่สำเร็จ");
    }
  };

  return (
    <section>
      <div className="py-4 px-4 w-full lg:py-8 lg:px-6">
        {title && (
          <div className="mx-auto max-w-screen-sm text-center ">
            <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
              {t(title)}
            </h2>
            {description && (
              <p className="font-light text-gray-500 text-sm lg:text-md dark:text-gray-400">
                {t(description)}
              </p>
            )}
          </div>
        )}
      </div>
      {/* contents list */}
      <div className="max-w-screen-xl px-4 pb-4 mx-auto">
        <div className="flex items-center justify-end group gap-1 mb-2 cursor-pointer ">
          <span
            className="text-sm text-gray-500 dark:text-gray-200 hover:text-orange-700"
            onClick={() => router.push(contents ? `/${contents}` : null)}
          >
            {lang["content_All"]}
          </span>
          <IoArrowForwardOutline className="text-sm text-gray-500 dark:text-gray-200 hover:text-orange-700" />
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${style.cols} gap-${style.gap}`}
        >
          {contentList.map((item) => (
            <ContentCard key={item.id} item={item} pathname={contents} />
          ))}
        </div>
      </div>

      {editMode && (
        <div className="flex justify-center p-4">
          <FormContentList
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            contents={contents}
            setContents={setContents}
            style={style}
            setStyle={setStyle}
            contentId={contentId}
            editMode={editMode}
            language={language}
            setLanguage={setLanguage}
            setEditMode={setEditMode}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </section>
  );
}

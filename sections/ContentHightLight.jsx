import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import FormContentHightLight from "./Forms/FormContentHightLight";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

const sampleData = {
  title: {
    th: "ทดสอบหัวเรื่อง",
    en: "Sample title",
  },
  description: {
    th: "คําอธิบายภาษาไทย",
    en: "English description",
  },
  contents: [
    {
      id: 1,
      image: { url: "/images/sections/sample-image-500x210.png" },
      name: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      url: "https://www.thenewyou.co.th",
      createdAt: new Date(),
    },
    {
      id: 2,
      image: { url: "/images/sections/sample-image-500x210.png" },
      name: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      url: "https://www.thenewyou.co.th",
      createdAt: new Date(),
    },
    {
      id: 3,
      image: { url: "/images/sections/sample-image-500x210.png" },
      name: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      url: "https://www.thenewyou.co.th",
      createdAt: new Date(),
    },
    {
      id: 4,
      image: { url: "/images/sections/sample-image-500x210.png" },
      name: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      url: "https://www.thenewyou.co.th",
      createdAt: new Date(),
    },
    {
      id: 5,
      image: { url: "/images/sections/sample-image-500x210.png" },
      name: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      url: "https://www.thenewyou.co.th",
      createdAt: new Date(),
    },
  ],
  style: {
    color: "#ff0000",
    backgroundColor: "#00ff00",
    fontSize: "24px",
    fontWeight: "bold",
  },
};

export default function ContentHightLight({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode,
}) {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [contents, setContents] = useState([]);
  const router = useRouter();

  const { t, lang } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) return;

      const sectionRef = doc(db, "sections", contentId);
      const sectionSnap = await getDoc(sectionRef);

      if (sectionSnap.exists()) {
        const data = sectionSnap.data();
        setTitle(data?.title);
        setDescription(data?.description);
        setContents(data?.contents);
      } else {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setContents(sampleData.contents);
      }
    };

    fetchData();
  }, [contentId]); // ✅ ต้องมี dependency contentId

  const goTo = (url) => {
    if (url) window.open(url, "_blank");
  };

  const e = (data) => data?.[language] || "";

  const handleSubmit = async () => {
    const newData = {
      title,
      description,
      contents,
      component: "contentHightLight",
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
    <section className="bg-white dark:bg-gray-900">
      {title && (
        <div className="py-4 px-4 w-full lg:py-6 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center lg:mb-1 ">
            <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
              {editMode ? e(title) : t(title)}
            </h2>
            <p className="font-light text-gray-500 text-sm lg:text-md dark:text-gray-400">
              {editMode ? e(description) : t(description)}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left main item */}
        <div
          onClick={() => goTo(contents[0]?.url)}
          className="col-span-1 md:col-span-2 cursor-pointer rounded-xl overflow-hidden shadow-lg bg-white hover:scale-105 transition-all"
        >
          <Image
            src={contents[0]?.image?.url}
            alt={contents[0]?.name?.en}
            width={1280}
            height={720}
            className="w-full h-[260px] object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-blue-700 font-semibold mb-1">
              {t(contents[0]?.tag) || "หมวดหมู่"}
            </p>
            <h3 className="text-xl font-bold text-orange-500 mb-2 line-clamp-3">
              {t(contents[0]?.name)}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {t(contents[0]?.description)}
            </p>
            <span className="text-xs text-gray-500">
              {moment(contents[0]?.createdAt).format("LL")}
            </span>
          </div>
        </div>

        {/* Right smaller items */}
        <div className="grid grid-cols-2 gap-4">
          {contents.slice(1).map((item) => (
            <div
              key={item.id}
              onClick={() => goTo(item.url)}
              className="flex flex-col cursor-pointer rounded-xl overflow-hidden bg-white shadow-lg hover:scale-105 transition-all"
            >
              <Image
                src={item?.image?.url}
                alt={item?.name?.en}
                width={600}
                height={300}
                className="w-full h-[120px] object-cover"
              />
              <div className="p-3">
                <h4 className="text-sm font-semibold text-orange-500 mb-1 line-clamp-2">
                  {t(item?.name)}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {t(item?.description)}
                </p>
                <span className="text-xs text-gray-400 block mt-1">
                  {moment(item?.createdAt).format("LL")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editMode && (
        <div className="flex justify-center p-4">
          <FormContentHightLight
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            contents={contents}
            setContents={setContents}
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

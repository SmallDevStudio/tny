import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import FormLayout5 from "./Forms/FormLayout5";
import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";

const sampleData = {
  title: {
    th: "ทดสอบหัวเรื่อง",
    en: "Sample title",
  },
  description: {
    th: "คำอธิบายภาษาไทย",
    en: "English description",
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
      url: "https://www.thenewyou.co.th",
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
      url: "https://www.thenewyou.co.th",
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
      url: "https://www.thenewyou.co.th",
    },
  ],
  style: {
    gap: 2,
    cols: 3,
    size: 200,
  },
};

export default function Layout5({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [contents, setContents] = useState([]);
  const [style, setStyle] = useState({});

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
        setContents(data?.contents || sampleData.contents);
        setStyle(data?.style || sampleData.style);
      } else {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setContents(sampleData.contents);
        setStyle(sampleData.style);
      }
    };

    fetchData();
  }, [contentId]); // ✅ ต้องมี dependency contentId

  const e = (data) => data?.[language] || "";

  const handleSubmit = async () => {
    const newData = {
      title,
      description,
      contents,
      style,
      component: "layout5",
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
    <section class="bg-white dark:bg-gray-800 w-full mt-8 mb-8 py-8">
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
      <div
        className={`grid max-w-screen-xl px-4 py-4 mx-auto grid-cols-1 gap-16 lg:gap-${style.gap} xl:gap-${style.gap} lg:py-2 lg:grid-cols-${style.cols}`}
      >
        {contents &&
          contents.length > 0 &&
          contents.map((m, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full gap-2 cursor-pointer"
            >
              <div
                className="relative hover:scale-105 transition-all duration-500 ease-in-out hover:z-50 active:z-50"
                style={{
                  height: `${style.size}px`,
                  width: "auto",
                  maxWidth: "100%",
                }}
              >
                <Image
                  src={m.image?.url}
                  alt={`image-${m?.image?.title || index}`}
                  width={500}
                  height={500}
                  loading="lazy"
                  className="h-full w-auto object-contain cursor-pointer"
                />
              </div>
              <h2 className="text-2xl font-bold">{t(m.title)}</h2>
              <span className="text-md text-gray-500 text-center">
                {t(m.description)}
              </span>
              {m.url && (
                <span
                  className="text-md text-center cursor-pointer hover:text-orange-500"
                  onClick={() => window.open(m.url, "_blank")}
                >
                  {lang["details_courses"]}
                </span>
              )}
            </div>
          ))}
      </div>
      {editMode && (
        <div className="flex justify-center p-4">
          <FormLayout5
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            contents={contents}
            setContents={setContents}
            style={style}
            setStyle={setStyle}
            language={language}
            setLanguage={setLanguage}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </section>
  );
}

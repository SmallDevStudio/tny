import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import FormLayout3 from "./Forms/FormLayout3";
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
  image: {
    url: "/images/sections/sample-image-500x500.png",
  },
  style: {
    position: "left",
    color: "white",
    fontSize: "20px",
  },
  contents: {
    th: "เนื้อหาภาษาไทย",
    en: "English contents",
  },
};

export default function Layout3({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [image, setImage] = useState(null);
  const [style, setStyle] = useState({});
  const [contents, setContents] = useState({});
  const { t } = useLanguage();

  // โหลดข้อมูลจาก sections/{contentId}
  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setImage(sampleData.image);
        setStyle(sampleData.style);
        setContents(sampleData.contents);
        return;
      }

      try {
        const sectionRef = doc(db, "sections", contentId);
        const sectionSnap = await getDoc(sectionRef);

        if (sectionSnap.exists()) {
          const data = sectionSnap.data();
          setTitle(data?.title || sampleData.title);
          setDescription(data?.description || sampleData.description);
          setImage(data?.image || sampleData.image);
          setStyle(data?.style || sampleData.style);
          setContents(data?.contents || sampleData.contents);
        } else {
          // ไม่มี section นี้
          setTitle(sampleData.title);
          setDescription(sampleData.description);
          setImage(sampleData.image);
          setStyle(sampleData.style);
          setContents(sampleData.contents);
        }
      } catch (err) {
        console.error("โหลด section ผิดพลาด:", err);
      }
    };

    fetchData();
  }, [contentId]);

  const e = (data) => data?.[language] || "";

  const handleSubmit = async () => {
    const newData = {
      title,
      description,
      image,
      style,
      contents,
      component: "layout3",
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
    <section class="bg-white dark:bg-gray-800 w-full">
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
        className="flex items-center justify-center bg-gray-300 dark:bg-gray-900 w-full lg:h-[550px] xl:h-[550px] sm:h-full"
        style={{
          backgroundImage: `url(${image?.url})`,
          backgroundSize: "cover",
          backgroundPosition: style?.position,
          backgroundRepeat: "no-repeat",
          height: "550px",
        }}
      >
        <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-40 lg:px-6">
          <div className="flex justify-center max-w-screen-lg mx-auto">
            <div className="max-w-2xl mb-4 tracking-tight leading-4 text-gray-200 md:text-lg xl:text-2xl sm:text-md dark:text-white">
              <div
                style={{
                  color: style?.color,
                  fontSize: style?.fontSize,
                }}
              >
                {editMode ? e(contents) : t(contents)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {editMode && (
        <div className="flex justify-center p-4">
          <FormLayout3
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            image={image}
            setImage={setImage}
            style={style}
            setStyle={setStyle}
            contents={contents}
            setContents={setContents}
            language={language}
            setLanguage={setLanguage}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </section>
  );
}

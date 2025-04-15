import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import FormHearder from "./Forms/FormHearder";
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
    url: "/images/sections/sample-image-500x210.png",
  },
  style: {
    bgColor: "#757474",
    titleColor: "#f5f2f2",
    titleFontSize: "40px",
    desecriptionColor: "#f5f2f2",
    descriptionFontSize: "20px",
  },
};

export default function Header({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [image, setImage] = useState([]);
  const [row, setRow] = useState(2);
  const [style, setStyle] = useState({});

  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setImage(sampleData.image);
        setStyle(sampleData.style);
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
        } else {
          // ไม่มี section นี้
          setTitle(sampleData.title);
          setDescription(sampleData.description);
          setImage(sampleData.image);
          setStyle(sampleData.style);
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
      component: "header",
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
    <section className="bg-white dark:bg-gray-800">
      <div
        className=""
        style={{
          backgroundColor: style.bgColor,
          width: "100%",
        }}
      >
        <div className="grid mx-auto max-w-screen-xl px-4 py-6 w-full lg:gap-12 xl:gap-4 lg:py-10 lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center mx-auto max-w-screen-sm text-center lg:mt-10 ">
            <h2
              className="text-2xl lg:text-4xl font-extrabold"
              style={{
                color: style.titleColor,
                fontSize: style.titleFontSize,
              }}
            >
              {editMode ? e(title) : t(title)}
            </h2>
            <p
              className="font-light"
              style={{
                color: style.desecriptionColor,
                fontSize: style.descriptionFontSize,
              }}
            >
              {editMode ? e(description) : t(description)}
            </p>
          </div>
          <div className="flex justify-center w-full mt-6 lg:mt-0 lg:max-w-[500px] mx-auto">
            <Image
              src={image.url}
              alt="mockup"
              width={500}
              height={500}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {editMode && (
        <FormHearder
          contentId={contentId}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          image={image}
          setImage={setImage}
          style={style}
          setStyle={setStyle}
          language={language}
          setLanguage={setLanguage}
          setEditMode={setEditMode}
          handleSubmit={handleSubmit}
        />
      )}
    </section>
  );
}

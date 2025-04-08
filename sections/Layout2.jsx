import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import FormLayout from "./Forms/FormLayout";
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
  contents: {
    th: "เนื้อหาภาษาไทย",
    en: "English contents",
  },
};

export default function Layout2({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [image, setImage] = useState(null);
  const [contents, setContents] = useState({});
  const { t } = useLanguage();

  // โหลดข้อมูลจาก sections/{contentId}
  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setImage(sampleData.image);
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
          setContents(data?.contents || sampleData.contents);
        } else {
          // ไม่มี section นี้
          setTitle(sampleData.title);
          setDescription(sampleData.description);
          setImage(sampleData.image);
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
      contents,
      component: "layout2",
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
      <div className="grid max-w-screen-xl mx-auto px-4 lg:gap-12 xl:gap-4 lg:py-2 lg:grid-cols-2">
        <div className="flex flex-col items-start mt-1 lg:w-full lg:ml-12 lg:mt-0">
          <div className="max-w-2xl mb-4 tracking-tight leading-5 md:text-lg xl:text-xl sm:text-md dark:text-white">
            <div
              dangerouslySetInnerHTML={{
                __html: editMode ? e(contents) : t(contents),
              }}
            />
          </div>
        </div>
        <div className="flex justify-center w-full pb-4 lg:max-w-[500px] mx-auto">
          <Image
            src={image?.url}
            alt="mockup"
            width={500}
            height={500}
            className="object-contain"
            priority
          />
        </div>
      </div>
      {editMode && (
        <div className="flex justify-center p-4">
          <FormLayout
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            image={image}
            setImage={setImage}
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

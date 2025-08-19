import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import FormLayout4 from "./Forms/FormLayout4";
import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
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
  image: [
    {
      url: "/images/sections/sample-image-500x210.png",
    },
    {
      url: "/images/sections/sample-image-500x210.png",
    },
  ],
  style: {
    gap: 2,
    cols: 2,
  },
  contents: {
    th: "เนื้อหาภาษาไทย",
    en: "English contents",
  },
};

export default function Layout4({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [image, setImage] = useState([]);
  const [imageEng, setImageEng] = useState([]);
  const [contents, setContents] = useState([]);
  const [contentCollection, setContentCollection] = useState("");
  const [style, setStyle] = useState({});
  const [type, setType] = useState("");

  const { t, selectedLang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) return;

      const sectionRef = doc(db, "sections", contentId);
      const sectionSnap = await getDoc(sectionRef);

      if (sectionSnap.exists()) {
        const data = sectionSnap.data();
        setTitle(data?.title || sampleData.title);
        setDescription(data?.description || sampleData.description);
        setImage(data?.image || sampleData.image);
        setImageEng(data?.imageEng);
        setContents(data?.contents || []);
        setContentCollection(data?.contentCollection || "");
        setStyle(data?.style || sampleData.style);
        setType(data?.type || "");
      } else {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setImage(sampleData.image);
        setStyle(sampleData.style);
        setType(sampleData.type || "");
      }
    };

    fetchData();
  }, [contentId]); // ✅ ต้องมี dependency contentId

  const e = (data) => data?.[language] || "";

  const handleSubmit = async () => {
    const newData = {
      title,
      description,
      image,
      contents,
      contentCollection: contentCollection ?? null, // ✅ ป้องกัน undefined
      style,
      type,
      component: "layout4",
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
        className={`grid max-w-screen-xl px-4 py-4 mx-auto lg:gap-${style.gap} xl:gap-${style.gap} lg:py-2 lg:grid-cols-${style.cols}`}
      >
        {type === "images"
          ? selectedLang === "th"
            ? image &&
              image.map((item, index) => (
                <div
                  key={index}
                  className="relative hover:scale-105 transition-all duration-500 ease-in-out hover:z-50 active:z-50"
                >
                  <Image
                    src={item.url}
                    alt={`image-${index}`}
                    width={700}
                    height={700}
                    loading="lazy"
                    className="w-full h-full object-contain cursor-pointer"
                  />
                </div>
              ))
            : imageEng &&
              imageEng.map((item, index) => (
                <div
                  key={index}
                  className="relative hover:scale-105 transition-all duration-500 ease-in-out hover:z-50 active:z-50"
                >
                  <Image
                    src={item.url}
                    alt={`image-${index}`}
                    width={400}
                    height={400}
                    loading="lazy"
                    className="w-full h-full object-contain cursor-pointer"
                  />
                </div>
              ))
          : contents.map((item, index) => (
              <div
                key={index}
                className="relative hover:scale-105 transition-all duration-500 ease-in-out hover:z-50 active:z-50"
                onClick={() => {
                  if (!item?.slug) return; // ✅ ถ้า slug ไม่มี ไม่ทำอะไร
                  const path = item.group
                    ? `/${item.page}/${item.group}/${item.slug}`
                    : `/${item.page}/${item.slug}`;

                  router.push(path);
                }}
              >
                <Image
                  src={item?.image?.url || "/default-image.png"} // ✅ กัน null error ด้วย
                  alt={`image-${index}`}
                  width={700}
                  height={700}
                  loading="lazy"
                  className="w-full h-full object-contain cursor-pointer"
                />
              </div>
            ))}
      </div>
      {editMode && (
        <div className="flex justify-center p-4">
          <FormLayout4
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            image={image}
            setImage={setImage}
            imageEng={imageEng}
            setImageEng={setImageEng}
            contents={contents}
            setContents={setContents}
            contentCollection={contentCollection}
            setContentCollection={setContentCollection}
            style={style}
            setStyle={setStyle}
            type={type}
            setType={setType}
            language={language}
            setLanguage={setLanguage}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </section>
  );
}

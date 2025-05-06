import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import FormYoutubeShow from "./Forms/FormYoutubeShow";
import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import ReactPlayer from "react-player/youtube";

const sampleData = {
  title: {
    th: "",
    en: "",
  },
  description: {
    th: "",
    en: "",
  },
  style: {
    gap: 2,
    cols: 1,
    limited: 1,
    size: 600,
  },
  contents: [
    {
      title: "รู้จักอาจารย์เอ๋เพิ่มเติมได้ที่นี่",
      url: "https://www.youtube.com/watch?v=4_aUnD3b0_g",
    },
    {
      title: "Miracle of You l MOU ใช้ชีวิตแบบไม่ซับซ้อน สู้ไปวันๆ - EP.1",
      url: "https://www.youtube.com/watch?v=X8gIsliON6E",
    },
  ],
};

export default function YoutubeShow({
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

  const { t } = useLanguage();

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
      component: "youtubeShow",
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
        className={`grid max-w-screen-xl mx-auto px-4 py-6 gap-${
          style.gap || 2
        } grid-cols-1 lg:grid-cols-${style.cols || 1}`}
      >
        {contents
          .slice(0, Number(style?.limited) || contents.length)
          .map((item, index) => (
            <div
              key={index}
              style={{
                maxWidth: `${style?.size || 600}px`, // แสดงขนาดตาม style.size
                width: "100%", // responsive
                height: "100%",
                margin: "0 auto",
                aspectRatio: "16/9",
              }}
            >
              <ReactPlayer
                url={item.url}
                controls
                width="100%"
                height="100%"
                style={{ borderRadius: "8px", overflow: "hidden" }}
              />
            </div>
          ))}
      </div>

      {editMode && (
        <FormYoutubeShow
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
          setEditMode={setEditMode}
          handleSubmit={handleSubmit}
        />
      )}
    </section>
  );
}

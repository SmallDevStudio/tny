import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import FormFixHightLight from "./Forms/FormFixHightLight";

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
      video: {
        url: "https://www.youtube.com/watch?v=X8gIsliON6E",
        title: "ทดสอบหัวเรื่อง",
        description: "คําอธิบายภาษาไทย",
      },
      title: "ทดสอบหัวเรื่อง",
      description: "คําอธิบายภาษาไทย",
    },
    {
      id: 2,
      video: {
        url: "https://www.youtube.com/watch?v=wdFbQNeGMeE",
        title: "ทดสอบหัวเรื่อง",
        description: "คําอธิบายภาษาไทย",
      },
      title: "ทดสอบหัวเรื่อง",
      description: "คําอธิบายภาษาไทย",
    },
    {
      id: 3,
      video: {
        url: "https://www.youtube.com/watch?v=7hHGArlI7g4",
        title: "ทดสอบหัวเรื่อง",
        description: "คําอธิบายภาษาไทย",
      },
      title: "ทดสอบหัวเรื่อง",
      description: "คําอธิบายภาษาไทย",
    },
    {
      id: 4,
      video: {
        url: "https://www.youtube.com/watch?v=U-0WbD3DbZg",
        title: "ทดสอบหัวเรื่อง",
        description: "คําอธิบายภาษาไทย",
      },
      title: "ทดสอบหัวเรื่อง",
      description: "คําอธิบายภาษาไทย",
    },
  ],
  style: {
    color: "#ff0000",
    backgroundColor: "#00ff00",
    fontSize: "24px",
    fontWeight: "bold",
  },
};

function HoverVideoPlayer({ url, onPlay }) {
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = () => {
    setPlaying(true);
    onPlay?.(true);
  };

  const handleMouseLeave = () => {
    setPlaying(false);
    onPlay?.(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full"
    >
      <ReactPlayer
        url={url}
        playing={playing}
        controls
        loop
        muted
        width="100%"
        height="100%"
      />
    </div>
  );
}

export default function FixHightLight({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode,
}) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [contents, setContents] = useState([]);
  const [style, setStyle] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const router = useRouter();

  const { t, lang } = useLanguage();

  const goTo = (url) => {
    if (url) window.open(url, "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setContents(sampleData.contents);
        setStyle(sampleData.style);
        return;
      }

      try {
        const sectionRef = doc(db, "sections", contentId);
        const sectionSnap = await getDoc(sectionRef);

        if (sectionSnap.exists()) {
          const data = sectionSnap.data();
          setTitle(data?.title);
          setDescription(data?.description);
          setContents(data?.contents || sampleData.contents);
          setStyle(data?.style || sampleData.style);
        } else {
          // ไม่มี section นี้
          setTitle(sampleData.title);
          setDescription(sampleData.description);
          setContents(sampleData.contents);
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
      contents,
      style,
      component: "fixHightLight",
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
      <div className="py-4 px-4 w-full lg:py-6 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-1 ">
          <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
            {editMode ? title?.[language] : t(title)}
          </h2>
          <p className="font-light text-gray-500 text-sm lg:text-md dark:text-gray-400">
            {editMode ? description?.[language] : t(description)}
          </p>
        </div>
      </div>

      <div
        className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-6"
        style={{ maxHeight: "calc(4 * 160px)" }}
      >
        {/* Main video/image */}
        <div
          className="w-full md:w-[70%] aspect-video rounded-lg overflow-hidden shadow-lg cursor-pointer relative"
          onClick={() => goTo(contents[0]?.url)}
        >
          {contents[0]?.video ? (
            <HoverVideoPlayer
              url={contents[0].video.url}
              onPlay={setShowInfo}
            />
          ) : (
            <Image
              src={contents[0]?.image.url}
              alt="thumbnail"
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />
          )}

          {/* Info area */}
          {contents[0]?.image && (
            <div
              className={`absolute bottom-0 left-0 w-full p-4 transition-all duration-300 opacity-50 bg-white`}
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {contents[0]?.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {contents[0]?.description}
              </p>
            </div>
          )}
        </div>

        {/* Side Items */}
        <div
          className="w-full md:w-1/4 flex md:flex-col flex-row gap-3 md:overflow-y-auto overflow-x-auto"
          style={{ maxHeight: "540px" }} // 4 วิดีโอ x 130px + margin/padding
        >
          {contents.slice(1).map((item) => (
            <div
              key={item.id}
              onClick={() => goTo(item.video?.url || item.url)}
              className="w-full h-[130px] rounded-lg overflow-hidden shadow cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all"
            >
              {item.video ? (
                <HoverVideoPlayer url={item.video.url} />
              ) : (
                <Image
                  src={item.image?.url}
                  alt="thumbnail"
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="p-2 bg-white text-sm font-medium truncate text-black">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
      {editMode && (
        <div className="flex justify-center p-4">
          <FormFixHightLight
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
            setEditMode={setEditMode}
          />
        </div>
      )}
    </section>
  );
}

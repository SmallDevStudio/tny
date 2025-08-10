import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import FormContentListImage from "./Forms/FormContentListImage";
import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import moment from "moment";
import "moment/locale/th";
import { useRouter } from "next/router";

moment.locale("th");

const sampleData = {
  title: {
    th: "ทดสอบหัวเรื่อง",
    en: "Sample title",
  },
  description: {
    th: "คำอธิบายภาษาไทย",
    en: "English description",
  },
  contents: "courses",
  path: "public_courses",
  style: {
    gap: 2,
    cols: 2,
    limited: 5,
    showMore: true,
  },
};

export default function ContentListImage({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [contents, setContents] = useState("");
  const [path, setPath] = useState("");
  const [contentsList, setContentsList] = useState([]);
  const [allContents, setAllContents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [style, setStyle] = useState({});

  const router = useRouter();

  const group = router.query.group;

  const { t, lang } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setContents(sampleData.contents);
        setPath(sampleData.path);
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
          setContents(data?.contents || sampleData.contents);
          setPath(data?.path || sampleData.path);
          setStyle(data?.style || sampleData.style);
        } else {
          // ไม่มี section นี้
          setTitle(sampleData.title);
          setDescription(sampleData.description);
          setContents(sampleData.contents);
          setPath(sampleData.path);
          setStyle(sampleData.style);
        }
      } catch (err) {
        console.error("โหลด section ผิดพลาด:", err);
      }
    };

    fetchData();
  }, [contentId]);

  useEffect(() => {
    if (!contents) return;

    const fetchData = async () => {
      try {
        const q = query(
          collection(db, contents),
          where("active", "==", true),
          orderBy("order", "asc")
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllContents(data);

        // ถ้า showAll ยัง false → แสดงแค่ limited
        if (!showAll && style?.limited) {
          setContentsList(data.slice(0, style.limited));
        } else {
          setContentsList(data);
        }
      } catch (err) {
        console.error("โหลด collection ผิดพลาด:", err);
        setAllContents([]);
        setContentsList([]);
      }
    };

    fetchData();
  }, [contents, style?.limited, showAll]);

  const e = (data) => data?.[language] || "";

  const handleSubmit = async () => {
    const newData = {
      title,
      description,
      contents,
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
      <div className="py-4 px-4 max-w-screen-xl mx-auto lg:py-6 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-1 ">
          <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
            {editMode ? e(title) : t(title)}
          </h2>
          <p className="font-light text-gray-500 text-sm lg:text-md dark:text-gray-400">
            {editMode ? e(description) : t(description)}
          </p>
        </div>

        <div
          className={`grid grid-cols-1 py-6 gap-${style.gap} lg:grid-cols-${style.cols}`}
        >
          {contentsList.length > 0 ? (
            contentsList.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center gap-2 mb-4 p-4"
              >
                {item.image?.url && (
                  <Image
                    src={item.image.url}
                    width={500}
                    height={500}
                    alt="item"
                    className="object-contain w-full h-[120px] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                    onClick={() =>
                      window.open(
                        `/${contents}/${item.group}/${item.slug}`,
                        "_blank"
                      )
                    }
                  />
                )}
                <h3 className="text-3xl font-semibold">{e(item.name)}</h3>
                {item?.start_date ? (
                  <div className="flex gap-4">
                    <Image
                      src="/images/date_icon.png"
                      width={30}
                      height={30}
                      alt="date_icon"
                    />
                    <span className="text-orange-500 text-2xl">
                      {moment(item.start_date).format("DD")} -{" "}
                      {moment(item.end_date).format("ll")}
                    </span>
                  </div>
                ) : (
                  <div className="hidden lg:flex gap-4 opacity-0">
                    <Image
                      src="/images/date_icon.png"
                      width={30}
                      height={30}
                      alt="date_icon"
                    />
                    <span className="text-orange-500 text-2xl">
                      {moment(item.start_date).format("DD")} -{" "}
                      {moment(item.end_date).format("ll")}
                    </span>
                  </div>
                )}
                <p
                  className="inline-block text-sm lg:text-md text-gray-500"
                  onClick={() =>
                    window.open(
                      `/${contents}/${item.group}/${item.slug}`,
                      "_blank"
                    )
                  }
                >
                  {t(item.description)}
                </p>
                <span className="font-semibold hover:text-orange-500 cursor-pointer">
                  {lang["details_courses"]}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              ไม่มีข้อมูล
            </p>
          )}
        </div>

        {style?.showMore && allContents.length > style.limited && (
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setShowAll(!showAll);
                setContentsList(
                  showAll ? allContents.slice(0, style.limited) : allContents
                );
              }}
              className="text-lg px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              {showAll ? lang["show_less"] : lang["show_more"]}
            </button>
          </div>
        )}
      </div>

      {editMode && (
        <FormContentListImage
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

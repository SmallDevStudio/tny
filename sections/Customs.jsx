import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/utils/Loading";
import useLanguage from "@/hooks/useLanguage";
import moment from "moment";
import "moment/locale/th";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import FormCustoms from "./Forms/FormCustoms";

const ClientOnlyContent = dynamic(
  () => import("@/components/utils/ClientOnlyContent"),
  { ssr: false }
);

const sampleData = {
  contents: {
    th: "<p>เนื้อหา....</p>",
    en: "<p>Contents...</p>",
  },
};

moment.locale("th");
export default function Customs({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [contents, setContents] = useState({
    th: "<p>เนื้อหา....</p>",
    en: "<p>Contents...</p>",
  });
  const router = useRouter();
  const { t, lang } = useLanguage();

  const e = (data) => data?.[language] || "";

  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) {
        setContents(sampleData.contents);
        return;
      }

      try {
        const sectionRef = doc(db, "sections", contentId);
        const sectionSnap = await getDoc(sectionRef);

        if (sectionSnap.exists()) {
          const data = sectionSnap.data();
          setContents(data?.contents || sampleData.contents);
        } else {
          // ไม่มี section นี้
          setContents(sampleData.contents);
        }
      } catch (err) {
        console.error("โหลด section ผิดพลาด:", err);
      }
    };

    fetchData();
  }, [contentId]);

  const handleSubmit = async () => {
    const newData = {
      contents,
      component: "customs",
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

  console.log("contents", contents);

  return (
    <div>
      {contents && (
        <div className="max-w-screen-xl mx-auto px-4 py-6 mb-4">
          <ClientOnlyContent className="preview-box" html={t(contents)} />
        </div>
      )}

      {editMode && (
        <FormCustoms
          contents={contents}
          setContents={setContents}
          handleSubmit={handleSubmit}
          language={language}
          setLanguage={setLanguage}
          setEditMode={setEditMode}
        />
      )}
    </div>
  );
}

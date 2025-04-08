import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/styles/slide.module.css";
import useLanguage from "@/hooks/useLanguage";
import FormCarousel from "./Forms/FormCarousel";
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
  image: [
    {
      url: "/images/sections/sample-bg-1000x412.png",
    },
    {
      url: "/images/sections/sample-bg-1000x412.png",
    },
  ],
};

export default function Carousel({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode, // ให้ parent ส่งมาด้วย
}) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [images, setImages] = useState([]);
  const sliderRef = useRef(null);

  console.log("contentId", contentId);

  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) {
        setTitle(sampleData.title);
        setDescription(sampleData.description);
        setImages(sampleData.image);
        return;
      }

      try {
        const sectionRef = doc(db, "sections", contentId);
        const sectionSnap = await getDoc(sectionRef);

        if (sectionSnap.exists()) {
          const data = sectionSnap.data();
          console.log("data", data);
          setTitle(data?.title || sampleData.title);
          setDescription(data?.description || sampleData.description);
          setImages(data?.images || sampleData.image);
        } else {
          // ไม่มี section นี้
          setTitle(sampleData.title);
          setDescription(sampleData.description);
          setImages(sampleData.image);
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
      images,
      component: "carousel",
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

  const settings = {
    accessibility: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear",
    lazyLoad: "ondemand",
  };

  return (
    <div className="relative w-full">
      <Slider {...settings} className={styles.slider}>
        {images.map((item) => (
          <div key={item.id} className="w-full">
            <Image
              src={item.url}
              alt={`Slide ${item.id}`}
              width={1500}
              height={1500}
              className="relative w-full object-cover"
              loading="lazy"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ))}
      </Slider>
      {editMode && (
        <div className="flex justify-center p-4">
          <FormCarousel
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            images={images}
            setImages={setImages}
            language={language}
            setLanguage={setLanguage}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}

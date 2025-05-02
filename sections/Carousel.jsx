import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/styles/slide.module.css";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
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
  const [description, setDescription] = useState({});
  const [images, setImages] = useState([]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(3000);
  const sliderRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!contentId) {
        setDescription(sampleData.description);
        setImages(sampleData.image);
        setAutoPlay(autoPlay);
        setAutoPlaySpeed(autoPlaySpeed);
        return;
      }

      try {
        const sectionRef = doc(db, "sections", contentId);
        const sectionSnap = await getDoc(sectionRef);

        if (sectionSnap.exists()) {
          const data = sectionSnap.data();
          setDescription(data?.description || sampleData.description);
          setImages(data?.images || sampleData.image);
          setAutoPlay(data?.autoPlay || true);
          setAutoPlaySpeed(data?.autoPlaySpeed || 3000);
        } else {
          // ไม่มี section นี้
          setDescription(sampleData.description);
          setImages(sampleData.image);
          setAutoPlay(autoPlay);
          setAutoPlaySpeed(autoPlaySpeed);
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
      description,
      images,
      autoPlay,
      autoPlaySpeed,
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
    autoplay: autoPlay,
    autoplaySpeed: autoPlaySpeed,
    arrows: false,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  console.log(images);

  return (
    <div className="relative w-full">
      <Slider {...settings} className={styles.slider}>
        {images.map((item) => (
          <div
            key={item.id}
            className="w-full bg-gray-900"
            onClick={item?.link ? () => router.push(item.link) : null}
          >
            <Image
              key={item.id}
              src={item.url}
              alt={`Slide ${item.id}`}
              width={1500}
              height={1500}
              className="relative w-full object-contain"
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "900px",
              }}
            />
          </div>
        ))}
      </Slider>
      {editMode && (
        <div className="flex justify-center p-4">
          <FormCarousel
            description={description}
            setDescription={setDescription}
            images={images}
            setImages={setImages}
            setEditMode={setEditMode}
            autoPlay={autoPlay}
            setAutoPlay={setAutoPlay}
            autoPlaySpeed={autoPlaySpeed}
            setAutoPlaySpeed={setAutoPlaySpeed}
            language={language}
            setLanguage={setLanguage}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}

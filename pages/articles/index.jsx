import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
import { getSections } from "@/utils/getSections";
import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";
import Image from "next/image";
import ContentCard from "@/components/Card/ContentCard";

const blogData = {
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
  contents: [
    {
      id: 1,
      image: { url: "/images/sections/sample-image-500x210.png" },
      title: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      url: "https://www.thenewyou.co.th",
    },
    {
      id: 2,
      image: { url: "/images/sections/sample-image-500x210.png" },
      title: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      url: "https://www.thenewyou.co.th",
    },
    {
      id: 3,
      image: { url: "/images/sections/sample-image-500x210.png" },
      title: {
        th: "ทดสอบหัวเรื่อง",
        en: "Sample title",
      },
      description: {
        th: "คําอธิบายภาษาไทย",
        en: "English description",
      },
      url: "https://www.thenewyou.co.th",
    },
  ],
  style: {
    bgColor: "#757474",
    titleColor: "#f5f2f2",
    titleFontSize: "40px",
    desecriptionColor: "#f5f2f2",
    descriptionFontSize: "20px",
    gap: 2,
    cols: 3,
  },
};

export default function ArticlePage() {
  const { t, lang } = useLanguage();
  const [title, setTitle] = useState({
    th: "ทดสอบหัวเรื่อง",
    en: "Sample title",
  });
  const [description, setDescription] = useState({
    th: "คําอธิบายภาษาไทย",
    en: "English description",
  });
  const [style, setStyle] = useState({
    bgColor: "#757474",
    titleColor: "#f5f2f2",
    titleFontSize: "40px",
    desecriptionColor: "#f5f2f2",
    descriptionFontSize: "20px",
    gap: 2,
    cols: 3,
  });
  const [image, setImage] = useState({
    url: "/images/sections/sample-image-500x210.png",
  });
  const [blogs, setBlogs] = useState(blogData.contents);
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState({});
  const router = useRouter();
  const pathname = router.pathname.replace("/", "");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const pageRef = doc(db, "pages", pathname);
        const pageSnap = await getDoc(pageRef);

        if (pageSnap.exists()) {
          const data = pageSnap.data();
          setPageData(data);
        } else {
          console.error(`Page with slug "${pathname}" not found.`);
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  console.log("pageData", pageData);
  console.log("blogs", blogs);

  if (loading) return <Loading />;
  if (!pathname) return null;

  return (
    <div className="bg-white dark:bg-gray-800">
      <Header title={t(pageData.title)} description={t(pageData.description)} />
      {/* Header Section */}
      <section>
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
                {t(pageData.title)}
              </h2>
              <p
                className="font-light"
                style={{
                  color: style.desecriptionColor,
                  fontSize: style.descriptionFontSize,
                }}
              >
                {t(pageData.description)}
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
      </section>

      {/* Blog Section */}
      <section>
        <div className="py-4 px-4 w-full lg:py-6 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center lg:mb-1 ">
            <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
              {t(title)}
            </h2>
            <p className="font-light text-gray-500 text-sm lg:text-md dark:text-gray-400">
              {t(description)}
            </p>
          </div>
        </div>
        {/* contents list */}
        <div className="max-w-screen-xl px-4 py-4 mx-auto">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${style.cols} gap-${style.gap}`}
          >
            {blogs.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

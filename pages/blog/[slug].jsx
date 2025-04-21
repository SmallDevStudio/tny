import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
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
import moment from "moment";
import "moment/locale/th";
import dynamic from "next/dynamic";

moment.locale("th");

const ClientOnlyContent = dynamic(
  () => import("@/components/utils/ClientOnlyContent"),
  { ssr: false }
);

const blog = {
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
  creator: [
    {
      id: 1,
      name: "อาจารย์",
      image: { url: "/images/avatar.png" },
      slug: "https://www.thenewyou.co.th",
    },
  ],
  createAt: "2025-04-01",
  content: "",
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

export default function BlogSlug() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div className="bg-white dark:bg-gray-800">
      <Header title={t(blog.title)} description={t(blog.title)} />
      {/* Header Section */}
      <section>
        <div
          className=""
          style={{
            backgroundColor: blog.style.bgColor,
            width: "100%",
          }}
        >
          <div className="grid mx-auto max-w-screen-xl px-4 py-6 w-full lg:gap-12 xl:gap-4 lg:py-10 lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center mx-auto max-w-screen-sm text-center lg:mt-10 ">
              <h2
                className="text-2xl lg:text-4xl font-extrabold"
                style={{
                  color: blog?.style.titleColor,
                  fontSize: blog?.style.titleFontSize,
                }}
              >
                {t(blog?.title)}
              </h2>
              <p
                className="font-light"
                style={{
                  color: blog?.style.desecriptionColor,
                  fontSize: blog?.style.descriptionFontSize,
                }}
              >
                {t(blog?.description)}
              </p>
            </div>
            <div className="flex justify-center w-full mt-6 lg:mt-0 lg:max-w-[500px] mx-auto">
              <Image
                src={blog?.image.url}
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

      {/* Creator Section */}
      <section className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-row items-center w-full">
          {blog?.creator.map((creator) => (
            <div key={creator.id} className="flex flex-row items-center gap-2">
              <div className="flex w-16 h-16 hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer">
                <Image
                  src={creator?.image?.url || "/images/avatar.png"}
                  alt="creator"
                  width={50}
                  height={50}
                  className="object-contain rounded-full border bg-white border-gray-200 w-full h-full"
                  priority
                  onClick={() =>
                    router.push(creator?.slug ? creator?.slug : null)
                  }
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-orange-500">
                  {creator?.name}
                </h2>
                {creator?.position && <span>{creator?.position}</span>}
                <span>{moment(blog?.createAt).fromNow()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <div>
        <div className="max-w-screen-xl mx-auto px-4 py-6 mb-4">
          <ClientOnlyContent html={blog?.content} />
        </div>
      </div>
    </div>
  );
}

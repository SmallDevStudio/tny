"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import Image from "next/image";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";
import useLanguage from "@/hooks/useLanguage";
import { Breadcrumbs, Divider } from "@mui/material";
import Link from "next/link";
import moment from "moment";
import "moment/locale/th";
import ReactPlayer from "react-player";
import dynamic from "next/dynamic";

const ClientOnlyContent = dynamic(
  () => import("@/components/utils/ClientOnlyContent"),
  { ssr: false }
);

moment.locale("th");

export default function CourseSlugPage() {
  const [loading, setLoading] = useState(true);
  const [contentData, setContentData] = useState({});
  const router = useRouter();
  const { slug } = router.query;
  const page = "courses";
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!slug) return; // ✅ หยุดก่อนถ้า slug ยังไม่มา

    const fetchData = async () => {
      try {
        const q = query(collection(db, page), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setContentData(data);
        } else {
          router.replace("/error/404");
        }
      } catch (err) {
        console.error("Error loading dynamic page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, router]);

  if (!contentData) return null;
  if (loading || !contentData) return <Loading />;

  return (
    <div className="bg-white dark:bg-gray-800">
      <Header
        title={t(contentData?.name)}
        description={t(contentData?.description)}
      />
      <div className="max-w-screen-lg mx-auto px-4">
        <Image
          src={contentData?.image?.url}
          alt={contentData?.name?.en}
          width={700}
          height={700}
          style={{ width: "100%", height: "auto" }}
        />
        <Breadcrumbs
          aria-label="breadcrumb"
          className="my-2 text-xs text-gray-500 dark:text-gray-400"
        >
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/courses">
            Courses
          </Link>
          <span className="font-bold text-orange-500">
            {contentData?.name?.en}
          </span>
        </Breadcrumbs>

        <div className="flex flex-col mt-4 mx-auto justify-center items-center text-center gap-1">
          <h1 className="text-3xl font-semibold text-orange-500">
            {t(contentData.name)}{" "}
            {contentData.gen > 0 ? (
              <span className="text-xl">
                {lang["gen"]} {contentData?.gen}
              </span>
            ) : null}
          </h1>
          <p className="text-gray-500">{t(contentData.description)}</p>
          {contentData.price && contentData.price > 0 && (
            <p className="text-orange-500 font-bold text-3xl my-2">
              {Number(contentData.price).toLocaleString("th-TH")} ฿
            </p>
          )}
          {contentData?.registration_url && (
            <div className="flex gap-4 mb-4">
              <button
                onClick={() =>
                  window.open(contentData.registration_url, "_blank")
                }
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                {lang["register_now"]}
              </button>
              <button
                onClick={() => window.open(contentData.download_url, "_blank")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                {lang["download_now"]}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-2 bg-gray-200 mt-4">
        <div className="max-w-screen-lg mx-auto items-center justify-center">
          <div className="flex justify-between items-center gap-4">
            <div className="flex text-orange-500 gap-2">
              <Image
                src="/images/date_icon.png"
                width={30}
                height={30}
                alt="date_icon"
              />
              <span className="text-orange-500 text-xl">
                {moment(contentData.start_date).format("DD")} -{" "}
                {moment(contentData.end_date).format("ll")}
              </span>
            </div>
            <div className="flex text-orange-500 gap-2">
              <Image
                src="/images/time-icon.png"
                width={30}
                height={30}
                alt="time-icon"
              />
              <span className="text-orange-500 text-xl">
                {contentData.start_time + ` - ${contentData.end_time}`}
              </span>
            </div>
            {contentData.location && (
              <div className="flex text-orange-500 gap-2">
                <Image
                  src="/images/place-icon.png"
                  width={30}
                  height={30}
                  alt="place-icon"
                />
                <span
                  className="text-orange-500 text-xl cursor-pointer"
                  onClick={() =>
                    window.open(contentData.location_url, "_blank")
                  }
                >
                  {contentData.location}
                </span>
              </div>
            )}
          </div>

          <div>
            <ReactPlayer
              url={contentData?.youtube_url}
              controls
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 py-6 mb-4">
        <ClientOnlyContent html={contentData.content} />
      </div>
      <Divider />
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <div className="flex justify-center items-center w-full">
          <Image
            src={contentData?.image?.url}
            alt={contentData?.name?.en}
            width={300}
            height={300}
            style={{ width: "500px", height: "auto" }}
          />
        </div>
        <div className="flex flex-col mt-4 mx-auto justify-center items-center text-center gap-1">
          <h1 className="text-3xl font-semibold text-orange-500">
            {t(contentData.name)}{" "}
            {contentData.gen > 0 ? (
              <span className="text-xl">
                {lang["gen"]} {contentData?.gen}
              </span>
            ) : null}
          </h1>
          <p className="text-gray-500">{t(contentData.description)}</p>
          {contentData.price && contentData.price > 0 && (
            <p className="text-orange-500 font-bold text-3xl my-2">
              {Number(contentData.price).toLocaleString("th-TH")} ฿
            </p>
          )}
          {contentData?.registration_url && (
            <div className="flex gap-4 mb-4">
              <button
                onClick={() =>
                  window.open(contentData.registration_url, "_blank")
                }
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                {lang["register_now"]}
              </button>
              <button
                onClick={() => window.open(contentData.download_url, "_blank")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                {lang["download_now"]}
              </button>
            </div>
          )}
        </div>
      </div>
      <Divider />
    </div>
  );
}

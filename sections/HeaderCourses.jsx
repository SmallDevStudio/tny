import { useState, useEffect } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import useLanguage from "@/hooks/useLanguage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Breadcrumbs, Divider } from "@mui/material";
import Link from "next/link";
import moment from "moment";
import "moment/locale/th";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Loading from "@/components/utils/Loading";

const ClientOnlyContent = dynamic(
  () => import("@/components/utils/ClientOnlyContent"),
  { ssr: false }
);

moment.locale("th");

export default function HeaderCourses({ pageData }) {
  const [data, setData] = useState(null);

  const router = useRouter();
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (pageData) {
      setData(pageData);
    } else {
      return;
    }
  }, [pageData]);

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-screen-lg mx-auto px-4">
        <Image
          src={data?.image?.url}
          alt={data?.name?.en}
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
          <span className="font-bold text-orange-500">{data?.name?.en}</span>
        </Breadcrumbs>

        <div className="flex flex-col mt-4 mx-auto justify-center items-center text-center gap-1">
          <h1 className="text-3xl font-semibold text-orange-500">
            {t(data?.name)}{" "}
            {data?.gen > 0 ? (
              <span className="text-xl">
                {lang["gen"]} {data?.gen}
              </span>
            ) : null}
          </h1>
          <p className="text-gray-500">{t(data?.description)}</p>
          {data?.price && data?.price > 0 && (
            <p className="text-orange-500 font-bold text-3xl my-2">
              {Number(data?.price).toLocaleString("th-TH")} ฿
            </p>
          )}
          {data?.registration_url && (
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => window.open(data?.registration_url, "_blank")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                {lang["register_now"]}
              </button>
              <button
                onClick={() => window.open(data?.download_url, "_blank")}
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
                {moment(data?.start_date).format("DD")} -{" "}
                {moment(data?.end_date).format("ll")}
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
                {data?.start_time + ` - ${data?.end_time}`}
              </span>
            </div>
            {data?.location && (
              <div className="flex text-orange-500 gap-2">
                <Image
                  src="/images/place-icon.png"
                  width={30}
                  height={30}
                  alt="place-icon"
                />
                <span
                  className="text-orange-500 text-xl cursor-pointer"
                  onClick={() => window.open(data?.location_url, "_blank")}
                >
                  {data?.location}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

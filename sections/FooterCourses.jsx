import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "@/components/utils/Loading";
import useLanguage from "@/hooks/useLanguage";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

export default function FooterCourses({ pageData }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (pageData) {
      setContent(pageData);
      setLoading(false);
    } else {
      return;
    }
  }, [pageData]);

  if (loading || !content) return <Loading />;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex justify-center items-center w-full">
        <Image
          src={content?.image?.url}
          alt={content?.name?.en}
          width={300}
          height={300}
          style={{ width: "500px", height: "auto" }}
        />
      </div>
      <div className="flex flex-col mt-4 mx-auto justify-center items-center text-center gap-1">
        <h1 className="text-3xl font-semibold text-orange-500">
          {t(content?.name)}{" "}
          {content?.gen > 0 ? (
            <span className="text-xl">
              {lang["gen"]} {content?.gen}
            </span>
          ) : null}
        </h1>
        <p className="text-gray-500">{t(content?.description)}</p>
        {content?.price && content?.price > 0 && (
          <p className="text-orange-500 font-bold text-3xl my-2">
            {Number(content?.price).toLocaleString("th-TH")} ฿
          </p>
        )}
        {content?.registration_url && (
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => window.open(content?.registration_url, "_blank")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            >
              {lang["register_now"]}
            </button>
            <button
              onClick={() => window.open(content?.download_url, "_blank")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            >
              {lang["download_now"]}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import {
  doc,
  getDocs,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { Breadcrumbs, Divider } from "@mui/material";
import Link from "next/link";
import moment from "moment";
import "moment/locale/th";
import "moment/locale/en-gb";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ReactPlayer from "react-player";

import CourseActions from "@/components/Cart/CourseActions";
import TestActions from "@/components/Cart/TestActions";

const CustomErrorPage = dynamic(() => import("@/pages/_error/error"), {
  ssr: false,
});

export default function OnlineContents({ pageData }) {
  const [data, setData] = useState(null);
  const { data: session, status } = useSession();
  const userId = session?.user?.userId;

  const router = useRouter();
  const { t, lang, selectedLang } = useLanguage();

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  useEffect(() => {
    if (pageData) {
      setData(pageData);
    } else {
      return;
    }
  }, [pageData]);

  console.log("pageData:", data);

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-screen-lg mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col mt-4 mx-auto justify-center items-center text-center gap-1">
          <h1 className="text-3xl font-semibold text-orange-500 mt-2">
            {t(data?.name)}{" "}
          </h1>
          <p className="text-gray-500">{t(data?.description)}</p>

          <TestActions course={data} />
        </div>

        {/* Content Section */}
        <div className="mt-4">
          <div>
            <video
              src={data?.preview?.url}
              autoPlay
              controls
              className="w-full h-auto rounded-lg"
              poster={data?.preview?.thumbnail}
              style={{ aspectRatio: "16/9" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

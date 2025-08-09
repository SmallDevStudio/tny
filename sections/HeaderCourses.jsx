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
import ReactPlayer from "react-player/youtube";
import CourseActions from "@/components/Cart/CourseActions";
import PaymentButton from "@/components/btn/PaymentButton";

const ClientOnlyContent = dynamic(
  () => import("@/components/utils/ClientOnlyContent"),
  { ssr: false }
);

export default function HeaderCourses({ pageData }) {
  const [data, setData] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
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

  useEffect(() => {
    const checkInterested = async () => {
      if (!userId || !data?.id) return;

      const q = query(
        collection(db, "interested"),
        where("courseId", "==", data.id),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        if (docData.status === "interested") {
          setIsInterested(true);
        }
      }
    };

    checkInterested();
  }, [userId, data?.id]);

  const showInterested = data?.schedules.length < 0;
  const noLocation = !data?.location;

  const handleInterested = async () => {
    if (!userId || !data?.id) {
      alert("กรุณาเข้าสู่ระบบก่อนแสดงความสนใจ");
      return;
    }

    const q = query(
      collection(db, "interested"),
      where("courseId", "==", data.id),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const currentStatus = querySnapshot.docs[0].data().status;

      if (currentStatus === "interested") {
        const result = await Swal.fire({
          title: "ยกเลิกความสนใจ?",
          text: "คุณต้องการยกเลิกความสนใจคอร์สนี้หรือไม่",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ใช่, ยกเลิก",
          cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
          await updateDoc(docRef, {
            status: "not_interested",
            updatedAt: new Date().toISOString(),
          });
          setIsInterested(false);
          toast.success("ยกเลิกความสนใจเรียบร้อยแล้ว");
        }
      } else {
        await updateDoc(docRef, {
          status: "interested",
          updatedAt: new Date().toISOString(),
        });
        setIsInterested(true);
        toast.success("แสดงความสนใจเรียบร้อยแล้ว");
      }
    } else {
      // ยังไม่มีข้อมูลเลย → สร้างใหม่
      await setDoc(doc(collection(db, "interested")), {
        courseId: data.id,
        userId: userId,
        status: "interested",
        createdAt: new Date().toISOString(),
      });
      setIsInterested(true);
      toast.success("แสดงความสนใจเรียบร้อยแล้ว");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-screen-lg mx-auto px-4">
        {selectedLang === "th" ? (
          <Image
            src={data?.image ? data?.image.url : data?.imageEng.url}
            alt={data?.name?.en}
            width={700}
            height={700}
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <Image
            src={data?.imageEng ? data?.imageEng.url : data?.image?.url}
            alt={data?.name?.en}
            width={700}
            height={700}
            style={{ width: "100%", height: "auto" }}
          />
        )}
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

          <div className="flex items-center gap-4 mb-4">
            {data?.registration_url && (
              <button
                onClick={() => window.open(data?.registration_url, "_blank")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                {lang["register_now"]}
              </button>
            )}
            {data?.download_url && (
              <button
                onClick={() => window.open(data?.download_url, "_blank")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                {lang["download_now"]}
              </button>
            )}
            <CourseActions course={data} />
          </div>
        </div>
      </div>
      <div className="p-2 bg-gray-200 mt-4">
        <div className="max-w-screen-lg mx-auto items-center justify-center">
          <div
            className={`grid ${
              showInterested
                ? "grid-cols-1 min-h-[100px]"
                : "grid-cols-1 md:grid-cols-3"
            } items-center gap-4`}
          >
            {!showInterested && data?.schedules?.length > 0 && (
              <div className="flex items-center text-orange-500 gap-2">
                <Image
                  src="/images/date_icon.png"
                  width={30}
                  height={30}
                  alt="date_icon"
                  className="object-contain"
                />
                {data?.schedules?.length > 1 ? (
                  <select name="schedules" id="schedules">
                    {data?.schedules?.map((schedule, index) => (
                      <option key={index} value={index}>
                        <span>
                          {selectedLang === "en" ? (
                            <span>
                              {moment(schedule?.start_date)
                                .locale("en")
                                .format("DD")}

                              {` - ${moment(schedule?.end_date)
                                .locale("en")
                                .format("ll")}`}
                            </span>
                          ) : (
                            <span>
                              {moment(schedule?.start_date)
                                .locale("th")
                                .format("DD")}
                              {` - ${moment(schedule?.end_date)
                                .locale("th")
                                .format("ll")}`}
                            </span>
                          )}
                        </span>
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-orange-500 text-sm lg:text-xl">
                    {selectedLang === "en" ? (
                      <span>
                        {moment(data?.schedules[0]?.start_date)
                          .locale("en")
                          .format("DD")}

                        {` - ${moment(data?.schedules[0]?.end_date)
                          .locale("en")
                          .format("DD MMMM YYYY")}`}
                      </span>
                    ) : (
                      <span>
                        {moment(data?.schedules[0]?.start_date)
                          .locale("th")
                          .format("DD")}
                        {` - ${moment(data?.schedules[0]?.end_date)
                          .locale("th")
                          .format("ll")}`}
                      </span>
                    )}
                  </span>
                )}
              </div>
            )}

            {!showInterested && data?.schedules?.length > 0 && (
              <div className="flex items-center text-orange-500 gap-2">
                <Image
                  src="/images/time-icon.png"
                  width={30}
                  height={30}
                  alt="time-icon"
                  className="object-contain"
                />
                {data?.schedules?.length > 1 ? (
                  <select name="schedules" id="schedules">
                    {data?.schedules?.map((schedule, index) => (
                      <option key={index} value={index}>
                        {schedule?.start_time + ` - ${schedule?.end_time}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-orange-500 text-sm lg:text-xl">
                    {data?.schedules[0]?.start_time} -{" "}
                    {data?.schedules[0]?.end_time}
                  </span>
                )}
              </div>
            )}

            {!showInterested && data?.location && (
              <div className="flex items-center text-orange-500 gap-2">
                <Image
                  src="/images/place-icon.png"
                  width={30}
                  height={30}
                  alt="place-icon"
                  className="object-contain"
                />
                <span
                  className="text-orange-500 text-sm lg:text-xl cursor-pointer"
                  onClick={() => window.open(data?.location_url, "_blank")}
                >
                  {data?.location}
                </span>
              </div>
            )}

            {showInterested && (
              <div
                className={`${
                  noLocation
                    ? "flex justify-center items-center col-span-full"
                    : ""
                }`}
              >
                <button
                  onClick={handleInterested}
                  className={`font-bold py-2 px-4 rounded ${
                    isInterested
                      ? "bg-blue-500 text-white hover:bg-blue-700"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {isInterested
                    ? lang["interested_in_course"]
                    : lang["interested_course"]}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
import CourseActions from "@/components/Cart/CourseActions";

const CustomErrorPage = dynamic(() => import("@/pages/_error/error"), {
  ssr: false,
});

export default function HeaderOnline({ pageData }) {
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
            src={
              data?.image?.url
                ? data?.image.url
                : data?.imageEng.url
                ? data?.imageEng.url
                : "/images/sample-content.png"
            }
            alt={data?.name?.en}
            width={700}
            height={700}
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <Image
            src={
              data?.imageEng?.url
                ? data?.imageEng.url
                : data?.image?.url
                ? data?.image.url
                : "/images/sample-content.png"
            }
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
          <Link underline="hover" color="inherit" href="/online-courses">
            Online-Courses
          </Link>
          <span className="font-bold text-orange-500">{data?.name?.en}</span>
        </Breadcrumbs>
      </div>
    </div>
  );
}

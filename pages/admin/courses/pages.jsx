import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Dialog, Slide, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import SearchBar from "@/components/Bar/SearchBar";
import Swal from "sweetalert2";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import moment from "moment";
import "moment/locale/th";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CoursesPages() {
  const [pages, setPages] = useState([]);

  const [openForm, setOpenForm] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { data: session } = useSession();

  const path = "courses";

  useEffect(() => {
    const path = "courses"; // ✅ หรือจะรับจาก props ก็ได้
    const pagesRef = collection(db, "pages");

    const unsubscribe = onSnapshot(
      pagesRef,
      (snapshot) => {
        const pagesData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (page) =>
              page.type === "dynamic_page" && page.template?.page === path // ✅ ตรวจสอบ nested object
          );

        setPages(pagesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching pages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // ✅ cleanup
  }, []);

  console.log("pages", pages);

  return (
    <div>
      {/* Headers */}
      <div>
        <h1 className="text-2xl font-semibold">Page Managements</h1>
      </div>

      {/* Body */}
      <div className="mt-4">
        {pages.map((page, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{page.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import useLanguage from "@/hooks/useLanguage";
import useDB from "@/hooks/useDB";
import { Divider, Slide, Dialog } from "@mui/material";
import { db } from "@/services/firebase";
import {
  getDocs,
  query,
  collection,
  onSnapshot,
  where,
  doc,
  updateDoc,
  setDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Line, RiPencilLine } from "react-icons/ri";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GroupForm({ page, collectionPath }) {
  const [pages, setPages] = useState([]);
  const [group, setGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { lang, t } = useLanguage();

  useEffect(() => {
    if (!collectionPath) return;

    const groupRef = collection(db, collectionPath);

    const unsubscribe = onSnapshot(groupRef, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroup(groups);
    });

    return () => unsubscribe();
  }, [collectionPath]);

  useEffect(() => {
    const pagesRef = collection(db, "pages");

    // Firebase ยังไม่รองรับ where("type", "!=", "dynamic_page") แบบ realtime โดยตรงบน client
    // ดังนั้นเราจะใช้ onSnapshot กับทั้งหมด แล้ว filter เอง
    const unsubscribe = onSnapshot(
      pagesRef,
      (snapshot) => {
        const pagesData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((page) => page.type === "dynamic_page");

        setPages(pagesData);
      },
      (error) => {
        console.error("Error fetching pages:", error);
      }
    );

    return () => unsubscribe(); // ✅ cleanup เมื่อ component unmount
  }, []);

  return <div></div>;
}

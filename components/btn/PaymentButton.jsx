import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import useDB from "@/hooks/useDB";
import Link from "next/link";

export default function PaymentButton({ courseId, userId }) {
  const [isUsePayment, setIsUsePayment] = useState(false);

  const { subscribe, getById, update } = useDB("appdata");

  useEffect(() => {
    const unsubscribe = getById("payment", (appData) => {
      if (appData) {
        setIsUsePayment(appData.isUsePayment);
      }
    });
    return () => unsubscribe(); // ✅ หยุดฟังเมื่อ component unmount
  }, []);

  console.log("isUsePayment:", isUsePayment);
}

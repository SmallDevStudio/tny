import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";

export default function useCode({ documentName }) {
  const [config, setConfig] = useState(null);
  const [code, setCode] = useState({ docEntry: null, code: "" });

  // โหลด config จาก numbering
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const q = query(
          collection(db, "numbering"),
          where("document", "==", documentName)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          setConfig({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Numbering config not found for", documentName);
        }
      } catch (error) {
        console.error("Error fetching numbering config:", error);
      }
    };

    fetchConfig();
  }, [documentName]);

  // สร้าง code preview
  useEffect(() => {
    if (config) {
      const nextNumber = (config.last_number ?? config.start_number ?? 1) + 1;
      const formattedNumber = String(nextNumber).padStart(
        config.number_digits,
        "0"
      );

      const generatedCode =
        (config.prefix || "") + formattedNumber + (config.suffix || "");

      setCode({
        docEntry: nextNumber,
        code: generatedCode,
      });
    }
  }, [config]);

  // ฟังก์ชัน generate และ update last_number
  const generateUniqueDocEntry = async () => {
    if (!config) return null;

    const newNumber = (config.last_number ?? config.start_number ?? 1) + 1;
    const formattedNumber = String(newNumber).padStart(
      config.number_digits,
      "0"
    );
    const newCode =
      (config.prefix || "") + formattedNumber + (config.suffix || "");

    // update last_number กลับไปที่ numbering
    const numberingRef = doc(db, "numbering", config.id);
    await updateDoc(numberingRef, {
      last_number: newNumber,
      updated_at: new Date().toISOString(),
    });

    // อัปเดต state
    setConfig({ ...config, last_number: newNumber });
    setCode({
      docEntry: newNumber,
      code: newCode,
    });

    return { docEntry: newNumber, code: newCode };
  };

  const updateLastNumber = async (number) => {
    if (!config) return null;

    try {
      const numberingRef = doc(db, "numbering", config.id);
      await updateDoc(numberingRef, {
        last_number: number,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating last number:", error);
    }
  };

  return { config, code, generateUniqueDocEntry };
}

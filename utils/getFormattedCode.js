import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

/**
 * สร้างรหัสเอกสารจาก config ที่เก็บใน collection numbering
 * @param {number} number - ตัวเลขล่าสุด เช่น 6
 * @param {string} document - ชื่อ document เช่น "courses"
 * @returns {string} code เช่น "C00006"
 */
export async function getFormattedCode(document, number) {
  try {
    const configRef = doc(db, "numbering", document);
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) return "";

    const config = configSnap.data();

    const {
      prefix = "",
      suffix = "",
      number_digits = 4,
      year,
      month,
      day,
      group = [],
      subgroup = [],
      formatCode = [],
    } = config;

    const now = new Date();

    const yearValue = year ? now.getFullYear().toString().slice(-2) : "";
    const monthValue = month
      ? (now.getMonth() + 1).toString().padStart(2, "0")
      : "";
    const dayValue = day ? now.getDate().toString().padStart(2, "0") : "";
    const groupValue = group.length > 0 ? group[0]?.value || "" : "";
    const subgroupValue = subgroup.length > 0 ? subgroup[0]?.value || "" : "";
    const numberValue = number?.toString().padStart(Number(number_digits), "0");

    const code = formatCode
      .map((item) => {
        switch (item) {
          case "prefix":
            return prefix;
          case "group":
            return groupValue;
          case "subgroup":
            return subgroupValue;
          case "year":
            return yearValue;
          case "month":
            return monthValue;
          case "day":
            return dayValue;
          case "number_digits":
            return numberValue;
          case "suffix":
            return suffix;
          default:
            return "";
        }
      })
      .join("");

    return code;
  } catch (err) {
    console.error("เกิดข้อผิดพลาดใน getFormattedCode:", err);
    return "";
  }
}

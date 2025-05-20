import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export default function useFormattedCode(document, number) {
  const [code, setCode] = useState("");

  useEffect(() => {
    const fetch = async () => {
      if (!document || typeof number !== "number") return;

      try {
        const configRef = doc(db, "numbering", document);
        const configSnap = await getDoc(configRef);

        if (!configSnap.exists()) return;

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
        const groupValue = group[0]?.value || "";
        const subgroupValue = subgroup[0]?.value || "";
        const numberValue = number
          .toString()
          .padStart(Number(number_digits), "0");

        const finalCode = formatCode
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

        setCode(finalCode);
      } catch (err) {
        console.error("useFormattedCode error:", err);
      }
    };

    fetch();
  }, [document, number]);

  return code;
}

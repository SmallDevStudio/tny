import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req) {
  const { document, number } = await req.json();

  const configRef = doc(db, "numbering", document);
  const configSnap = await getDoc(configRef);

  if (!configSnap.exists()) {
    return Response.json({ code: "" });
  }

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
  const numberValue = number.toString().padStart(Number(number_digits), "0");

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

  return Response.json({ code });
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export default function SummaryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      getDoc(doc(db, "payment", id)).then((docSnap) => {
        if (docSnap.exists()) setData(docSnap.data());
      });
    }
  }, [id]);

  if (!data) return <p>กำลังโหลด...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">สรุปคำสั่งซื้อ</h1>
      <p>Ref: {data.ref}</p>
      <p>สถานะ: {data.status}</p>
      <p>วิธีชำระ: {data.method}</p>
      <ul className="mt-4 list-disc pl-5">
        {data.coursesId.map((id, index) => (
          <li key={index}>{id}</li>
        ))}
      </ul>
    </div>
  );
}

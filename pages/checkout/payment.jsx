import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { db } from "@/services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function PaymentPage() {
  const router = useRouter();
  const cart = useSelector((state) => state.cart.items);
  const userId = useSelector((state) => state.user.userId); // หรือ session.user.id
  const [method, setMethod] = useState("bank");

  const handleSubmit = async () => {
    const paymentRef = await addDoc(collection(db, "payment"), {
      userId,
      coursesId: cart.map((c) => c.courseId),
      method,
      created_at: serverTimestamp(),
      ref: uuidv4(),
      status: method === "bank" ? "pending" : "processing",
    });

    if (method === "bank") {
      router.push(`/summary?id=${paymentRef.id}`);
    } else {
      // Stripe API route
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          userId,
          paymentId: paymentRef.id,
        }),
      });

      const data = await res.json();
      window.location.href = data.url;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">เลือกวิธีชำระเงิน</h1>
      <div>
        <label>
          <input
            type="radio"
            value="bank"
            checked={method === "bank"}
            onChange={() => setMethod("bank")}
          />
          โอนเงิน
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="stripe"
            checked={method === "stripe"}
            onChange={() => setMethod("stripe")}
          />
          ชำระผ่านบัตร (Stripe)
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        ยืนยันการชำระเงิน
      </button>
    </div>
  );
}

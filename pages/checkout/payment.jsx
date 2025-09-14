import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import axios from "axios";
import { db, storage } from "@/services/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import StripeCardForm from "@/components/StripeCardForm";

export default function PaymentPage() {
  const [method, setMethod] = useState("bank");
  const [slip, setSlip] = useState(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const cart = useSelector((state) => state.cart.items);
  const { data: session } = useSession();
  const userId = session?.user?.userId;

  const handleSubmit = async () => {
    if (!userId || cart.length === 0) return;

    const refId = uuidv4();
    const paymentRef = await addDoc(collection(db, "payment"), {
      userId,
      coursesId: cart.map((c) => c.courseId),
      method,
      created_at: serverTimestamp(),
      ref: refId,
      status: method === "bank" ? "pending" : "processing",
    });

    const paymentId = paymentRef.id;

    // ✅ โอนเงิน -> อัปโหลดสลิป
    if (method === "bank") {
      if (!slip) {
        alert("กรุณาแนบสลิปก่อนยืนยันการโอนเงิน");
        return;
      }

      try {
        setUploading(true);
        const storageRef = ref(storage, `slips/${paymentId}/${slip.name}`);
        await uploadBytes(storageRef, slip);
        const slipUrl = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "payment", paymentId), {
          slipUrl,
        });

        router.push(`/checkout/summary?id=${paymentId}`);
      } catch (err) {
        alert("อัปโหลดสลิปล้มเหลว");
      } finally {
        setUploading(false);
      }
    }

    // ✅ Stripe
    else {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          userId,
          paymentId,
        }),
      });

      const data = await res.json();
      window.location.href = data.url;
    }
  };

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <div className="border border-gray-300 rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4">เลือกวิธีชำระเงิน</h1>

        <div className="flex gap-6">
          <label>
            <input
              type="radio"
              value="bank"
              checked={method === "bank"}
              onChange={() => setMethod("bank")}
              className="mr-2"
            />
            โอนเงิน
          </label>

          {/* <label>
            <input
              type="radio"
              value="stripe"
              checked={method === "stripe"}
              onChange={() => setMethod("stripe")}
              className="mr-2"
            />
            ชำระผ่านบัตร
          </label> */}

          {/* <label>
            <input
              type="radio"
              value="promptpay"
              checked={method === "promptpay"}
              onChange={() => setMethod("promptpay")}
              className="mr-2"
            />
            ชำระผ่าน QR-Code
          </label> */}
        </div>

        {/* โอนเงิน */}
        {method === "bank" && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-orange-500">
              รายละเอียดบัญชีธนาคาร
            </h3>
            <div className="bg-gray-100 p-4 rounded">
              <div className="flex justify-between">
                <span>ชื่อบัญชี</span>
                <strong>บริษัท เอ บี ซี จำกัด</strong>
              </div>
              <div className="flex justify-between">
                <span>เลขที่บัญชี</span>
                <strong>123-456-7890</strong>
              </div>
              <div className="flex justify-between">
                <span>ธนาคาร</span>
                <strong>ไทยพาณิชย์</strong>
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-2">แนบสลิปการโอนเงิน</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSlip(e.target.files[0])}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="mt-6 bg-green-500 text-white px-6 py-2 rounded"
            >
              {uploading ? "กำลังอัปโหลด..." : "ยืนยันการชำระเงิน"}
            </button>
          </div>
        )}

        {/* Stripe */}
        {/*{method === "stripe" && (
          <div className="mt-6">
            <StripeCardForm cart={cart} userId={userId} />
          </div>
        )}*/}
        {/* PromptPay */}
        {/*
        {method === "promptpay" && (
          <div className="mt-6">
            <PromptPayForm cart={cart} userId={userId} />
          </div>
        )}*/}
      </div>
    </div>
  );
}

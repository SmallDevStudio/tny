// /pages/api/payments/create-order.js
import axios from "axios";
import { adminDb, FieldValue, Timestamp } from "@/lib/firebase-admin";
import { calcAmount, generateOrderNo } from "@/utils/order";

// ป้องกัน open-redirect: จำกัดโดเมนที่อนุญาตให้ return
const ALLOW_RETURN_HOSTS = (process.env.ALLOWED_RETURN_HOSTS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedReturnUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    if (ALLOW_RETURN_HOSTS.length === 0) return true; // ถ้าไม่ตั้ง allowlist ไว้
    return ALLOW_RETURN_HOSTS.includes(u.host);
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { items, customer, paymentMethod, returnUrl } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: "Empty items" });
    }
    if (!isAllowedReturnUrl(returnUrl)) {
      return res.status(400).json({ ok: false, error: "Invalid returnUrl" });
    }

    // ✅ คำนวณราคา server-side
    const amount = calcAmount(items);

    // ✅ ใช้ orderNo เป็น docId เพื่อ idempotency ง่ายที่สุด
    const orderNo = generateOrderNo();
    const docRef = adminDb.collection("orders").doc(orderNo);

    // ใช้ create() จะ fail ถ้ามีอยู่แล้ว -> ป้องกันซ้ำซ้อน
    await docRef.create({
      orderId: orderNo, // เก็บซ้ำเพื่อ query ได้
      orderNo,
      items,
      amount,
      customer,
      paymentMethod,
      provider: { name: "paysolutions" },
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // ✅ เรียก Pay Solutions (ปรับ endpoint/fields ให้ตรงบัญชีจริง)
    const payload = {
      merchantID: process.env.PS_MERCHANT_ID,
      orderNo,
      amount,
      description: items.map((i) => i.title).join(", "),
      method: paymentMethod, // "card" | "qrcode" | "bank_transfer"
      returnURL: returnUrl,
      // webhook/callback ให้ตั้งในหน้า dashboard ของ Pay Solutions ให้ชี้มายัง /api/payments/webhook
    };

    const psResp = await axios.post(
      process.env.PS_CREATE_URL, // เช่น https://api.paysolutions.asia/v1/payment/create
      payload,
      { headers: { Authorization: `Bearer ${process.env.PS_API_KEY}` } }
    );

    const { payment_url, refno } = psResp.data || {};
    if (!payment_url) {
      // ถ้า provider ไม่คืน payment_url ให้ mark fail
      await docRef.set(
        {
          status: "failed",
          provider: {
            name: "paysolutions",
            createError: psResp.data || "no payment_url",
          },
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
      return res
        .status(502)
        .json({ ok: false, error: "No payment_url from provider" });
    }

    await docRef.set(
      {
        provider: {
          name: "paysolutions",
          refNo: refno || null,
          createResponse: psResp.data,
        },
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    return res.json({ ok: true, paymentUrl: payment_url });
  } catch (err) {
    console.error("create-order (admin) error:", err?.response?.data || err);
    return res
      .status(500)
      .json({ ok: false, error: err?.response?.data || err?.message || "ERR" });
  }
}

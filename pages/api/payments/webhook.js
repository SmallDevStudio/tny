// /pages/api/payments/webhook.js
import rawBody from "raw-body";
import crypto from "crypto";
import { adminDb, FieldValue, Timestamp } from "@/lib/firebase-admin";

export const config = { api: { bodyParser: false } };

// ปรับให้ตรงกับรูปแบบจริงของ Pay Solutions:
// - header ชื่อ signature/timestamp อาจต่างกัน
const SIG_HEADER = process.env.PS_SIG_HEADER || "x-ps-signature";
// (ถ้ามี timestamp header ก็อ่านมารวมใน message ด้วย เพื่อกัน replay)
const SIG_TIMESTAMP_HEADER = process.env.PS_SIG_TS_HEADER || "";

function computeHmac(raw) {
  return crypto
    .createHmac("sha256", process.env.PS_WEBHOOK_SECRET)
    .update(raw)
    .digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const buf = await rawBody(req);
  const payload = buf.toString("utf8");

  const sig = req.headers[SIG_HEADER] || "";
  const expected = computeHmac(payload);

  try {
    // timing-safe compare
    const ok =
      sig &&
      crypto.timingSafeEqual(
        Buffer.from(sig, "utf8"),
        Buffer.from(expected, "utf8")
      );
    if (!ok) {
      console.warn("Webhook signature invalid");
      return res.status(401).end();
    }
  } catch {
    console.warn("Webhook signature compare failed");
    return res.status(401).end();
  }

  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    return res.status(400).end();
  }

  // สมมติ payload แบบมาตรฐาน:
  // { orderNo: "ORD-...", refno: "...", status: "paid"|"failed", amount: number, ... }
  const { orderNo, refno, status } = data || {};
  if (!orderNo || !status) return res.status(400).end();

  const docRef = adminDb.collection("orders").doc(orderNo);

  // ใช้ transaction เพื่อ idempotency และป้องกัน race
  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) {
      throw new Error("Order not found");
    }
    const cur = snap.data();

    // ถ้าเคย paid แล้ว และได้ paid ซ้ำ -> ข้าม
    if (cur.status === "paid" && status === "paid") return;

    tx.set(
      docRef,
      {
        status: status === "paid" ? "paid" : status,
        provider: {
          ...(cur.provider || {}),
          refNo: refno || cur?.provider?.refNo || null,
          lastWebhook: data,
        },
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  });

  // === Post-payment job ===
  // ตัวอย่าง: ปลดล็อกคอร์สให้ผู้ใช้ (ขึ้นกับโครงสร้างระบบคุณ)
  // - ถ้ามี userId ใน order ให้ grant access ที่นี่
  // - หรือส่งอีเมล/สร้างใบกำกับภาษี ฯลฯ
  try {
    const orderSnap = await docRef.get();
    const order = orderSnap.data();

    if (order.status === "paid") {
      await grantCourseAccess(order);
    }
  } catch (e) {
    // อย่า throw ออกไป ให้ provider เห็น 200 เพื่อหยุด retry; log ไว้พอ
    console.error("post-payment job error:", e);
  }

  return res.status(200).json({ ok: true });
}

// === ตัวอย่าง post-payment job ===
// คุณปรับ logic/collection ตามระบบจริงได้เลย
async function grantCourseAccess(order) {
  // สมมติใช้ email ลูกค้าเป็นตัวระบุผู้ใช้ ถ้าไม่มี userId
  const userId = order.userId || order?.customer?.email || null;
  if (!userId) return;

  const batch = adminDb.batch();
  for (const it of order.items || []) {
    const docId = `${userId}__${it.courseId}`;
    const ref = adminDb.collection("enrollments").doc(docId);
    batch.set(
      ref,
      {
        userId,
        courseId: it.courseId,
        courseTitle: it.title,
        sourceOrder: order.orderNo,
        grantedAt: Timestamp.now(),
        status: "active",
      },
      { merge: true }
    );
  }
  await batch.commit();
}

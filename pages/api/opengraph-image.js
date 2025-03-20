import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { db } from "@/services/firebase"; // ✅ ใช้ Firestore ดึงข้อมูล SEO

// ขนาดของ Open Graph Image
const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function handler(req, res) {
  try {
    const { pathname } = req.query;
    const pageSlug = pathname ? pathname.replace("/", "") : "home";

    // ✅ ดึงข้อมูลจาก Firestore ตามหน้า
    const seoRef = db.collection("pages").doc(pageSlug);
    const seoSnap = await seoRef.get();
    const seoData = seoSnap.exists ? seoSnap.data() : null;

    const title = seoData?.title || "The New You Academy";
    const description =
      seoData?.description || "เรียนรู้และพัฒนาตัวเองกับ The New You Academy";

    // ✅ โหลดฟอนต์ (ถ้ามี)
    const font = await readFile(
      join(process.cwd(), "assets/Inter-SemiBold.ttf")
    );

    // ✅ Generate Open Graph Image
    const image = new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#f9f9f9",
            fontFamily: "Inter",
          }}
        >
          <h1 style={{ fontSize: 60, fontWeight: "bold", color: "#333" }}>
            {title}
          </h1>
          <p style={{ fontSize: 30, color: "#777" }}>{description}</p>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Inter",
            data: font,
            style: "normal",
            weight: 400,
          },
        ],
      }
    );

    res.setHeader("Content-Type", contentType);
    res.status(200).end(await image.arrayBuffer());
  } catch (error) {
    console.error("Error generating Open Graph Image:", error);
    res.status(500).send("Failed to generate image");
  }
}

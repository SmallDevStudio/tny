import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  try {
    // ดึงข้อมูล `pages` ทั้งหมดจาก Firestore
    const pagesCollection = collection(db, "pages");
    const snapshot = await getDocs(pagesCollection);

    let urls = "";
    snapshot.forEach((doc) => {
      const slug = doc.id; // ใช้ `id` เป็น slug
      urls += `
        <url>
          <loc>${BASE_URL}/${slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>`;
    });

    // สร้าง XML Sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

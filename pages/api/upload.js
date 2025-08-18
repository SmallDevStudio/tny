import { Storage } from "@google-cloud/storage";
import { nanoid } from "nanoid";
import Busboy from "busboy"; // <-- import แค่ครั้งเดียว
import ffmpeg from "fluent-ffmpeg";
import { tmpdir } from "os";
import { join } from "path";
import fs from "fs";

const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket("thenewyou-60d50.firebasestorage.app");

export const config = {
  api: {
    bodyParser: false, // ใช้ multer หรือ busboy สำหรับไฟล์
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const busboy = Busboy({ headers: req.headers });

    const uploadedFiles = [];

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const fileId = nanoid(10);

      // ตรวจสอบว่าต้องเป็น string
      let safeFilename;
      if (typeof filename === "string") {
        safeFilename = filename;
      } else if (filename?.filename) {
        safeFilename = filename.filename;
      } else {
        safeFilename = "unknown-file";
      }

      // เก็บใน /video/
      const destFileName = `video/${fileId}-${safeFilename}`;
      const blob = bucket.file(destFileName);
      const type = filename.mimeType;

      const stream = blob.createWriteStream({
        resumable: true,
        contentType: mimetype,
      });
      const tempFilePath = join(tmpdir(), `${fileId}-${safeFilename}`);
      const tempWriteStream = fs.createWriteStream(tempFilePath);

      file.pipe(stream);
      file.pipe(tempWriteStream);

      // สร้าง thumbnail
      const thumbName = `video/thumbnail/${fileId}.png`;
      const thumbPath = join(tmpdir(), `${fileId}.png`);

      stream.on("finish", async () => {
        // สร้าง thumbnail
        const thumbName = `video/thumbnail/${fileId}.png`;
        const thumbPath = join(tmpdir(), `${fileId}.png`);

        ffmpeg(tempFilePath)
          .screenshots({
            timestamps: ["00:00:01"],
            filename: `${fileId}.png`,
            folder: tmpdir(),
            size: "320x240",
          })
          .on("end", async () => {
            // อัปโหลด thumbnail ไป Firebase Storage
            await bucket.upload(thumbPath, { destination: thumbName });

            const [videoUrl] = await blob.getSignedUrl({
              action: "read",
              expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
            });
            const [thumbUrl] = await bucket.file(thumbName).getSignedUrl({
              action: "read",
              expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
            });

            uploadedFiles.push({
              fileId,
              filename: safeFilename,
              url: videoUrl,
              thumbnail: thumbUrl,
              type,
            });
            res.status(200).json({ uploadedFiles });

            // ลบไฟล์ชั่วคราว
            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(thumbPath);
          })
          .on("error", (err) => {
            console.error("Thumbnail error:", err);
          });
      });

      stream.on("error", (err) => {
        console.error(err);
        res.status(500).json({ error: err.message });
      });
    });

    req.pipe(busboy);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

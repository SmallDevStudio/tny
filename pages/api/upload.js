import { Storage } from "@google-cloud/storage";
import { nanoid } from "nanoid";
import Busboy from "busboy";
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
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const busboy = Busboy({ headers: req.headers });
  const uploadedFiles = [];
  const tasks = []; // promise ของการอัปโหลดแต่ละไฟล์

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const task = new Promise((resolve, reject) => {
      const fileId = nanoid(10);

      // ตรวจสอบชื่อไฟล์
      let safeFilename;
      if (typeof filename === "string") {
        safeFilename = filename;
      } else if (filename?.filename) {
        safeFilename = filename.filename;
      } else {
        safeFilename = "unknown-file";
      }

      // เส้นทางจัดเก็บ
      const destFileName = `video/${fileId}-${safeFilename}`;
      const blob = bucket.file(destFileName);

      const stream = blob.createWriteStream({
        resumable: true,
        contentType: mimetype,
      });

      const tempFilePath = join(tmpdir(), `${fileId}-${safeFilename}`);
      const tempWriteStream = fs.createWriteStream(tempFilePath);

      file.pipe(stream);
      file.pipe(tempWriteStream);

      const thumbName = `video/thumbnail/${fileId}.png`;
      const thumbPath = join(tmpdir(), `${fileId}.png`);

      stream.on("finish", async () => {
        ffmpeg(tempFilePath)
          .screenshots({
            timestamps: ["00:00:01"],
            filename: `${fileId}.png`,
            folder: tmpdir(),
            size: "320x240",
          })
          .on("end", async () => {
            try {
              // อัปโหลด thumbnail
              await bucket.upload(thumbPath, { destination: thumbName });

              const [videoUrl] = await blob.getSignedUrl({
                action: "read",
                expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
              });
              const [thumbUrl] = await bucket.file(thumbName).getSignedUrl({
                action: "read",
                expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
              });

              const upload = {
                fileId,
                filename: safeFilename,
                url: videoUrl,
                thumbnail: thumbUrl,
                type: mimetype,
                file_path: destFileName, // path ไว้ลบจาก storage ทีหลัง
              };

              uploadedFiles.push(upload);

              fs.unlinkSync(tempFilePath);
              fs.unlinkSync(thumbPath);

              resolve();
            } catch (err) {
              reject(err);
            }
          })
          .on("error", (err) => reject(err));
      });

      stream.on("error", (err) => reject(err));
    });

    tasks.push(task);
  });

  busboy.on("finish", async () => {
    try {
      await Promise.all(tasks);

      // ✅ ส่งเป็น array เสมอ
      res.status(200).json({ data: uploadedFiles });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  req.pipe(busboy);
}

import { Storage } from "@google-cloud/storage";
import fs from "fs";

const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket("thenewyou-60d50.appspot.com");

async function uploadVideo(filePath, destFileName) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const file = bucket.file(destFileName);
    const writeStream = file.createWriteStream({
      resumable: true, // สำคัญสำหรับไฟล์ใหญ่
      contentType: "video/mp4", // ปรับตามชนิดไฟล์
    });

    fileStream
      .pipe(writeStream)
      .on("finish", async () => {
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
        });
        resolve(url);
      })
      .on("error", reject);
  });
}

export default uploadVideo;

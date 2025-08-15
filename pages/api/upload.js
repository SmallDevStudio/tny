// pages/api/upload.js
import formidable from "formidable";
import fs from "fs";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  });
}

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const file = files.file[0];
    const bucket = admin.storage().bucket();
    const dest = `upload/${file.originalFilename}`;

    await bucket.upload(file.filepath, {
      destination: dest,
      resumable: true,
      metadata: { contentType: file.mimetype },
    });

    const [url] = await bucket.file(dest).getSignedUrl({
      action: "read",
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
    });

    fs.unlinkSync(file.filepath);
    res.status(200).json({ url });
  });
}

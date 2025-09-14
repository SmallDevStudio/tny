// hooks/useVideo.js
import { useState, useEffect } from "react";
import axios from "axios";
import { db, storage } from "@/services/firebase"; // ต้องสร้าง config firebase client
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export default function useVideo() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllVideo = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "media"));
    const list = snapshot.docs.map((doc) => doc.data());
    setVideos(list);
    setLoading(false);
  };

  const uploadVideo = async (files, folder, userId, onProgress) => {
    const formData = new FormData();

    if (files instanceof FileList || Array.isArray(files)) {
      // กรณีส่งมาหลายไฟล์
      Array.from(files).forEach((file) => {
        formData.append("file", file);
      });
    } else {
      // กรณีส่งมาไฟล์เดียว
      formData.append("file", files);
    }

    formData.append("folder", folder || "");
    formData.append("creator", userId);

    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        if (onProgress) onProgress(percent);
      },
    });

    console.log("Upload response:", res.data);

    // ✅ ฝั่ง API ส่งกลับ array เสมอ
    return res.data.data;
  };

  const deleteVideo = async (fileId) => {
    try {
      // 1) ดึงข้อมูลไฟล์จาก Firestore
      const fileRef = doc(db, "media", fileId);
      const fileSnap = await getDoc(fileRef);

      if (!fileSnap.exists()) {
        console.error("File not found in Firestore");
        return;
      }

      const fileData = fileSnap.data();
      const filePath = fileData.file_path; // path ใน Storage เช่น "upload/myvideo.mp4"

      // 2) ลบจาก Firebase Storage
      if (filePath) {
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }

      // 3) ลบจาก Firestore
      await deleteDoc(fileRef);

      // 4) อัปเดต state ใน frontend
      setVideos((prev) => prev.filter((v) => v.file_id !== fileId));

      console.log(`Deleted video ${fileId} from Firestore and Storage`);
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return { videos, loading, getAllVideo, uploadVideo, deleteVideo };
}

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { storage } from "@/services/firebase"; // ตรวจสอบว่ามี export storage

export default function SlipUpload({ paymentId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const storageRef = ref(storage, `slips/${paymentId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "payment", paymentId), {
      slipUrl: url,
      status: "pending", // เปลี่ยนสถานะ
    });

    setUploading(false);
    alert("แนบสลิปสำเร็จ");
  };

  return (
    <div className="p-4 border rounded">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        disabled={!file || uploading}
        onClick={handleUpload}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
      >
        {uploading ? "กำลังอัปโหลด..." : "อัปโหลดสลิป"}
      </button>
    </div>
  );
}

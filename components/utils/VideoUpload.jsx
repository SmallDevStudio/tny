import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  uploadFileToCloudinary,
  deleteFileOnServer,
} from "@/hooks/useCloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/utils/config";
import { HiUpload } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { LinearProgress } from "@mui/material";
import { toast } from "react-toastify";

export default function VideoUpload({ onUploaded, folder = "" }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);

  const onDrop = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const files = Array.from(acceptedFiles);
    setUploadingFiles(files.map((f) => ({ name: f.name, progress: 0 })));

    let totalSize = files.reduce((s, f) => s + f.size, 0);
    let totalUploaded = 0;

    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await uploadFileToCloudinary(
          file,
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            CLOUDINARY_CLOUD_NAME,
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
            CLOUDINARY_UPLOAD_PRESET,
          folder,
          (progress) => {
            // update per-file
            setUploadingFiles((prev) =>
              prev.map((p, idx) => (idx === i ? { ...p, progress } : p))
            );

            // update total
            const uploadedForThisFile = (file.size * progress) / 100;
            const uploadedSoFar =
              files.slice(0, i).reduce((acc, f) => acc + f.size, 0) +
              uploadedForThisFile;
            setTotalProgress((uploadedSoFar / totalSize) * 100);
          }
        );

        results.push(res);
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Upload failed: " + err.message);
      }
    }

    setUploadingFiles([]);
    setTotalProgress(0);

    if (results.length > 0 && typeof onUploaded === "function")
      onUploaded(results);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleDelete = async (publicId) => {
    try {
      await deleteFileOnServer(publicId);
      toast.success("Deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 w-full max-w-2xl">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded text-center ${
          isDragActive ? "bg-gray-100" : ""
        }`}
      >
        <input {...getInputProps()} />
        <HiUpload size={36} />
        <p className="mt-2">ลากและวางไฟล์ที่นี่ หรือ คลิกเพื่อเลือกไฟล์</p>
      </div>

      {uploadingFiles.map((f, idx) => (
        <div key={idx} className="mt-3">
          <div className="flex justify-between">
            <div>{f.name}</div>
            <div>{f.progress.toFixed(2)}%</div>
          </div>
          <LinearProgress variant="determinate" value={f.progress} />
        </div>
      ))}

      {totalProgress > 0 && (
        <div className="mt-3">
          <div className="mb-1">
            Total progress: {totalProgress.toFixed(2)}%
          </div>
          <LinearProgress variant="determinate" value={totalProgress} />
        </div>
      )}
    </div>
  );
}

// components/VideoUpload.js
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { HiUpload } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { Divider, LinearProgress } from "@mui/material";
import useVideo from "@/hooks/useVideo";

export default function VideoUpload({
  onClose,
  onProcess,
  folder,
  newUpload,
  multiple,
}) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const { uploadVideo } = useVideo();
  const { data: session } = useSession();
  const userId = session?.user?.userId;

  useEffect(() => {
    if (newUpload) {
      setUploadingFiles([]);
      setTotalProgress(0);
    }
  }, [newUpload]);

  const onDrop = async (acceptedFiles) => {
    // ถ้า multiple = false → บังคับให้เหลือไฟล์เดียว
    const filesToUpload = multiple ? acceptedFiles : [acceptedFiles[0]];

    setUploadingFiles(
      filesToUpload.map((f) => ({ name: f.name, progress: 0 }))
    );

    let totalSize = filesToUpload.reduce((sum, f) => sum + f.size, 0);
    let totalUploaded = 0;

    const data = await uploadVideo(
      filesToUpload,
      folder,
      userId,
      (progress) => {
        totalUploaded += (filesToUpload[0].size * progress) / 100;
        setTotalProgress((totalUploaded / totalSize) * 100);

        setUploadingFiles(
          (prev) => prev.map((f, i) => ({ ...f, progress })) // ไฟล์เดียว
        );
      }
    );

    const processedVideos = data.map((video) => ({
      ...video,
      title: { th: video.filename, en: video.filename },
      description: { th: "", en: "" },
      status: true,
    }));

    onProcess(processedVideos);
    toast.success("อัปโหลดไฟล์สำเร็จ");
    setUploadingFiles([]);
    setTotalProgress(0);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
  });

  return (
    <div className="flex flex-col w-[500px] p-4">
      <div className="flex flex-row items-center justify-between w-full">
        <span className="text-xl font-bold text-orange-500">อัพโหลดไฟล์</span>
        <IoClose size={25} onClick={onClose} className="cursor-pointer" />
      </div>

      <div
        {...getRootProps()}
        className={`flex flex-col justify-center p-2 w-full h-[300px] ${
          isDragActive
            ? "border-2 border-dashed border-gray-200 bg-[#F5F5F5]"
            : "bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <HiUpload size={40} />
        {isDragActive ? (
          <span>วางไฟล์ที่นี่</span>
        ) : (
          <span>
            ลากและวางไฟล์ หรือ{" "}
            <span className="text-orange-500 font-bold cursor-pointer">
              เลือกไฟล์
            </span>
          </span>
        )}
      </div>

      {uploadingFiles.map((file, index) => (
        <div key={index} className="flex flex-col mt-2">
          <span className="text-sm">
            {file.name} - {file.progress.toFixed(2)}%
          </span>
          <LinearProgress variant="determinate" value={file.progress} />
        </div>
      ))}

      <LinearProgress
        variant="determinate"
        value={totalProgress}
        className="mt-2"
      />
      <Divider className="my-2" />

      <div className="flex flex-row items-center justify-end gap-4 mt-4 w-full">
        <button
          className="bg-orange-500 text-white font-bold p-2 rounded-xl"
          onClick={onClose}
        >
          ปิด
        </button>
      </div>
    </div>
  );
}

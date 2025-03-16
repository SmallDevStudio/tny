import { useState, useRef, useEffect } from "react";
import useDB from "@/hooks/useDB";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { HiUpload } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { Divider, LinearProgress } from "@mui/material";
import { uploadFile } from "@/hooks/useStorage";

export default function Upload({ handleCloseForm, setFiles, folder, newUpload }) {
    const [uploadProgress, setUploadProgress] = useState(false);
    const [totalProgress, setTotalProgress] = useState(0);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const { add } = useDB("files");

    const { data: session } = useSession();
    const userId = session?.user?.userId;

    useEffect(() => {
        if (newUpload) {
            setUploadProgress(false);
            setUploadingFiles([]);
            setTotalProgress(0);
        }
    }, [newUpload]);

    const onDrop = async (acceptedFiles) => {
        console.log("Dropped Files:", acceptedFiles);
        await handleFileUpload(acceptedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const handleFileUpload = async (fileList) => {
        const files = Array.from(fileList);
        if (files.length === 0) return;

        setUploadProgress(true);
        setUploadingFiles(files.map(file => ({ name: file.name, progress: 0 })));

        let totalSize = files.reduce((sum, file) => sum + file.size, 0);
        let totalUploaded = 0;

        const uploadPromises = files.map(async (file, index) => {
            return await uploadFile(file, folder ? folder : "", userId, (progress) => {
                totalUploaded += (file.size * progress / 100);
                setTotalProgress((totalUploaded / totalSize) * 100);

                setUploadingFiles(prev =>
                    prev.map((f, i) => (i === index ? { ...f, progress } : f))
                );
            });
        });

        const uploadedMedia = await Promise.all(uploadPromises);
        setFiles(uploadedMedia.filter(file => file !== null));
        setUploadProgress(false);
        toast.success("อัพโหลดไฟล์สําเร็จ");
    };

    const handleClose = () => {
        setTotalProgress(0);
        handleCloseForm();
    };

    return (
        <div className="flex flex-col w-[500px] p-4">
            <div className="flex flex-row items-center justify-between w-full">
                <span className="text-xl font-bold text-orange-500">อัพโหลดไฟล์</span>
                <IoClose size={25} onClick={handleClose} className="cursor-pointer" />
            </div>
            <div
                {...getRootProps()}
                className={`flex flex-col justify-center p-2 w-full h-[300px] ${
                    isDragActive ? "border-2 border-dashed border-gray-200 bg-[#F5F5F5]" : "bg-white"
                }`}
            >
                <span>ลากและวางไฟล์ หรือ เลือกไฟล์</span>
                <div className="flex flex-row items-center mb-2 justify-center border-2 border-dashed mt-2 gap-2 w-full h-20">
                    <input {...getInputProps()} />
                    <HiUpload size={40} />
                    {isDragActive ? (
                        <span>วางไฟล์ที่นี่</span>
                    ) : (
                        <>
                            <span>วางไฟล์ที่นี่ หรือ</span>
                            <span className="text-orange-500 font-bold cursor-pointer">
                                เลือกไฟล์
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* แสดงรายการไฟล์ที่กำลังอัปโหลด */}
            {uploadingFiles.map((file, index) => (
                <div key={index} className="flex flex-col mt-2">
                    <span className="text-sm">{file.name} - {file.progress.toFixed(2)}%</span>
                    <LinearProgress variant="determinate" value={file.progress} />
                </div>
            ))}

            <LinearProgress variant="determinate" value={totalProgress} className="mt-2" />
            <Divider className="my-2" />
            <div className="flex flex-row items-center justify-end gap-4 mt-4 w-full">
                <button
                    className="bg-orange-500 text-white font-bold p-2 rounded-xl"
                    onClick={handleClose}
                    disabled={uploadProgress}
                >
                    {uploadProgress ? "กำลังอัปโหลด..." : "ตกลง"}
                </button>
            </div>
        </div>
    );
}

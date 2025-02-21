import {  useState, useRef } from 'react';
import useDB from "@/hooks/useDB";
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";
import { HiUpload } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { Divider, LinearProgress } from "@mui/material";
import { uploadFile } from "@/hooks/useStorage";

export default function CarouselForm({ handleCloseForm }) {
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [totalProgress, setTotalProgress] = useState(0);
    const { add } = useDB('carousel');

    const fileInputRef = useRef(null);

    const onDrop = async (acceptedFiles) => {
        handleFileUpload(acceptedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // รีเซ็ตค่า input ก่อนเปิด file browser
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = async (fileArray) => {
        setUploadProgress(true);
        let totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
        let totalUploaded = 0;

        const uploadPromises = fileArray.map(async (file) => {
            const uploadedFile = await uploadFile(file, 'carousel', (progress) => {
                totalUploaded += (file.size * progress / 100);
                setTotalProgress((totalUploaded / totalSize) * 100);
            });

            if (uploadedFile) {
                await add(uploadedFile, 'carousel');
            }

            return uploadedFile;
        });

        const uploadedMedia = await Promise.all(uploadPromises);
        setFiles(uploadedMedia);
        setUploadProgress(false);
    };

    const handleClose = () => {
        setFiles([]);
        setTotalProgress(0);
        handleCloseForm();
    };

    return (
        <div className="flex flex-col w-[500px] p-4">
           <div className="flex flex-row items-center justify-between w-full">
               <span className="text-xl font-bold text-orange-500">อัพโหลดไฟล์</span>
               <IoClose size={25} onClick={handleClose} />
           </div>
           <div {...getRootProps()} 
            className={`flex flex-col justify-center p-2 w-full h-[300px]
            ${isDragActive ? 'border-2 border-dashed border-gray-200 bg-[#F5F5F5]' : 'bg-white'}
            `}>
                <span>ลากและวางไฟล์ หรือ เลือกไฟล์</span>
                <div className="flex flex-row items-center mb-2 justify-center border-2 border-dashed mt-2 gap-2 w-full h-20">
                    <input {...getInputProps()} />
                    <HiUpload size={40} />
                    {isDragActive ? (
                        <span>วางไฟล์ที่นี่</span>
                    ) : (
                        <>
                        <span>วางไฟล์ที่นี่ หรือ</span>
                        <span className="text-orange-500 font-bold cursor-pointer" onClick={handleUploadClick}>เลือกไฟล์</span>
                        <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(Array.from(e.target.files))} multiple style={{ display: "none" }} />
                        </>
                    )}
                </div>
           </div>
           <LinearProgress variant="determinate" value={totalProgress} />
           <Divider className="my-2"/>
           <div className="flex flex-row items-center justify-end gap-4 mt-4 w-full">
                <button
                    className="bg-orange-500 text-white font-bold p-2 rounded-xl"
                    onClick={handleClose}
                    disabled={uploadProgress? true : false}
                >
                    {uploadProgress ? 'กําลังอัปโหลด...' : 'ตกลง'}
                </button>
           </div>
        </div>
    );
}
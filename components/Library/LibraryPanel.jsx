import React, { useState, useEffect, forwardRef } from "react";
import useDB from "@/hooks/useDB";
import Image from "next/image";
import { toast } from "react-toastify";
import { Dialog, Slide, Tooltip, Slider } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import Upload from "../utils/Upload";
import { FaPlus, FaCheck } from "react-icons/fa";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdGridOn, MdGridView } from "react-icons/md";
import { deleteFile } from "@/hooks/useStorage";
import Swal from "sweetalert2";

const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));

const toolBar = [
    { label: "Add", icon: <FaPlus size={16} />, action: "add" },
    { label: "Delete", icon: <RiDeleteBin5Line size={16} />, action: "delete" },
    { label: "Info", icon: <IoInformationCircleOutline size={16} />, action: "info" },
];

export default function LibraryPanel({ onClose, setFileData }) {
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [selectFile, setSelectFile] = useState(null);
    const [imagesPerRow, setImagesPerRow] = useState(3); // ✅ เริ่มต้นที่ 3 รูปต่อแถว
    const { lang } = useLanguage();
    const { getAll } = useDB("files");

    useEffect(() => {
        const fetchFiles = async () => {
            const data = await getAll();
            if (data) setFiles(data);
        };

        if (!files.length) {
            fetchFiles();
        }
    }, [files]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    const handleClose = () => {
        onClose();
    };

    const handleClickButton = (action) => {
        if (action === "add") {
            handleClickOpen();
        } else if (action === "delete") {
            handleRemoveCover();
        } else {
            toast.info("Info");
        }
    };

    const handleSelectFile = (file) => {
        setSelectFile(file);
    };

    const handleClearFile = () => {
        setSelectFile(null);
    };

    const handleSubmit = () => {
        if (!selectFile) {
            toast.error("Please select a file");
            return;
        }
        setFileData(selectFile);
        onClose();
    };

    const handleRemoveCover = async () => {
        if (selectFile) {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                try {
                    const fileId = selectFile.file_id;
                    await deleteFile(fileId);
                    setFiles(null);
                    toast.success('ลบไฟล์สําเร็จ!');
                } catch (error) {
                    console.log(error);
                    toast.error('ลบไฟล์ไม่สําเร็จ!');
                }
            }
        } else {
            toast.error("Please select a file");
        }
    };

    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-gray-50 gap-4 w-full min-w-[500px]">
            {/* Header */}
            <div className="flex flex-row items-center justify-between p-2 gap-4">
                <h1 className="text-xl font-bold">{lang["library"]}</h1>
                <IoClose size={24} className="text-gray-400 hover:text-gray-500 cursor-pointer" onClick={handleClose} />
            </div>

            {/* Toolbar */}
            <div className="flex flex-row items-center bg-gray-500 p-2 gap-1">
                {toolBar.map((item, index) => (
                    <Tooltip title={item.label} placement="bottom" arrow key={index}>
                        <button
                            key={index}
                            type="button"
                            className="flex flex-row items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 rounded-lg p-2 cursor-pointer"
                            onClick={() => handleClickButton(item.action)}
                        >
                            {item.icon}
                        </button>
                    </Tooltip>
                ))}
            </div>
            {/* รูปภาพใน Grid */}
            <div className="p-2 w-full overflow-y-auto">
                <div 
                    className="grid gap-2 transition-all duration-300 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                >
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all hover:scale-105 ${
                                selectFile?.file_id === file.file_id ? "border-2 border-orange-500" : ""
                            }`}
                            onClick={() => handleSelectFile(file)}
                        >
                            <Image
                                src={file.url}
                                alt={file.name}
                                className="object-cover w-full h-full"
                                width={500}
                                height={500}
                                priority
                            />
                            {selectFile?.file_id === file.file_id && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <FaCheck className="text-green-500" size={24} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ปุ่มยืนยันการเลือกไฟล์ */}
            {selectFile && (
                <div className="flex flex-row items-center justify-end p-2 gap-1">
                    <button
                        type="button"
                        className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 border border-gray-300 rounded-lg p-2 cursor-pointer"
                        onClick={handleSubmit}
                    >
                        {lang["save"]}
                    </button>

                    <button
                        type="button"
                        className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 border border-gray-300 rounded-lg p-2 cursor-pointer"
                        onClick={handleClearFile}
                    >
                        {lang["cancel"]}
                    </button>
                </div>
            )}

            {/* Dialog อัปโหลดไฟล์ */}
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClickClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <Upload handleCloseForm={handleClickClose} setFiles={setFiles} />
            </Dialog>
        </div>
    );
}

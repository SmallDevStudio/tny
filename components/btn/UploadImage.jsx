import React,{ useState, useEffect, forwardRef } from "react";
import { IoImage } from "react-icons/io5";
import { Tooltip } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import { Dialog, Slide } from "@mui/material";
import Upload from "../utils/Upload";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function UploadImage({ onUpload, folder, size }) {
    const [open, setOpen] = useState(false);
    const { lang } = useLanguage();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title={lang["upload_image"]} arrow>
                <div 
                    className="flex flex-row items-center gap-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 rounded-xl p-2 cursor-pointer w-[250px]"
                    onClick={handleClickOpen}
                >
                    <IoImage size={size} />
                    <div className="flex flex-col">
                        <span className="font-bold text-orange-500">{lang["upload_image"]}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{lang["upload_image_desc"]}</span>
                    </div>
                </div>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <Upload 
                    handleCloseForm={handleClose} 
                    setFiles={onUpload} 
                    folder={folder} 
                />
            </Dialog>
        </>
    );
}
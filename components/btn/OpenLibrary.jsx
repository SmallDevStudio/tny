import { useState, useEffect, forwardRef } from "react";
import { Tooltip } from "@mui/material";
import { FaRegImages } from "react-icons/fa6";
import useLanguage from "@/hooks/useLanguage";
import { Dialog, Slide } from "@mui/material";
import LibraryPanel from "../Library/LibraryPanel";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function OpenLibrary({ size, onUpload }) {
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
        <button
            className="text-gray-600 hover:text-orange-500 dark:text-white dark:hover:text-orange-500"
        >   
            <Tooltip title={lang["open_library"]} placement="bottom" arrow>
                <div 
                    className="flex flex-row items-center gap-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 rounded-xl p-2 cursor-pointer w-[250px]"
                    onClick={handleClickOpen}
                >
                    <FaRegImages size={size} /> 
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-orange-500">{lang["library"]}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{lang["library_desc"]}</span>
                    </div>
                </div>
            </Tooltip>
        </button>

        {/* Modal */}
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <LibraryPanel 
                onClose={handleClose}
                setFileData={onUpload}
            />
        </Dialog>
        </>
    );
}
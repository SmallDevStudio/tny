import { useState, useEffect, forwardRef } from "react";
import useDB from "@/hooks/useDB";
import { Tooltip, Dialog, Slide, Divider } from "@mui/material";
import CarouselForm from "@/components/Carousels/CarouselForm";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="top" ref={ref} {...props} />;
});

export default function AdminCarousel() {
    const [openForm, setOpenForm] = useState(false);
    
    const handleOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    return (
        <section className="bg-white dark:bg-gray-800 p-2 rounded-xl">
            <h1 className="text-xl font-bold text-orange-500 dark:text-white">Carousel</h1>
            <span className="text-gray-500 dark:text-gray-400">จัดการ Slide ใน section carousel</span>
            <div className="flex flex-col mt-2 items-start w-full">
                <button
                    type="button"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleOpenForm}
                >
                    เพิ่ม Slide
                </button>
            </div>
            <Dialog
                open={openForm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseForm}
                aria-describedby="alert-dialog-slide-description"
            >
                <div className="flex flex-col items-start w-full">
                    <CarouselForm handleCloseForm={handleCloseForm} />
                </div>
            </Dialog>
        </section>
    );
}
import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, Slide, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import SearchBar from "@/components/Bar/SearchBar";
import Swal from "sweetalert2";
import { Sections } from "@/components/Layouts/Sections";
import { IoIosArrowBack } from "react-icons/io";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function SectionsPage() {
    const [form, setForm] = useState({});
    const [search, setSearch] = useState("");
    const router = useRouter();
    const { name } = router.query;
    const { lang, t } = useLanguage();
    const { subscribe, add, update, remove } = useDB(name);

    useEffect(() => {
        const unsubscribe = subscribe((sectionData) => {
            setForm(sectionData);
        });
        
        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800">
            <div className="max-w-screen px-4">
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                    <div className="flex flex-row items-center gap-4">
                        <IoIosArrowBack size={24} onClick={() => router.back()} className="cursor-pointer hover:text-orange-500"/>
                        <span className="uppercase font-bold">Section:</span>
                        <span className="uppercase">{name}</span>
                    </div>
                    <SearchBar search={search} setSearch={setSearch} />
                </div>
            </div>
        </div>
    );
}
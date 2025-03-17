import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, Slide, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import SearchBar from "@/components/Bar/SearchBar";
import Swal from "sweetalert2";

export default function Menu() {
    const [menu, setMenu] = useState([]);
    const { lang, t } = useLanguage();
    const { subscribe, add, update, remove } = useDB("menu");

    useEffect(() => {
        const unsubscribe = subscribe((menuData) => {
            setMenu(menuData);
        });
    
        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800">
            <div className="max-w-screen px-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {lang["menu-management"]}
                </h1>
            </div>
        </div>
    );
}
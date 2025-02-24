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

export default function AdminSections() {
    const { lang, t } = useLanguage();
    const router = useRouter();

    const handleRedirect = (name) => {
        if (name === 'team') {
            router.push('/admin/teams');
        } else {
            router.push(`/admin/sections/${name}`);
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800">
            <div className="max-w-screen px-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {lang["sections-management"]}
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2 lg:grid-cols-3">
                {Sections.map((section, index) => (
                    <div 
                        key={index}
                        className="flex flex-row items-center gap-6 border border-gray-400 p-4 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleRedirect(section.name)}
                    >
                        <div>
                            <Image
                                src={section?.thumbnail}
                                alt={section?.name}
                                width={100}
                                height={100}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="uppercase">
                                {section?.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                {t(section?.description)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
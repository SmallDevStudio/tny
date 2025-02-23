import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import { toast } from 'react-toastify';
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import { IoImage } from "react-icons/io5";
import { Dialog, Slide, Tooltip } from "@mui/material";
import Upload from "../utils/Upload";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CompanyForm() {
    const [company, setCompany] = useState({
        logo: [],
        name: { th: "", en: "" },
        address: { th: "", en: "" },
        phone: "",
        email: "",
    });
    const [logo, setLogo] = useState(null);
    const [open, setOpen] = useState(false);

    const { getById, update } = useDB("appdata");
    const { lang } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companyData = await getById("company");
                if (companyData) setCompany(companyData);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };

        fetchData();
    }, []); // ✅ ทำให้ useEffect รันแค่ครั้งเดียว

    console.log("logo", logo);

    const handleSubmit = async () => {
        try {
            await update("company", company);
            toast.success("บันทึกข้อมูลสำเร็จแล้ว!");
        } catch (error) {
            console.error(error);
            toast.error("บันทึกข้อมูลไม่สำเร็จ!");
        }
    };

    const handleUploadLogo = (file) => {
        setLogo(file[0]);
        setCompany({ ...company, logo: file[0] });
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="flex flex-col gap-2 mt-4 sm:grid-cols-2 sm:gap-4">
            {/* Logo */}
            <div className="flex flex-col gap-2 w-full">
                <div>
                    {company?.logo?.url && (
                        <div className="relative">
                            <Image
                                src={company.logo.url}
                                width={100}
                                height={100}
                                alt="logo"
                                className="rounded-lg"
                            />
                        </div>
                    )}
                </div>
                <Tooltip title={lang["upload_image"]} arrow>
                    <div 
                        className="flex flex-row items-center gap-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 rounded-xl p-2 cursor-pointer w-[250px]"
                        onClick={handleClickOpen}
                    >
                        <IoImage size={24} />
                        <div className="flex flex-col">
                            <span className="font-bold text-orange-500">{lang["upload_image"]}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{lang["upload_image_desc"]}</span>
                        </div>
                    </div>
                </Tooltip>
            </div>

            {/* Company Name */}
            <div className="sm:col-span-2">
                <label className="block mb-1 text-sm font-bold text-gray-900 dark:text-white">
                    ชื่อบริษัท
                </label>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="ชื่อบริษัท (ภาษาไทย)"
                        onChange={(e) =>
                            setCompany(prev => ({ ...prev, name: { ...prev.name, th: e.target.value } }))
                        }
                        value={company.name.th}
                        required
                    />
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="ชื่อบริษัท (ภาษาอังกฤษ)"
                        onChange={(e) =>
                            setCompany(prev => ({ ...prev, name: { ...prev.name, en: e.target.value } }))
                        }
                        value={company.name.en}
                        required
                    />
                </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    ที่อยู่
                </label>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <textarea
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="ที่อยู่ (ภาษาไทย)"
                        rows={2}
                        onChange={(e) =>
                            setCompany(prev => ({ ...prev, address: { ...prev.address, th: e.target.value } }))
                        }
                        value={company.address.th}
                    />
                    <textarea
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="ที่อยู่ (ภาษาอังกฤษ)"
                        rows={2}
                        onChange={(e) =>
                            setCompany(prev => ({ ...prev, address: { ...prev.address, en: e.target.value } }))
                        }
                        value={company.address.en}
                    />
                </div>
            </div>

            {/* Phone */}
            <div className="w-full">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    เบอร์โทร
                </label>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="เบอร์โทร"
                    value={company.phone}
                    onChange={(e) =>
                        setCompany(prev => ({ ...prev, phone: e.target.value }))
                    }
                />
            </div>

            {/* Email */}
            <div className="w-full">
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    อีเมล
                </label>
                <input
                    type="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="อีเมล"
                    value={company.email}
                    onChange={(e) =>
                        setCompany(prev => ({ ...prev, email: e.target.value }))
                    }
                />
            </div>

            {/* Submit Button */}
            <div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-20"
                    onClick={handleSubmit}
                >
                    บันทึก
                </button>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <Upload 
                    handleCloseForm={handleClose} 
                    setFiles={handleUploadLogo} 
                    folder={'logo'} 
                />
            </Dialog>
        </div>
    );
}

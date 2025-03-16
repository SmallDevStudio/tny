"use client";
import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import moment from "moment";
import "moment/locale/th";
import { Slide, Dialog } from "@mui/material";
import NumberingForm from "@/components/Numbering/NumberingForm";
import { getFormattedCode } from "@/utils/getFormattedCode";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DocumentNumbering() {
    const [data, setData] = useState([]);
    const [generatedCodes, setGeneratedCodes] = useState({}); // ✅ เก็บผลลัพธ์ของ getFormattedCode
    const [openForm, setOpenForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const { subscribe } = useDB("numbering");
    const { lang } = useLanguage();

    useEffect(() => {
        const unsubscribe = subscribe((data) => {
            if (data) {
                setData(data);

                // ✅ ดึงรหัสใหม่สำหรับเอกสารทุกตัว
                fetchGeneratedCodes(data);
            }
        });

        return () => unsubscribe();
    }, []);

    // ✅ ฟังก์ชันดึงรหัสเอกสารใหม่แบบ async
    const fetchGeneratedCodes = async (documents) => {
        const codes = {};
        for (const item of documents) {
            codes[item.id] = await getFormattedCode(item.document, item.last_number);
        }
        setGeneratedCodes(codes); // ✅ อัปเดต State หลังจากดึงข้อมูลเสร็จ
    };

    const handleOpenForm = () => {
        setSelectedItem(null);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedItem(null);
        setOpenForm(false);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setOpenForm(true);
    };

    return (
        <div className="bg-white dark:bg-gray-800 mx-auto">
            <h1 className="text-2xl font-semibold p-4">
                {lang["document_number_management"]}
            </h1>
            <span onClick={handleOpenForm}>add</span>
            <table className="w-full table-auto text-xs">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-1 w-12">#</th>
                        <th className="px-4 py-1">{lang["documents"]}</th>
                        <th className="px-4 py-1 w-56">{lang["document_number"]}</th>
                        <th className="px-4 py-1 w-56">{lang["document_number_use"]}</th>
                        <th className="px-4 py-1 w-56">{lang["created_at"]}</th>
                        <th className="px-4 py-1 w-56">{lang["updated_at"]}</th>
                        <th className="px-4 py-1 ">{lang["tools"]}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 ">
                    {data && data.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td>{index + 1}</td>
                            <td>{item.document}</td>
                            <td>{item.previewCode}</td>
                            <td>{generatedCodes? generatedCodes[item.id] : lang["loading"]}</td> {/* ✅ ใช้ค่าจาก state */}
                            <td>{moment(item.created_at).format("ll")}</td>
                            <td>{moment(item.updated_at).format("ll")}</td>
                            <td>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                    >
                                        {lang["edit"]}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex flex-row justify-between items-center p-2 text-xs">
                <div className="flex gap-2">
                    <span>{lang["record_length"]}:</span>
                    <span>{data.length > 0 ? data.length : 0}</span>
                </div>
            </div>
            <Dialog
                open={openForm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseForm}
                aria-labelledby="alert-dialog-slide-title"
            >
                <NumberingForm 
                    document={selectedItem} 
                    onClose={handleCloseForm}
                    newNumbering={!selectedItem}
                />
            </Dialog>
        </div>
    );
};

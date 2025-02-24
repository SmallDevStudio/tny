import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { Sections } from "@/components/Layouts/Sections";
import { toast } from "react-toastify";
import { RiDeleteBinLine } from "react-icons/ri";

export default function Contents({ page, sections }) {
    const [selectedSection, setSelectedSection] = useState({});
    const { lang } = useLanguage();

    return (
        <div className="bg-white dark:bg-gray-800 h-screen">
           <div className="flex flex-col border border-gray-200 rounded-lg w-full h-full">
                {/* Toolbar */}
                <div className="flex flex-row items-center bg-gray-200 w-full p-2">
                    <div className="flex items-center gap-2">
                        <label>Sections:</label>
                        <select
                            name="section"
                            id="section"
                            className="border border-gray-200 p-1 text-sm rounded-md bg-white"
                            value={selectedSection}
                            onChange={(e) => selectedSection(e.target.value)}
                        >
                            <option value="">{lang["please_select_a_section"]}</option>
                            {sections.map((item, index) => (
                                <option 
                                    key={index}
                                    value={item.component}
                                >
                                    {item.component}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Editor */}
                <div className="flex flex-col bg-gray-100 w-full h-full">
                    Editor
                </div>
                {/* Preview */}
                <div className="flex flex-col bg-gray-500 w-full h-full">
                    Preview
                </div>
               
           </div>
        </div>
    )
}
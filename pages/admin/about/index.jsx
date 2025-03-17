import React, { use, useEffect, useState } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { Sections } from "@/components/Layouts/Sections";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import SelectSections from "@/components/Sections/SelectSection";
import Contents from "@/components/Sections/Contents";


export default function AdminAbout() {
    const [sections, setSections] = useState([]);
    const [activeTab, setActiveTab] = useState("sections");
    const { lang } = useLanguage();
    const router = useRouter();

    const { getById } = useDB("pages");

    useEffect(() => {
        const unsubscribe = getById("about", (docData) => {
            if (docData) {
                setSections(docData.sections || []); // ✅ อัปเดต sections แบบ real-time
            }
        });

        return () => unsubscribe(); // ✅ หยุดฟังเมื่อ component unmount
    }, []);

    const handleActive = (tab) => {
        setActiveTab(tab);
    };

    const checkSections = (tab) => {
        if (sections.length === 0) {
            toast.error(lang["please_select_a_section"]);
            return;
        }
        setActiveTab(tab);
    }

   
    return (
        <div className="bg-white dark:bg-gray-800 p-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {lang["about"]}
            </h1>

            <div>
                <ul className="flex flex-row list-none">
                    <li
                        className={`cursor-pointer border-t border-l border-r rounded-t-xl px-6 pt-2 ${
                            activeTab === "sections" ? "bg-gray-400 text-white" : ""
                        }`}
                        onClick={() => handleActive("sections")}
                    >
                        {lang["sections"]}
                    </li>
                    <li
                        className={`cursor-pointer border-t border-l border-r rounded-t-xl px-6 pt-2 ${
                            activeTab === "content" ? "bg-gray-400 text-white" : ""
                        }`}
                        onClick={() => checkSections("content")}
                    >
                        {lang["content"]}
                    </li>
                </ul>
            </div>

            {activeTab === "sections" && <SelectSections page="about" sections={sections} />}
            {activeTab === "content" && <Contents sections={sections} page="about"/>}
        </div>
    );
}

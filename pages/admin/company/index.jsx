import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import CompanyForm from "@/components/AppSetting/CompanyForm";
import AppForm from "@/components/AppSetting/AppForm";
import { Tooltip, Divider } from "@mui/material";

export default function Company() {
    const [activeTab, setActiveTab] = useState("app");

    const handleActive = (tab) => {
        setActiveTab(tab);
    };

    return (
        <section className="bg-white dark:bg-gray-800 p-4 rounded-xl">
            <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">ข้อมูลบริษัท</h1>
            {/* Tab */}
            <div className="flex items-center justify-start ml-4 w-full">
                <ul className="flex flex-row list-none">
                    <li
                        className={`cursor-pointer border-t border-l border-r rounded-t-xl px-6 pt-2
                            ${activeTab === 'app' ? "bg-gray-400 text-white" : ""}
                            `}
                        onClick={() => handleActive("app")}
                    >
                        App
                    </li>

                    <li
                        className={`cursor-pointer border-t border-l border-r rounded-t-xl px-6 pt-2
                            ${activeTab === 'company' ? "bg-gray-400 text-white" : ""}
                            `}
                        onClick={() => handleActive("company")}
                    >
                        Company
                    </li>

                </ul>
            </div>

            <Divider className="mb-2" flexItem/>

            {/* Tab Section */}
            {activeTab === "app" && <AppForm />}
            {activeTab === "company" && <CompanyForm />}
            
        </section>
    )
}
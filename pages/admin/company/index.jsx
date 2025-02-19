import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import CompanyForm from "@/components/AppSetting/CompanyForm";
import AppForm from "@/components/AppSetting/AppForm";
import Modals from "@/components/utils/Modals";
import useDB from "@/hooks/useDB";
import { Tooltip, Divider } from "@mui/material";

export default function Company() {
    const [app, setApp] = useState(null);
    const [company, setCompany] = useState(null);
    const [activeTab, setActiveTab] = useState("app");
    const { getAll, add, update } = useDB("appdata");

    useEffect(() => {
        getAll();
    }, []);

    const handleSubmit = () => {
        const conpanyData = {
            name: {
                en: company.name_en,
                th: company.name_th
            },
            address: {
                en: company.address_en,
                th: company.address_th
            },
            phone: company.phone,
            email: company.email
        }
        const appData = {
            name: app.name,
            description: {
                en: app.description_en,
                th: app.description_th
            },
            social: {
                facebook: app.facebookUrl,
                instagram: app.instagramUrl,
                youtube: app.youtubeUrl,
                line: app.lineUrl,
                twitter: app.twitterUrl,
            },
            api_key: {
                facebook_api_key: facebook_api_key,
                google_api_key: google_api_key,
                line: line_api_key,
            }
        }
    }


    return (
        <section className="bg-white dark:bg-gray-900">
            <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">ข้อมูลบริษัท</h1>
            {/* Tab */}
            <div className="flex items-center justify-center w-full">
                <ul className="flex flex-row gap-8 list-none">
                    <li>
                        App
                    </li>
                    <li>
                        Company
                    </li>
                </ul>
            </div>

            <Divider className="my-2"/>

            {/* Tab Section */}
            {activeTab === "app" && <AppForm appData={app}/>}
            {activeTab === "company" && <Company companyData={company}/>}
            
        </section>
    )
}
import React, { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
import { Dialog, Slide } from "@mui/material";
import { IoClose } from "react-icons/io5";
import SelectSections from "@/components/Sections/SelectSection";
import Link from "next/link";
import AdminPages from "@/components/Pages/AdminPages";
import AdminPagesDetail from "@/components/Pages/AdminPagesDetail";
import AdminPagesDynamic from "@/components/Pages/AdminPagesDynamic";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminPagesManagement() {
  const [activeTab, setActiveTab] = useState("pages");
  const router = useRouter();
  const { lang, t } = useLanguage();

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{lang["management_pages"]}</h1>

      {/* Tabs */}
      <div className="flex flex-row items-center justify-center w-full">
        <ul className="flex flex-row list-none gap-8 items-center justify-center w-full">
          <li
            className={`cursor-pointer border-t border-l border-r rounded-t-xl px-6 pt-2
                ${
                  activeTab === "pages"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200 text-gray-600"
                }
                `}
            onClick={() => handleActiveTab("pages")}
          >
            {lang["pages"]}
          </li>
          <li
            className={`cursor-pointer border-t border-l border-r rounded-t-xl px-6 pt-2
              ${
                activeTab === "page_dynamic"
                  ? "bg-orange-400 text-white"
                  : "bg-gray-200 text-gray-600"
              }
              `}
            onClick={() => handleActiveTab("page_dynamic")}
          >
            {lang["page_dynamic"]}
          </li>
          <li
            className={`cursor-pointer border-t border-l border-r rounded-t-xl px-6 pt-2
              ${
                activeTab === "page_details"
                  ? "bg-orange-400 text-white"
                  : "bg-gray-200 text-gray-600"
              }
              `}
            onClick={() => handleActiveTab("page_details")}
          >
            {lang["page_details"]}
          </li>
        </ul>
      </div>
      {/* Content */}
      <div className="flex border border-gray-200 rounded-lg p-4 shadow-lg">
        {activeTab === "pages" && <AdminPages />}
        {activeTab === "page_dynamic" && <AdminPagesDynamic />}
        {activeTab === "page_details" && <AdminPagesDetail />}
      </div>
    </div>
  );
}

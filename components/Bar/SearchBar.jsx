import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import useLanguage from "@/hooks/useLanguage";

export default function SearchBar({ search, setSearch }) {
    const { lang } = useLanguage();
    return (
        <div className="relative">
            <input
                type="text"
                value={search}
                placeholder={lang["search"]}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-orange-500"
            />
            <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
                <IoSearchOutline size={20} className="text-gray-500"/>
            </div>
        </div>
    );
}
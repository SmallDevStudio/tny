import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { IoMenu, IoSunny, IoMoon, IoSearch, IoClose } from "react-icons/io5";
import { Tooltip } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";

export default function SearchButton({ size }) {
    const router = useRouter();
    const { lang } = useLanguage();

    return (
        <button
            className="text-gray-600 hover:text-orange-500 dark:text-white dark:hover:text-orange-500"
        >
            <Tooltip title={lang["search"]} placement="bottom" arrow>
                <IoSearch size={size} />
            </Tooltip>
        </button>
    );
}

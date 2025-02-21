import { useState } from "react";
import { useRouter } from "next/router";
import { LuShoppingCart } from "react-icons/lu";
import { Tooltip } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";

export default function CartButton({ size }) {
    const router = useRouter();
    const { lang } = useLanguage();

    return (
        <button
            className="text-gray-600 hover:text-orange-500 dark:text-white dark:hover:text-orange-500"
        >   
            <Tooltip title={lang["cart"]} placement="bottom" arrow>
                <LuShoppingCart size={size} />
            </Tooltip>
        </button>
    );
}
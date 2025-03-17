import { useState, useEffect } from "react";
import axios from "axios";
import MenuBar from "@/components/Bar/MenuBar";
import { Tooltip, Menu, MenuItem } from "@mui/material";
import { signOut } from 'next-auth/react';
import { useRouter } from "next/router";

export default function HomeHeader() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <section className="flex flex-row justify-between items-center p-2 w-full">
            {/* Header */}
            <div className="flex items-center header-logo" style={{ width: '60%'}}>
                <span className="font-bold text-2xl">The New You</span>
            </div>

            {/* Menu Bar */}
            <div className="flex flex-row px-2 menu-bar w-full">
                <MenuBar 
                    isCollapsed={isCollapsed} 
                    setIsCollapsed={setIsCollapsed}
                    className="w-full"
                />
            </div>
        </section>
    );
}
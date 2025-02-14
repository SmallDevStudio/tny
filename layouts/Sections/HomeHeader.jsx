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
        <section className="flex flex-col w-full" style={{ height: '150px' }}>
           <div className="flex flex-col justify-center h-full w-full" style={{ height: '100%' }}>
            <div className="flex flex-col w-full p-2">
                    {/* Header */}
                    <div className="flex flex-row w-full">
                        <span className="text-3xl font-bold">The New You</span>
                    </div>

                    {/* Menu Bar */}
                    <div className="flex flex-row self-end w-full">
                        <MenuBar 
                            isCollapsed={isCollapsed} 
                            setIsCollapsed={setIsCollapsed}
                            className="w-full"
                        />
                    </div>
            </div>
           </div>

        </section>
    );
}
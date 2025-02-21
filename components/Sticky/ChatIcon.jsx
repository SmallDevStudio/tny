import { useState } from "react";
import { Tooltip } from "@mui/material";
import Image from "next/image";

export default function ChatIcon() {
    return (
        <div className="hidden lg:fixed lg:bottom-4 lg:right-4 lg:flex">
            <div className="relative cursor-pointer">
                <Image
                    src="/images/chat_icon.png"
                    alt="Chat Icon"
                    width={50}
                    height={50}
                    className="cursor-pointer"
                    loading="lazy"
                />
                <span className="text-black dark:text-white text-[10px] font-bold">Live Chat</span>
            </div>
        </div>
    );
}
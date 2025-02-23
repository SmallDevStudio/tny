import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Tooltip, Menu, MenuItem, Divider } from "@mui/material";
import { signOut } from "next-auth/react";
import UserAvatar from "../utils/UserAvatar";
import useLanguage from "@/hooks/useLanguage";

export default function UserButton({ user, size }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
    const { lang } = useLanguage();
    const { data: session } = useSession();

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/signin" });
    };

    return (
        <div className="flex">
            {user ? (
                <>
                <Tooltip title={lang["clickmenu"]} placement="bottom" arrow>
                    <div className="flex cursor-pointer" onClick={handleAvatarClick}>
                        <UserAvatar size={size} />
                    </div>
                </Tooltip>
                                                        
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}  // ✅ กำหนด anchorEl
                    keepMounted
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                >   
                    {session?.user?.role === "admin" && 
                    <MenuItem onClick={() => router.push("/admin")}>{lang["admin_console"]}</MenuItem>
                    }
                    <Divider />
                    <MenuItem onClick={() => router.push("/profile")}>{lang["profile"]}</MenuItem>
                    <MenuItem onClick={handleLogout}>{lang["signout"]}</MenuItem>
                </Menu>
                </>
            ) : (
                <div className="flex gap-2">
                <button 
                    className="text-black dark:text-white hover:text-orange-500"
                    onClick={() => router.push("/signin")}
                >
                    {lang["signin"]}
                </button>
                <span>/</span>
                <button 
                    className="text-black dark:text-white hover:text-orange-500"
                    onClick={() => router.push("/register")}
                >
                    {lang["register"]}
                </button>
                </div>
            )}
        </div>
    )
}
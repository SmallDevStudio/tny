import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoHome, IoPeople, IoHomeOutline, IoSunny, IoMoon, IoSettings, IoMenu } from "react-icons/io5";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, Menu, MenuItem, Dialog } from "@mui/material";
import UserAvatar from "../utils/UserAvatar";

const menuItems = [
    { label: "Home", href: "/", icon: <IoHome /> },
    { label: "About", href: "/about", icon: <IoPeople /> },
    { label: "Contact", href: "/contact", icon: <IoHomeOutline /> },
];

export default function MenuBar() {
    const { theme, toggleTheme } = useTheme();
    const { data: session } = useSession();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/signin" });
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    return (
        <>
            <div className="flex flex-row items-center w-full">
                <div className="hidden md:flex flex-row w-full items-center justify-end ">
                    {menuItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(item.href)}>
                            {item.icon} {item.label}
                        </div>
                    ))}
                    <button onClick={toggleTheme}>{theme === "light" ? <IoMoon /> : <IoSunny />}</button>

                    <div className="flex">
                        {session?.user ? (
                            <>
                            <div className="flex cursor-pointer" onClick={handleAvatarClick}>
                                <UserAvatar size={24} />
                            </div>
                            
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}  // ✅ กำหนด anchorEl
                                keepMounted
                                open={menuOpen}
                                onClose={() => setMenuOpen(false)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                            </Menu>
                            </>
                        ) : (
                            <button onClick={() => router.push("/signin")}>เข้าสู่ระบบ</button>
                        )}
                    </div>
                </div>

                <div className="flex justify-end md:hidden">
                    <IoMenu size={26} onClick={() => setDialogOpen(true)} />
                </div>

                
            </div>

            

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <div className="p-4 flex flex-col gap-2">
                    {menuItems.map((item, index) => (
                        <div key={index} className="cursor-pointer" onClick={() => router.push(item.href)}>
                            {item.icon} {item.label}
                        </div>
                    ))}
                    <button onClick={toggleTheme}>{theme === "light" ? <IoMoon /> : <IoSunny />}</button>
                    {session?.user && (
                        <>
                            <div className="cursor-pointer" onClick={() => router.push("/profile")}>Profile</div>
                            <div className="cursor-pointer" onClick={handleLogout}>Sign Out</div>
                        </>
                    )}
                </div>
            </Dialog>
        </>
    );
}

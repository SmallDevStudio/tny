import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import { IoHome, IoPeople, IoHomeOutline, IoSunny, IoMoon, IoSearch, IoMenu, IoClose } from "react-icons/io5";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, Menu, MenuItem, Dialog, Slide } from "@mui/material";
import UserAvatar from "../utils/UserAvatar";
import { MdPermContactCalendar } from "react-icons/md";

const menuItems = [
    { label: "Home", href: "/", icon: <IoHome /> },
    { label: "About", href: "/about", icon: <IoPeople /> },
    { label: "Contact", href: "/contact", icon: <MdPermContactCalendar /> },
];

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
  });

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
                <div className="hidden md:flex flex-row w-full items-center justify-between gap-4">
                    <div className="flex flex-row items-center gap-6 w-full">
                        {menuItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(item.href)}>
                                {item.icon} {item.label}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-row items-center gap-4">
                        <button>
                            <IoSearch size={20}/>
                        </button>
                        <button 
                            onClick={toggleTheme}>{theme === "light" ? <IoMoon size={20}/> : <IoSunny size={20}/>}
                        </button>

                        <div className="flex">
                            {session?.user ? (
                                <>
                                <div className="flex cursor-pointer" onClick={handleAvatarClick}>
                                    <UserAvatar size={22} />
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

                </div>

                <div className="flex justify-end md:hidden">
                    <IoMenu size={26} onClick={() => setDialogOpen(true)} />
                </div>

                
            </div>

            

            <Dialog 
                fullScreen
                open={dialogOpen} 
                onClose={() => setDialogOpen(false)}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
                        color: theme === 'light' ? '#333' : '#f5f5f5',
                    },
                }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-2 w-full">
                        <IoClose onClick={() => setDialogOpen(false)} size={30}/>
                    </div>
                    <div className="flex flex-col gap-1 text-md px-2">
                        {menuItems.map((item, index) => (
                            <div 
                                key={index} 
                                className="flex flex-row items-center gap-2 cursor-pointer" 
                                onClick={() => router.push(item.href)}
                            >
                                {item.icon} {item.label}
                            </div>
                        ))}
                        <button 
                            onClick={toggleTheme}
                        >
                                {theme === "light" ? <IoMoon /> : <IoSunny />}
                        </button>
                        {session?.user && (
                            <>
                                <div 
                                    className="cursor-pointer" 
                                    onClick={() => router.push("/profile")}
                                >
                                    Profile
                                </div>
                                <div 
                                    className="cursor-pointer" 
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
}

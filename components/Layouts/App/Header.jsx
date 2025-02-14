import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession, signOut } from "next-auth/react";
import UserAvatar from "@/components/utils/UserAvatar";
import Loading from "@/components/utils/Loading";
import { IoMenu, IoSunny, IoMoon, IoSettings, IoSearch, IoClose } from "react-icons/io5";
import { Tooltip, Menu, MenuItem, Dialog, Slide } from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { theme, toggleTheme } = useTheme();
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return <Loading />;

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/signin" });
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    return (
        <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link href="https://www.thenewyou.co.th" className="flex items-center">
                        {/*<img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" /> */}
                        <div className="flex flex-col items-center">
                            <span className="self-center text-orange-500 text-xl font-semibold whitespace-nowrap dark:text-white">The New You</span>
                            <span className="self-center text-xl whitespace-nowrap dark:text-white">Academy</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-2 lg:order-2">
                        <button 
                            className="text-gray-700 dark:text-gray-50 mr-2"
                        >
                            <IoSearch size={20}/>
                        </button>

                        <button className="text-gray-700 dark:text-gray-50 mr-2" onClick={toggleTheme}>
                            {theme === "light" ? <IoMoon size={22}/> : <IoSunny size={22}/>}
                        </button>

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
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                                    >
                                        <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
                                        <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <button 
                                    className=" bg-orange-500 text-white dark:text-white hover:bg-orange-800 focus:ring-4 focus:ring-orange-900 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                                    onClick={() => router.push("/signin")}
                                >
                                    เข้าสู่ระบบ
                                </button>
                            )}
                            </div>

                        <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </button>

                    </div>

                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <Link 
                                    href="#" 
                                    className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" 
                                    aria-current="page"
                                >
                                    หน้าแรก
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="#" 
                                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                        หลักสูตร
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="#" 
                                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                        บทความ
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="#" 
                                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                        รีวิว
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="#" 
                                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                        ทีม
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="#" 
                                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    เกี่ยวกับ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
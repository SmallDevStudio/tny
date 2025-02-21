import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession } from "next-auth/react";
import { IoMenu, IoSunny, IoMoon, IoSearch, IoClose } from "react-icons/io5";
import { Tooltip, Dialog, Slide, Divider } from "@mui/material";
import LangButton from "@/components/btn/LangButton";
import UserButton from "@/components/btn/UserButton";
import LogoComponents from "@/components/LogoComponents";
import SearchButton from "@/components/btn/SearchButton";
import CartButton from "@/components/btn/CartButton";
import useLanguage from "@/hooks/useLanguage";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

// รายการเมนู
const menuItems = [
    { label: "เกี่ยวกับ", name: "about", href: "/about" },
    { label: "หน้าแรก", name: "home", href: "/" },
    { label: "หลักสูตร", name: "courses", href: "#" },
    { label: "บทความ", name: "blog", href: "#" },
    { label: "รีวิว", name: "reviews", href: "#" },
    { label: "ทีม", name: "team", href: "#" },
]

export default function Header() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState("home");
    const { theme, toggleTheme } = useTheme();
    const { data: session, status } = useSession();
    const router = useRouter();
    const { lang } = useLanguage();

    console.log(router.pathname);
    console.log(router.query.slug);

    useEffect(() => {
        if (router.pathname === "/") {
            setActiveMenuItem("home");
        } else {
            setActiveMenuItem(router.query.slug || "home");
        }
    },[]);

    if (status === "loading") return null;

    return (
        <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 w-full">
                <div className="flex justify-between items-center mx-auto">
                    
                    {/* Logo */}
                    <LogoComponents size={100}/>

                    {/* Desktop Menu (แสดงเฉพาะจอใหญ่) */}
                    <div className="hidden lg:flex items-center gap-8">
                        {menuItems.map((item, index) => (
                            <Link key={index} href={item.href} 
                                className={`text-lg text-gray-700 hover:text-orange-500 dark:text-gray-50 dark:hover:text-orange-500
                                    ${item.name === activeMenuItem ? "font-semibold text-orange-500 dark:text-orange-500" : ""}
                                `}>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Buttons (User, Search, Theme, Lang) */}
                    <div className="hidden lg:flex items-center gap-3">
                        <UserButton user={session?.user} size={30} />
                        <SearchButton size={24} />
                        <LangButton />
                       <CartButton size={24} />
                       <Tooltip title={lang["changeTheme"]} placement="bottom">
                            <button className="text-gray-700 dark:text-gray-50" onClick={toggleTheme}>
                                {theme === "light" ? <IoMoon size={22} /> : <IoSunny size={22} />}
                            </button>
                       </Tooltip>
                    </div>

                    {/* Mobile Menu Button */}
                    <div 
                        className="lg:hidden text-gray-700 dark:text-gray-50"
                    >
                        <SearchButton size={28} />
                        <button 
                            className="lg:hidden text-gray-700 dark:text-gray-50 ml-2"
                            onClick={() => setDialogOpen(true)}
                        >
                            <IoMenu size={28} />
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu (Dialog) */}
                <Dialog 
                    fullScreen 
                    open={dialogOpen} 
                    onClose={() => setDialogOpen(false)}
                    TransitionComponent={Transition}
                >
                    <div className="h-full w-full bg-white dark:bg-gray-800 flex flex-col">
                        {/* Header ของ Mobile Menu */}
                        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                            <span className="text-xl font-semibold dark:text-white">Menu</span>
                            <button className="text-gray-700 dark:text-gray-50" onClick={() => setDialogOpen(false)}>
                                <IoClose size={28} />
                            </button>
                        </div>

                        {/* User + Search + Theme + Lang */}
                        <div className="p-4 flex flex-col gap-4">
                            <UserButton user={session?.user} size={40} />
                            <div className="flex flex-row gap-8">
                                <LangButton isText={true} size={24} />
                                <button className="text-gray-700 dark:text-gray-50 flex items-center gap-2" onClick={toggleTheme}>
                                    {theme === "light" ? <IoMoon size={24} /> : <IoSunny size={24} />}
                                    <span className="text-lg">{theme === "light" ? lang["darkMode"] : lang["lightMode"] }</span>
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <Divider className="my-4" />

                        {/* รายการเมนู (Mobile) */}
                        <div className="p-4 flex flex-col gap-4">
                            {menuItems.map((item, index) => (
                                <Link key={index} href={item.href} className="text-lg text-gray-700 dark:text-gray-50" onClick={() => setDialogOpen(false)}>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </Dialog>
            </nav>
        </header>
    );
}

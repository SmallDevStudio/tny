import { IoMenu, IoSunny, IoMoon, IoSettings } from "react-icons/io5";
import { useTheme } from "@/contexts/ThemeContext";
import { useSession } from "next-auth/react";
import { Tooltip } from "@mui/material";
import UserButton from "@/components/btn/UserButton";
import LangButton from "@/components/btn/LangButton";


export default function HeaderBar({ isCollapsed, setIsCollapsed }) {
    const { theme, toggleTheme } = useTheme();
    const { data: session } = useSession();

    return (
        <header className="header-bar dark:bg-gray-900">
            <div className="flex flex-row items-center">
                <IoMenu className="menu-icon" onClick={() => setIsCollapsed(!isCollapsed)} />
                <h1 className="header-title">Admin Panel</h1>
            </div>
            <div className="flex flex-row items-center gap-2">
                <LangButton isText={true}/>

                <Tooltip title={theme === 'light' ? 'Light Mode' : 'Dark Mode'} placement="bottom">
                    <button className="theme-toggle dark:text-white" onClick={toggleTheme}>
                        {theme === "light" ? <IoMoon /> : <IoSunny />}
                    </button>
                </Tooltip>
                <UserButton user={session?.user} size={32} />
            </div>
        </header>
    );
}

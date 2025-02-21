import { useState } from "react";
import { useRouter } from "next/router";
import { IoHome, IoPeople, IoChevronForward, IoHomeOutline } from "react-icons/io5";
import { RiArticleLine, RiPagesLine } from "react-icons/ri";
import { CgWebsite } from "react-icons/cg"
import { Tooltip, Popover, List, ListItem, ListItemText } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { BsFillMenuButtonFill } from "react-icons/bs";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { RiSeoLine } from "react-icons/ri";

const menuItems = [
    { title: "Dashboard", icon: <IoHome />, href: "/admin" },
    { title: "Company", icon: <CgWebsite />, href: "/admin/company" },
    { 
        title: "Home", 
        icon: <IoHomeOutline />, 
        subMenu: [
            { title: "Carousel", href: "/admin/home/carousel" },
        ] 
    },
    { title: "Courses", icon: <RiArticleLine />, href: "/admin/courses" },
    { title: "Pages", icon: <RiPagesLine />, href: "/admin/pages" },
    { title: "Menu", icon: <BsFillMenuButtonFill />, href: "/admin/menu" },
    { title: "Contact", icon: <MdOutlinePermContactCalendar />, href: "/admin/contact" },
    { title: "SEO", icon: <RiSeoLine />, href: "/admin/seo" },
    { 
        title: "Users", 
        icon: <IoPeople />, 
        subMenu: [
            { title: "All Users", href: "/admin/users/all" },
            { title: "Add User", href: "/admin/users/add" },
        ]
    },
    { 
        title: "Settings", 
        icon: <BsFillMenuButtonFill />, 
        subMenu: [
            { title: "General Settings", href: "/admin/settings" },
            { title: "Appearance", href: "/admin/settings/appearance" },
        ]
    },
];

export default function Sidebar({ isCollapsed }) {
    const { theme } = useTheme();
    const router = useRouter();
    const currentPath = router.pathname;

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);

    const handleMenuItemClick = (href) => {
        if (currentPath !== href) {
            router.push(href);
        }
    };

    const handleOpenSubMenu = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedSubMenu(item.subMenu);
    };

    const handleCloseSubMenu = () => {
        setAnchorEl(null);
        setSelectedSubMenu(null);
    };

    return (
        <nav className={`sidebar ${isCollapsed ? "collapsed" : ""} dark:bg-gray-900 dark:text-white`}>
            <ul className="menu-list">
                <div>
                    {isCollapsed ? (
                        <div className="text-lg font-bold ">
                            <span>TNY</span>
                        </div>
                    ) : (
                        <div>
                            <span className="text-lg font-bold">The New You</span>
                            <span className="text-sm font-light ml-2">Academy</span>
                        </div>
                    )}
                </div>
                {menuItems.map((item, index) => (
                    <Tooltip key={index} title={isCollapsed ? item.title : ""} placement="right">
                        <li 
                            onClick={(e) => item.subMenu ? handleOpenSubMenu(e, item) : handleMenuItemClick(item.href)}
                            className={`menu-item ${currentPath === item.href ? "active" : ""}`}
                        >
                            <span className="dark:text-white">{item.icon}</span>
                            {!isCollapsed && <span className="menu-text dark:text-white">{item.title}</span>}
                            {item.subMenu && !isCollapsed && <IoChevronForward className="submenu-icon" />}
                        </li>
                    </Tooltip>
                ))}
            </ul>

            {/* ✅ Submenu Popup (แสดงออกไปทางขวา) */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseSubMenu}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "left",
                }}
                PaperProps={{
                    sx: { minWidth: 180, backgroundColor: theme === "dark" ? "#333" : "#fff", color: theme === "dark" ? "#fff" : "#000" }
                }}
            >
                <List>
                    {selectedSubMenu?.map((sub, index) => (
                        <ListItem button key={index} onClick={() => handleMenuItemClick(sub.href)}>
                            <ListItemText primary={sub.title} />
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </nav>
    );
}

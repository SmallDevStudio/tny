import { useState } from "react";
import { useRouter } from "next/router";
import { IoHome, IoPeople, IoChevronForward, IoHomeOutline } from "react-icons/io5";
import { RiArticleLine, RiPagesLine } from "react-icons/ri";
import { CgWebsite } from "react-icons/cg"
import { Tooltip, Popover, List, ListItem, ListItemText } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";

const menuItems = [
    { title: "Dashboard", icon: <IoHome />, href: "/admin" },
    { title: "Company", icon: <CgWebsite />, href: "/admin/company" },
    { title: "HomePage", icon: <IoHomeOutline />, href: "/admin/homepage" },
    { title: "Courses", icon: <RiArticleLine />, href: "/admin/courses" },
    { title: "Pages", icon: <RiPagesLine />, href: "/admin/pages" },
    { 
        title: "Users", 
        icon: <IoPeople />, 
        subMenu: [
            { title: "All Users", href: "/admin/users/all" },
            { title: "Add User", href: "/admin/users/add" },
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
        <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <ul className="menu-list">
                <div>
                    {isCollapsed ? (
                        <div className="text-lg font-bold">
                            <span>TNY</span>
                        </div>
                    ) : (
                        <span className="text-lg font-bold">The New You</span>
                    )}
                </div>
                {menuItems.map((item, index) => (
                    <Tooltip key={index} title={isCollapsed ? item.title : ""} placement="right">
                        <li 
                            onClick={(e) => item.subMenu ? handleOpenSubMenu(e, item) : handleMenuItemClick(item.href)}
                            className={`menu-item ${currentPath === item.href ? "active" : ""}`}
                        >
                            {item.icon}
                            {!isCollapsed && <span className="menu-text">{item.title}</span>}
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

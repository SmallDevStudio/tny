import { useState } from "react";
import { useRouter } from "next/router";
import {
  IoHome,
  IoPeople,
  IoChevronForward,
  IoHomeOutline,
} from "react-icons/io5";
import { RiArticleLine, RiPagesLine } from "react-icons/ri";
import { CgWebsite } from "react-icons/cg";
import { Tooltip, Popover, List, ListItem, ListItemText } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { BsFillMenuButtonFill } from "react-icons/bs";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { TbSection } from "react-icons/tb";
import { RiTeamLine } from "react-icons/ri";
import { LuPaintbrush } from "react-icons/lu";
import { MdOutlineArticle } from "react-icons/md";

const menuItems = [
  { title: "Dashboard", icon: <IoHome />, href: "/admin" },
  {
    title: "Administrative",
    icon: <CgWebsite />,
    subMenu: [
      { title: "Company", href: "/admin/company" },
      {
        title: "Document Numbering",
        href: "/admin/settings/document-numbering",
      },
    ],
  },
  //{
  //  title: "Home",
  //  icon: <IoHomeOutline />,
  //  subMenu: [
  //    { title: "Sections", href: "/admin/home/sections" },
  //    { title: "Contents", href: "/admin/home/contents" },
  //  ],
  // },
  {
    title: "Courses",
    icon: <RiArticleLine />,
    href: "/admin/courses",
  },
  //{
  //  title: "Blog",
  //  icon: <MdOutlineArticle />,
  //  href: "/admin/blog",
  //  subMenu: [
  //    { title: "Blog", href: "/admin/blog" },
  //    { title: "Pages", href: "/admin/blog/pages" },
  //  ],
  //},
  { title: "Pages", icon: <RiPagesLine />, href: "/admin/pages" },
  { title: "Menu", icon: <BsFillMenuButtonFill />, href: "/admin/menu" },
  { title: "Teams", icon: <RiTeamLine />, href: "/admin/teams" },
  { title: "Themes", icon: <LuPaintbrush />, href: "/admin/themes" },
  {
    title: "Users",
    icon: <IoPeople />,
    subMenu: [
      { title: "Users", href: "/admin/users" },
      { title: "User Groups", href: "/admin/users/groups" },
    ],
  },
  {
    title: "Settings",
    icon: <BsFillMenuButtonFill />,
    subMenu: [
      { title: "General Settings", href: "/admin/settings" },
      { title: "Appearance", href: "/admin/settings/appearance" },
    ],
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
    handleCloseSubMenu();
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
    <nav
      className={`sidebar ${
        isCollapsed ? "collapsed" : ""
      } dark:bg-gray-900 dark:text-white`}
    >
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
          <Tooltip
            key={index}
            title={isCollapsed ? item.title : ""}
            placement="right"
          >
            <li
              onClick={(e) =>
                item.subMenu
                  ? handleOpenSubMenu(e, item)
                  : handleMenuItemClick(item.href)
              }
              className={`menu-item ${
                currentPath === item.href ? "active" : ""
              }`}
            >
              <span className="dark:text-white">{item.icon}</span>
              {!isCollapsed && (
                <span className="menu-text dark:text-white">{item.title}</span>
              )}
              {item.subMenu && !isCollapsed && (
                <IoChevronForward className="submenu-icon" />
              )}
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
          sx: {
            minWidth: 180,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          },
        }}
      >
        <List>
          {selectedSubMenu?.map((sub, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleMenuItemClick(sub.href)}
              className="cursor-pointer"
            >
              <ListItemText primary={sub.title} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </nav>
  );
}

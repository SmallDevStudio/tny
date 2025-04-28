import { useState } from "react";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
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
import { MdOutlineArticle, MdOutlinePolicy } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { GrArticle } from "react-icons/gr";
import { FaRegFolder, FaWpforms } from "react-icons/fa6";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";

const menuItems = [
  {
    title: { en: "Dashboard", th: "แดชบอร์ด" },
    icon: <AiOutlineDashboard />,
    href: "/admin",
  },
  {
    title: { en: "Administrative", th: "ผู้ดูแลระบบ" },
    icon: <CgWebsite />,
    subMenu: [
      { title: { en: "Company", th: "บริษัท" }, href: "/admin/company" },
      {
        title: { en: "Document Numbering", th: "เลขที่เอกสาร" },
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
    title: { en: "Courses", th: "คอร์ส" },
    icon: <RiArticleLine />,
    href: "/admin/courses",
  },
  {
    title: { en: "Blog", th: "บล็อก" },
    icon: <MdOutlineArticle />,
    href: "/admin/blog",
  },
  {
    title: { en: "Articles", th: "บทความ" },
    icon: <GrArticle />,
    href: "/admin/articles",
  },
  {
    title: { en: "News", th: "ข่าวสาร" },
    icon: <IoNewspaperOutline />,
    href: "/admin/news",
  },
  {
    title: { en: "Pages", th: "หน้าเพจ" },
    icon: <RiPagesLine />,
    href: "/admin/pages",
  },
  {
    title: { en: "Menu", th: "เมนู" },
    icon: <BsFillMenuButtonFill />,
    href: "/admin/menu",
  },
  {
    title: { en: "Teams", th: "ทีม" },
    icon: <RiTeamLine />,
    href: "/admin/teams",
  },
  {
    title: { en: "Media", th: "มีเดีย" },
    icon: <FaRegFolder />,
    href: "/admin/media",
  },
  {
    title: { en: "Forms", th: "แบบฟอร์ม" },
    icon: <FaWpforms />,
    href: "/admin/forms",
  },
  {
    title: { en: "Chat", th: "แชท" },
    icon: <IoChatbubbleEllipsesOutline />,
    href: "/admin/chat",
  },
  {
    title: { en: "Payments", th: "การชําระเงิน" },
    icon: <MdOutlinePayment />,
    href: "/admin/payments",
  },
  {
    title: { en: "Themes", th: "ธีม" },
    icon: <LuPaintbrush />,
    href: "/admin/themes",
  },
  {
    title: { en: "Users", th: "ผู้ใช้" },
    icon: <IoPeople />,
    subMenu: [
      { title: { en: "Users", th: "ผู้ใช้" }, href: "/admin/users" },
      { title: { en: "Groups", th: "กลุ่ม" }, href: "/admin/users/groups" },
    ],
  },
  {
    title: { en: "Settings", th: "การตั้งค่า" },
    icon: <BsFillMenuButtonFill />,
    subMenu: [
      { title: { en: "General", th: "ทั่วไป" }, href: "/admin/settings" },
      {
        title: { en: "Appearance", th: "ออกแบบ" },
        href: "/admin/settings/appearance",
      },
    ],
  },
  {
    title: { en: "Privacy Policy", th: "นโยบายความเป็นส่วนตัว" },
    icon: <MdOutlinePolicy />,
    href: "/admin/privacy-policy",
  },
];

export default function Sidebar({ isCollapsed }) {
  const { theme } = useTheme();
  const router = useRouter();
  const currentPath = router.pathname;

  const { t, lang } = useLanguage();

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
            title={isCollapsed ? item.title.en : ""}
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
                <span className="menu-text dark:text-white">
                  {t(item.title)}
                </span>
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
              <ListItemText primary={t(sub.title)} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </nav>
  );
}

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
import Menu from "@/components/menu/Menu";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import useDB from "@/hooks/useDB";
import { signOut } from "next-auth/react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function Header() {
  const [menuItems, setMenuItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("home");
  const { theme, toggleTheme } = useTheme();
  const [isUsePayment, setIsUsePayment] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { subscribe, getById, update } = useDB("appdata");

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getDocs(collection(db, "menu"));
      setMenuItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const currentPath = router.asPath;
    const items = menuItems[0]?.items || [];

    const matchedItem = items
      .filter(
        (item) =>
          currentPath === item.url ||
          currentPath.startsWith(item.url + "/") ||
          currentPath.startsWith(item.url + "?") ||
          currentPath.startsWith(item.url + "#")
      )
      .sort((a, b) => b.url.length - a.url.length)[0]; // match ที่ url ยาวสุด

    setActiveMenuItem(matchedItem?.url || "home");
  }, [router.asPath, menuItems]);

  useEffect(() => {
    const unsubscribe = getById("app", (appData) => {
      if (appData) {
        setIsUsePayment(appData.isUsePayment);
      }
    });
    return () => unsubscribe(); // ✅ หยุดฟังเมื่อ component unmount
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setDialogOpen(false);
  };

  if (status === "loading") return null;

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 w-full">
        <div className="flex justify-between items-center mx-auto">
          {/* Logo */}
          <LogoComponents size={100} />

          {/* Desktop Menu (แสดงเฉพาะจอใหญ่) */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems[0]?.items?.map((item, index) => (
              <Link
                key={index}
                href={item?.url}
                className={`text-lg text-gray-700 hover:text-orange-500 dark:text-gray-50 dark:hover:text-orange-500
                ${
                  item.url === activeMenuItem
                    ? "font-semibold text-orange-500 dark:text-orange-500"
                    : ""
                }
              `}
              >
                <span className="capitalize">{t(item.title)}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Buttons (User, Search, Theme, Lang) */}
          <div className="hidden lg:flex items-center gap-3">
            {!session && (
              <div className="flex gap-2">
                <button
                  className="text-black dark:text-white hover:text-orange-500"
                  onClick={() => router.push("/signin")}
                >
                  Sign In
                </button>
                <span>/</span>
                <button
                  className="text-black dark:text-white hover:text-orange-500"
                  onClick={() => router.push("/register")}
                >
                  Register
                </button>
              </div>
            )}
            <SearchButton size={24} />
            <LangButton />
            {/*{isUsePayment && (
              <Tooltip title={lang["cart"]} placement="bottom">
                <CartButton size={24} />
              </Tooltip>
            )}*/}
            {session && session?.user?.role === "admin" && (
              <Tooltip title={lang["cart"]} placement="bottom">
                <CartButton size={24} />
              </Tooltip>
            )}

            <Tooltip title="Change Theme" placement="bottom">
              <button
                className="text-gray-700 dark:text-gray-50"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <IoMoon size={22} />
                ) : (
                  <IoSunny size={22} />
                )}
              </button>
            </Tooltip>
            <UserButton user={session?.user} size={30} />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden text-gray-700 dark:text-gray-50">
            <div className="flex items-center gap-2">
              <SearchButton size={28} />
              <button
                className="lg:hidden text-gray-700 dark:text-gray-50 ml-2"
                onClick={() => setDialogOpen(true)}
              >
                <IoMenu size={28} />
              </button>
            </div>
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
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 w-full">
              <span className="text-xl font-semibold dark:text-white">
                {lang["menu"]}
              </span>
              <div className="flex items-center gap-2">
                <LangButton />
                <button
                  className="text-gray-700 dark:text-gray-50"
                  onClick={() => setDialogOpen(false)}
                >
                  <IoClose size={28} />
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center px-4 py-2 w-full">
              {!session ? (
                <div className="flex gap-2">
                  <button
                    className="text-black dark:text-white hover:text-orange-500"
                    onClick={() => router.push("/signin")}
                  >
                    Sign In
                  </button>
                  <span>/</span>
                  <button
                    className="text-black dark:text-white hover:text-orange-500"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="flex items-center px-4 py-2 gap-4">
                  <Image
                    src={session?.user?.image || "/default-avatar.png"}
                    alt={session?.user?.name}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="text-md text-gray-700 font-bold dark:text-gray-50">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* รายการเมนู (Mobile) */}
            <div className="p-4 flex flex-col gap-4">
              {menuItems[0]?.items?.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className={`text-lg text-gray-700 dark:text-gray-50 ${
                    item.url === activeMenuItem
                      ? "font-semibold text-orange-500 dark:text-orange-500"
                      : ""
                  }`}
                  onClick={() => setDialogOpen(false)}
                >
                  {t(item.title)}
                </Link>
              ))}

              {session && (
                <div className="">
                  <Divider sx={{ mb: 2 }} />
                  <ul
                    className={`flex flex-col gap-4 text-gray-700 dark:text-gray-50`}
                  >
                    {session?.user?.role === "admin" && (
                      <li
                        onClick={() => {
                          router.push("/admin");
                          setDialogOpen(false);
                        }}
                      >
                        {lang["admin_console"]}
                      </li>
                    )}
                    <li
                      onClick={() => {
                        router.push("/profile");
                        setDialogOpen(false);
                      }}
                    >
                      {lang["profile"]}
                    </li>
                    <li>{lang["history-order"]}</li>
                    <li>{lang["courses"]}</li>
                    <li onClick={handleSignOut}>{lang["signout"]}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Dialog>
      </nav>
    </header>
  );
}

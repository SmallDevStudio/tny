import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/services/firebase";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState("home");
  const router = useRouter();
  const { t, lang } = useLanguage();

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getDocs(collection(db, "menu"));
      setMenuItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const currentPath = router.asPath;

    // ✅ ตรวจสอบว่า currentPath มีค่า `/team/xxx` หรือ `/blog/xxx`
    const matchedMenu = menuItems.find(
      (item) =>
        currentPath === item.url || currentPath.startsWith(item.url + "/")
    );

    setActiveMenuItem(matchedMenu ? matchedMenu.name : "home");
  }, [router.asPath]);

  return (
    <div>
      {menuItems[0]?.items?.map((item, index) => (
        <Link
          key={index}
          href={item.url}
          className={`text-lg text-gray-700 hover:text-orange-500 dark:text-gray-50 dark:hover:text-orange-500
                    ${
                      item.name === activeMenuItem
                        ? "font-semibold text-orange-500 dark:text-orange-500"
                        : ""
                    }
                `}
        >
          {t(item.title)}
        </Link>
      ))}
    </div>
  );
}

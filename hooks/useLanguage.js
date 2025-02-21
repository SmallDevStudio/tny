import { useState, useEffect } from "react";
import th from "@/lang/th.json";
import en from "@/lang/en.json";

const defaultLang = "th";

export default function useLanguage() {
    const [language, setLanguage] = useState(defaultLang);
    const [langData, setLangData] = useState(th); // ค่าเริ่มต้นเป็นภาษาไทย

    // อ็อบเจ็กต์เก็บภาษา
    const languages = { th, en };

    useEffect(() => {
        const storedLang = localStorage.getItem("language") || defaultLang;
        setLanguage(storedLang);
        setLangData(languages[storedLang]); // อัปเดต JSON ตามภาษา
    }, []);

    // เปลี่ยนภาษาและรีโหลดหน้า
    const changeLanguage = (lang) => {
        if (language !== lang) {
            localStorage.setItem("language", lang);
            setLanguage(lang);
            setLangData(languages[lang]);

            // รีโหลดหน้าเว็บ
            setTimeout(() => {
                window.location.reload();
            }, 100); // หน่วงเวลาเล็กน้อยให้ React อัปเดต state
        }
    };

    // ดึงค่าจาก database ที่มี { en: "Welcome", th: "ยินดีต้อนรับ" }
    const getText = (data) => {
        return data?.[language] || data?.[defaultLang] || "";
    };

    return { language, lang: langData || {}, changeLanguage, getText };
}

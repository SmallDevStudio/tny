import { useState, useEffect } from "react";

const defaultLang = "th"; // ตั้งค่าเริ่มต้นเป็นภาษาอังกฤษ

export default function useLanguage() {
    const [language, setLanguage] = useState(defaultLang);

    useEffect(() => {
        const savedLang = localStorage.getItem("language") || defaultLang;
        setLanguage(savedLang);
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return { language, changeLanguage };
}

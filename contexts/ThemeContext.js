import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // ✅ โหลดค่าจาก Cookie หรือใช้ Light Mode เป็นค่าเริ่มต้น
        const savedTheme = Cookies.get("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        Cookies.set("theme", newTheme, { expires: 30 }); // ✅ เก็บ Theme ไว้ใน Cookie 30 วัน
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

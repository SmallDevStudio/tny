import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = Cookies.get("theme") || "light";
        setTheme(savedTheme);
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("bg-gray-800", "text-white");
            document.body.classList.remove("bg-gray-50", "text-black");
        } else {
            document.body.classList.add("bg-white", "text-black");
            document.body.classList.remove("bg-gray-800", "text-white");
        }
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        Cookies.set("theme", newTheme, { expires: 30 });
    };

    const muiTheme = createTheme({
        palette: {
            mode: theme,
            primary: {
                main: '#FFA500',
            },
            background: {
                default: theme === 'dark' ? '#121212' : '#ffffff',
                paper: theme === 'dark' ? '#1E1E1E' : '#ffffff',
            },
            text: {
                primary: theme === 'dark' ? '#ffffff' : '#111111',
            },
        },
    });

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <MUIThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

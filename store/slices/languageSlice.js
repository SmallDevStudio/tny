import { createSlice } from "@reduxjs/toolkit";
import th from "@/lang/th.json";
import en from "@/lang/en.json";

const defaultLang = "th";
const languages = { th, en };

// เช็คว่ากำลังรันบน Client (Browser) หรือไม่
const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("language") || defaultLang;
  }
  return defaultLang;
};

const getInitialLangData = () => {
  if (typeof window !== "undefined") {
    return languages[localStorage.getItem("language")] || languages[defaultLang];
  }
  return languages[defaultLang];
};

const initialState = {
  language: getInitialLanguage(),
  langData: getInitialLangData(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload;
      state.langData = languages[action.payload];

      if (typeof window !== "undefined") {
        localStorage.setItem("language", action.payload);
        window.location.reload(); // รีโหลดเพื่ออัปเดตเนื้อหา
      }
    },
  },
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;

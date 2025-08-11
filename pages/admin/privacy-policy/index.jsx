import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import useDB from "@/hooks/useDB";

export default function PrivacyPolicy() {
  const [privacy, setPrivacy] = useState({
    th: "",
    en: "",
  });
  const [language, setLanguage] = useState("th");
  const { getAll } = useDB("privacy");

  const { lang, t } = useLanguage();

  useEffect(() => {
    const getPrivacy = async () => {
      const privacy = await getAll();
      setPrivacy(privacy[0]);
    };
    getPrivacy();
  }, []);

  const handleActive = (tab) => {
    setLanguage(tab);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "privacy", language);
      await setDoc(docRef, privacy, { merge: true });
      toast.success(lang["privacy_updated_successfully"]);
    } catch (error) {
      toast.error(lang["privacy_update_failed"]);
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Privacy Policy</h1>
      <div className="mt-4">
        <ul className="flex flex-row list-none gap-2">
          <li
            className={`cursor-pointer border-t border-l border-r rounded-t-xl px-6 pt-2
                ${language === "th" ? "bg-orange-400 text-white" : ""}
                `}
            onClick={() => handleActive("th")}
          >
            {lang["Th"]}
          </li>
          <li
            className={`cursor-pointer border-t border-l border-r rounded-t-xl px-6 pt-2
                ${language === "en" ? "bg-gray-400 text-white" : ""}
                `}
            onClick={() => handleActive("en")}
          >
            {lang["En"]}
          </li>
        </ul>
        {language === "th" && (
          <div className="">
            <textarea
              name="privacy-th"
              className="w-full p-2 border border-gray-300 rounded-b-md outline-none"
              value={privacy.th}
              onChange={(e) => setPrivacy({ ...privacy, th: e.target.value })}
              rows="10"
              placeholder={lang["privacy_placeholder"]}
            />
          </div>
        )}
        {language === "en" && (
          <div className="">
            <textarea
              name="privacy-en"
              className="w-full p-2 border border-orange-300 rounded-b-md outline-none"
              value={privacy.en}
              onChange={(e) => setPrivacy({ ...privacy, en: e.target.value })}
              rows="10"
              placeholder={lang["privacy_placeholder"]}
            />
          </div>
        )}
      </div>
      <div className="flex flex-row justify-center mt-4 gap-4">
        <button
          type="button"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          onClick={handleSave}
        >
          {lang["save"]}
        </button>
      </div>
    </div>
  );
}

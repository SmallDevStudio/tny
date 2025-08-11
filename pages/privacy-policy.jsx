import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";
import useDB from "@/hooks/useDB";
import LogoComponents from "@/components/LogoComponents";
import { Divider } from "@mui/material";

export default function PrivacyPolicy() {
  const [privacyPolicy, setPrivacyPolicy] = useState({});
  const { t, lang } = useLanguage();

  const { getAll } = useDB("privacy");

  useEffect(() => {
    const getPrivacy = async () => {
      const privacy = await getAll();
      setPrivacyPolicy(privacy[0]);
    };
    getPrivacy();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800">
      <Header
        title={lang["privacy-policy"]}
        description={lang["privacy-policy"]}
      />
      <div className="mx-auto max-w-screen-xl mt-10">
        <LogoComponents size={150} />
        <div className="flex flex-col gap-2 mt-4 border p-4 rounded-md shadow-md">
          <h2 className="text-xl lg:text-2xl tracking-tight font-extrabold text-orange-500 dark:text-orange-500">
            {lang["privacy-policy"]}
          </h2>
          <Divider flexItem />
          <p className="text-sm lg:text-md whitespace-pre-line">
            {t(privacyPolicy)}
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";

export default function PrivacyPolicy() {
  const [privacyPolicy, setPrivacyPolicy] = useState({});
  const { locale } = useRouter();
  const { t, lang } = useLanguage();

  return (
    <div>
      <Header
        title={lang["privacy-policy"]}
        description={lang["privacy-policy"]}
      />
      <h1>privacy policy</h1>
    </div>
  );
}

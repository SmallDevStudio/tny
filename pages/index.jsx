import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
import { getSections } from "@/utils/getSections";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";

export default function About() {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsRef = doc(db, "settings", "app_settings");
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const settings = settingsSnap.data();
        if (settings.start_page) {
          router.replace(`/${settings.start_page}`);
        } else {
          router.replace("/home");
        }
      }
    };
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  return <Loading />;
}

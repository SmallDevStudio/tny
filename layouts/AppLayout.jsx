import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import getTemplate from "@/templates";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";

const defaultLang = "th";

export default function AppLayout({ children }) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsRef = doc(db, "settings", "app_settings");
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const settings = settingsSnap.data();
        if (settings.maintenance_mode) {
          router.replace("/error/maintenance");
        }
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchPageData = async () => {
      if (router.isReady) {
        let slug = router.query.slug || "home";
        let fullSlug = Array.isArray(slug) ? slug.join("/") : slug;

        const pageRef = doc(db, "pages", fullSlug);
        const pageSnap = await getDoc(pageRef);

        if (pageSnap.exists()) {
          setPageData(pageSnap.data());
        }
        setLoading(false);
      }
    };

    fetchPageData();
  }, [router.isReady, router.query.slug]);

  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (!lang) {
      localStorage.setItem("language", defaultLang);
    }
  }, []);

  const TemplateComponent = pageData
    ? getTemplate(pageData.template.base, pageData.template.page)
    : null;

  if (loading) return <Loading />;

  return TemplateComponent ? (
    <TemplateComponent {...pageData}>
      <Header />
      {children}
    </TemplateComponent>
  ) : null;
}

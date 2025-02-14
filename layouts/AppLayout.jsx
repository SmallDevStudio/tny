import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import getTemplate from "@/templates";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";

export default function AppLayout({ children }) {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        const fetchPageData = async () => {
          if (router.pathname) {
            const slug = router.query.slug || "home";
            const pageRef = doc(db, "pages", slug);
            const pageSnap = await getDoc(pageRef);
    
            if (pageSnap.exists()) {
              setPageData(pageSnap.data());
              setLoading(false);
            }
          }
        };
    
        fetchPageData();
      }, [router.pathname, router.query.slug]);

      const TemplateComponent = pageData ? getTemplate(pageData.template.base, pageData.template.page) : null;

    if (loading) return <Loading />;
    
    return (
      TemplateComponent ? 
        <TemplateComponent {...pageData}>
          <Header/>
          {children}
        </TemplateComponent>
      : null
    );
}
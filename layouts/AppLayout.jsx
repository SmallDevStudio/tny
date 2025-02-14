import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import getTemplate from "@/templates";
import Header from "@/components/utils/Header";

export default function AppLayout({ children }) {
    const [pageData, setPageData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPageData = async () => {
          if (router.pathname) {
            const slug = router.pathname.replace("/", "") || "home";
            const pageRef = doc(db, "pages", slug);
            const pageSnap = await getDoc(pageRef);
    
            if (pageSnap.exists()) {
              setPageData(pageSnap.data());
            }
          }
        };
    
        fetchPageData();
      }, [router.pathname]);

      const TemplateComponent = pageData ? getTemplate(pageData.template.base, pageData.template.page) : null;

    return (
        <div>
            <Header title={pageData?.title || ""} />
            {TemplateComponent ? <TemplateComponent {...pageData} /> : null}
            {children}
        </div>
    )
}
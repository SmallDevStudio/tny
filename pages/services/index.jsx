import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
import { getSections } from "@/utils/getSections";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";

export default function Services() {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState({});
  const [sections, setSections] = useState([]);
  const router = useRouter();
  const pathname = router.pathname.replace("/", "");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const pageRef = doc(db, "pages", pathname);
        const pageSnap = await getDoc(pageRef);

        if (pageSnap.exists()) {
          const data = pageSnap.data();
          setPageData(data);

          const mappedSections = getSections(data.sections || []);

          setSections(mappedSections);
        } else {
          console.error(`Page with slug "${pathname}" not found.`);
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  if (loading) return <Loading />;

  console.log("sections", sections);
  console.log("pageData", pageData);

  return (
    <div>
      <Header title={pageData.title} description={pageData.description} />
      {sections.length > 0
        ? sections.map((section) => (
            <div key={section.id}>
              {section.component ? (
                <section.component />
              ) : (
                <p>⚠️ ไม่มี Component</p>
              )}
            </div>
          ))
        : null}
    </div>
  );
}

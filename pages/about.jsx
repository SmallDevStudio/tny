import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
import { getSections } from "@/utils/getSections";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function About() {
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

          console.log("🔥 Data from Firebase:", data.sections);

          const mappedSections = getSections(data.sections || []);

          console.log("✅ Mapped Sections:", mappedSections);

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

  return (
    <div>
      {sections.length === 0 ? (
        <p>ไม่พบ Sections</p>
      ) : (
        sections.map((section) => (
          <div key={section.id}>
            {section.component ? (
              <section.component />
            ) : (
              <p>⚠️ ไม่มี Component</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

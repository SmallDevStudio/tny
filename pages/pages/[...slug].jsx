import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getSections } from "@/utils/getSections";
import ErrorPage from "next/error";
import Header from "@/components/utils/Header";
import useLanguage from "@/hooks/useLanguage";
import Loading from "@/components/utils/Loading";

export default function Pages() {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState({});
  const [sections, setSections] = useState([]);
  const router = useRouter();
  const pathname = router.query.slug?.join("/");

  useEffect(() => {
    if (!pathname) return;

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

  return (
    <div>
      <Header title={t(pageData.title)} description={t(pageData.description)} />
      {sections.length > 0 &&
        sections.map((section) =>
          section?.component ? (
            <div key={section.id} className="group relative transition">
              {/* เฉพาะ admin เท่านั้นถึงจะแสดงปุ่ม Edit */}
              <section.component contentId={section.id} />
            </div>
          ) : null
        )}
    </div>
  );
}

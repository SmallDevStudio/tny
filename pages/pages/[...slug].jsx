import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
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
  const slugArray = router.query.slug;

  useEffect(() => {
    if (!slugArray) return; // wait for router
    const fullSlug = Array.isArray(slugArray) ? slugArray.join("/") : slugArray;
    const pageSlug = `pages/${fullSlug}`; // slug ที่ใช้ใน Firestore
    console.log("pageSlug:", pageSlug);

    const fetchData = async () => {
      setLoading(true);
      try {
        const pageRef = collection(db, "pages");
        const q = query(pageRef, where("slug", "==", pageSlug)); // ✅ ใช้ "slug"
        const snap = await getDocs(q);

        if (!snap.empty) {
          const doc = snap.docs[0];
          const data = doc.data();
          setPageData(data);

          const mappedSections = getSections(data.sections || []);
          setSections(mappedSections);
        } else {
          console.warn("ไม่พบหน้า:", pageSlug);
          setPageData(null);
        }
      } catch (err) {
        console.error("Error loading page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slugArray]);

  if (loading) return <Loading />;
  if (!pageData) return <ErrorPage statusCode={404} />;

  return (
    <div>
      <Header
        title={t(pageData.title || "")}
        description={t(pageData.description || "")}
      />
      {sections.length > 0 &&
        sections.map((section) =>
          section?.component ? (
            <div key={section.id} className="group relative transition">
              <section.component contentId={section.id} />
            </div>
          ) : null
        )}
    </div>
  );
}

// components/pages/DynamicPage.jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";
import { getSections } from "@/utils/getSections";
import useLanguage from "@/hooks/useLanguage";

export default function DynamicPage({ slugPath }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({});
  const [sections, setSections] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageSlug = slugPath.join("/"); // ex: courses/frontend
        const q = query(collection(db, "pages"), where("slug", "==", pageSlug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setPageData(data);
          setSections(getSections(data.sections || []));
        } else {
          router.replace("/error/404");
        }
      } catch (err) {
        console.error("Error loading dynamic page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slugPath]);

  if (loading) return <Loading />;

  return (
    <div>
      <Header title={t(pageData.title)} description={t(pageData.description)} />
      {sections.map((section) =>
        section?.component ? (
          <div key={section.id}>
            <section.component contentId={section.id} />
          </div>
        ) : null
      )}
    </div>
  );
}

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
import dynamic from "next/dynamic";

const CustomErrorPage = dynamic(() => import("@/pages/_error/error"), {
  ssr: false,
});

export default function NewsPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [pageData, setPageData] = useState(null);
  const [sections, setSections] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!slug) return; // wait router ready

    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        if (!Array.isArray(slug)) return;

        let pageData = null;
        let resolvedSections = [];

        if (slug.length === 1) {
          // ✅ /news/the-new-you
          const courseRef = collection(db, "news");
          const q = query(courseRef, where("slug", "==", slug[0]));
          const snap = await getDocs(q);

          if (!snap.empty) {
            pageData = snap.docs[0].data();

            // ดึง sections จาก pages_slug (ตามระบบเดิม)
            const pagesSlugRef = doc(db, "pages_slug", "news");
            const pagesSlugDoc = await getDoc(pagesSlugRef);

            if (pagesSlugDoc.exists()) {
              const slugData = pagesSlugDoc.data();
              if (slugData?.sections) {
                resolvedSections = getSections(slugData.sections);
              }
            }
          } else {
            // ❗ ไม่เจอใน news ลองไปหาใน pages (ใหม่)
            const pagesRef = collection(db, "pages");
            const pageQ = query(
              pagesRef,
              where("slug", "==", `news/${slug[0]}`)
            );
            const pageSnap = await getDocs(pageQ);

            if (!pageSnap.empty) {
              pageData = pageSnap.docs[0].data();

              if (pageData?.sections) {
                resolvedSections = getSections(pageData.sections);
              }
            }
          }
        } else if (slug.length === 2) {
          // ✅ /news/:group/:slug
          const [groupName, newslug] = slug;

          const courseRef = collection(db, "news");
          const q = query(
            courseRef,
            where("group", "==", groupName),
            where("slug", "==", newslug)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            pageData = snap.docs[0].data();

            // ดึง sections จาก pages_slug (ตามระบบเดิม)
            const pagesSlugRef = doc(db, "pages_slug", "news");
            const pagesSlugDoc = await getDoc(pagesSlugRef);

            if (pagesSlugDoc.exists()) {
              const slugData = pagesSlugDoc.data();
              if (slugData?.sections) {
                resolvedSections = getSections(slugData.sections);
              }
            }
          }
        }

        if (!pageData) {
          setNotFound(true);
          return;
        }

        setPageData(pageData);
        setSections(resolvedSections);
      } catch (error) {
        console.error("Error fetching course or page:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (notFound) return <CustomErrorPage statusCode={404} />;

  return (
    <div className="min-h-screen p-4">
      <Header
        title={t(pageData?.name)}
        description={t(pageData?.description)}
      />
      {sections.map((section) => {
        const Component = section.component;
        return (
          Component && (
            <div key={section.id}>
              <Component
                contentId={section.contentId || section.id}
                pageData={pageData}
              />
            </div>
          )
        );
      })}
    </div>
  );
}

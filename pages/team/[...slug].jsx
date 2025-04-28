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

export default function TeamPage() {
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
      try {
        if (!Array.isArray(slug)) return;

        let teamData = null;

        if (slug.length === 1) {
          // ✅ /teams/the-new-you
          const teamRef = collection(db, "teams");
          const q = query(teamRef, where("slug", "==", slug[0]));
          const snap = await getDocs(q);

          if (!snap.empty) {
            teamData = snap.docs[0].data();
          }
        } else if (slug.length === 2) {
          // ✅ /teams/public_teams/the-new-you
          const [groupName, teamSlug] = slug;

          const teamRef = collection(db, "teams");
          const q = query(
            teamRef,
            where("group", "==", groupName),
            where("slug", "==", teamSlug)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            teamData = snap.docs[0].data();
          }
        }

        if (!teamData) {
          setNotFound(true);
          return;
        }

        setPageData(teamData);

        // ดึง sections จาก pages_slug
        const pagesSlugRef = doc(db, "pages_slug", "team");
        const pagesSlugDoc = await getDoc(pagesSlugRef);

        if (pagesSlugDoc.exists()) {
          const slugData = pagesSlugDoc.data();
          if (slugData?.sections) {
            const resolvedSections = getSections(slugData.sections);
            setSections(resolvedSections);
          }
        }
      } catch (error) {
        console.error("Error fetching team:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (notFound) return <ErrorPage statusCode={404} />;

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

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

export default function BlogPage() {
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

        let blogData = null;

        if (slug.length === 1) {
          // ✅ /blogs/the-new-you
          const blogRef = collection(db, "blogs");
          const q = query(blogRef, where("slug", "==", slug[0]));
          const snap = await getDocs(q);

          if (!snap.empty) {
            blogData = snap.docs[0].data();
          }
        } else if (slug.length === 2) {
          // ✅ /blogs/public_blogs/the-new-you
          const [groupName, blogSlug] = slug;

          const blogRef = collection(db, "blogs");
          const q = query(
            blogRef,
            where("group", "==", groupName),
            where("slug", "==", blogSlug)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            blogData = snap.docs[0].data();
          }
        }

        if (!blogData) {
          setNotFound(true);
          return;
        }

        setPageData(blogData);

        // ดึง sections จาก pages_slug
        const pagesSlugRef = doc(db, "pages_slug", "blog");
        const pagesSlugDoc = await getDoc(pagesSlugRef);

        if (pagesSlugDoc.exists()) {
          const slugData = pagesSlugDoc.data();
          if (slugData?.sections) {
            const resolvedSections = getSections(slugData.sections);
            setSections(resolvedSections);
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (notFound) return <ErrorPage statusCode={404} />;

  console.log("sections", sections);

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
              <Component contentId={section.contentId} pageData={pageData} />
            </div>
          )
        );
      })}
    </div>
  );
}

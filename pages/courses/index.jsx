import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { toast } from "react-toastify";
import SearchBar from "@/components/Bar/SearchBar";
import Swal from "sweetalert2";
import { getSections } from "@/utils/getSections";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";

export default function Courses() {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState({});
  const [sections, setSections] = useState([]);
  const { data: session, status } = useSession();
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

import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/router";
import { getSections } from "@/utils/getSections";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";
import { CiEdit } from "react-icons/ci";

export default function DetailSection() {
  const [contents, setContents] = useState({});
  const [language, setLanguage] = useState("th");
  const [editMode, setEditMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState({});
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const router = useRouter();
  const page = router.query.page;
  const { data: session, status } = useSession();

  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!page) return; // รอจนกว่าจะได้ค่าจาก query

    setLoading(true);
    const fetchData = async () => {
      try {
        const pageRef = doc(db, "pages_slug", page);
        const pageSnap = await getDoc(pageRef);

        if (pageSnap.exists()) {
          const data = pageSnap.data();
          setPageData(data);

          const mappedSections = getSections(data.sections || []);
          setSections(mappedSections);
        } else {
          console.error(`Page with slug "${page}" not found.`);
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  if (loading) return <Loading />;

  const handleEdit = (sectionId) => {
    setSelectedSection(sectionId);
    setEditMode(sectionId);
  };

  console.log("sections", sections);
  console.log("pageData", pageData);

  return (
    <div>
      <Header title={t(pageData.title)} description={t(pageData.description)} />
      {/* Header */}
      <div className="flex flex-row items-center justify-center gap-2 w-full bg-gray-200 h-6 p-1 mb-2 dark:bg-gray-700">
        <span className="">Administration Mode</span>
      </div>

      {sections.length > 0 &&
        sections.map((section) => {
          const Component = section.component;
          return (
            Component && (
              <div key={section.id} className="group relative transition">
                <Component
                  contentId={section.contentId || section.id}
                  pageData={pageData}
                  editMode={editMode === section.id}
                  language={language}
                  setLanguage={setLanguage}
                  setEditMode={setEditMode}
                />
              </div>
            )
          );
        })}
    </div>
  );
}

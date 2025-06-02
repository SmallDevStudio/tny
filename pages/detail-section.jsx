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

export default function TestSection() {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [image, setImage] = useState({});
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
        const pageRef = doc(db, "pages", page);
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

  return (
    <div>
      <Header title={t(pageData.title)} description={t(pageData.description)} />
      {/* Header */}
      <div className="flex flex-row items-center justify-center gap-2 w-full bg-gray-200 h-6 p-1 mb-2 dark:bg-gray-700">
        <span className="">Administration Mode</span>
      </div>

      {sections.length > 0 &&
        sections.map((section) =>
          section?.component ? (
            <div key={section.id} className="group relative transition">
              {/* เฉพาะ admin เท่านั้นถึงจะแสดงปุ่ม Edit */}
              {session?.user?.role === "admin" && (
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition">
                  {editMode !== section.id ? (
                    <button
                      onClick={() => handleEdit(section.id)}
                      className="flex p-2 rounded-full border border-gray-700 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      <CiEdit size={20} />
                    </button>
                  ) : (
                    <div className="flex flex-row items-center gap-2 bg-white p-2 rounded shadow-md dark:bg-gray-800">
                      <button
                        className={`px-3 py-1 rounded-md font-bold transition ${
                          language === "th"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        onClick={() => setLanguage("th")}
                      >
                        TH
                      </button>
                      <button
                        className={`px-3 py-1 rounded-md font-bold transition ${
                          language === "en"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        onClick={() => setLanguage("en")}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setEditMode(null)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <section.component
                contentId={section.id}
                editMode={editMode === section.id}
                language={language}
                setLanguage={setLanguage}
                setEditMode={setEditMode}
              />
            </div>
          ) : null
        )}
    </div>
  );
}

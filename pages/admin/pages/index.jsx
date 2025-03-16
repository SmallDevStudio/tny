import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { lang, t } = useLanguage();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pagesRef = collection(db, "pages");
        const snapshot = await getDocs(pagesRef);

        const pagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // ดึงข้อมูลทั้งหมด

        setPages(pagesData);
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  console.log(pages);

  const handleClickAdd = () => {
    router.push("/admin/pages/pageform");
  };

  const handleDeletePage = async (id) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      await deleteDoc(doc(db, "pages", id));
      setPages(pages.filter((page) => page.id !== id));
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{lang["management_pages"]}</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={handleClickAdd}
      >
        {lang["create_page"]}
      </button>
      <ul>
        {pages.map((page) => (
          <li
            key={page.id}
            className="flex justify-between bg-gray-100 p-2 mb-2 rounded-md"
          >
            <span>
              {t(page.title)} ({page.slug})
            </span>
            <div>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded-md mx-2"
                onClick={() => router.push(`/${page.slug}`)}
              >
                View
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => handleDeletePage(page.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

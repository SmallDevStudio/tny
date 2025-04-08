import React, { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
import { Dialog, Slide } from "@mui/material";
import PageForm from "@/components/Pages/PageForm";
import { IoClose } from "react-icons/io5";
import SelectSections from "@/components/Sections/SelectSection";
import Link from "next/link";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [openSections, setOpenSections] = useState(false);
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

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedPage(null);
    setOpenForm(false);
  };

  const handleEditForm = (page) => {
    setSelectedPage(page);
    setOpenForm(true);
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

  const handleOpenSections = (page) => {
    setSelectedPage(page);
    setOpenSections(true);
  };

  const handleCloseSections = () => {
    setSelectedPage(null);
    setOpenSections(false);
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
        onClick={handleOpenForm}
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
                className="bg-blue-500 text-white px-3 py-1 rounded-md mx-2"
                onClick={() => handleEditForm(page)}
              >
                Edit
              </button>
              <button
                className="bg-orange-500 text-white px-3 py-1 rounded-md mx-2"
                onClick={() => handleOpenSections(page)}
              >
                Sections
              </button>
              <Link
                href={`/test-section?page=${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 text-white px-3 py-1 rounded-md mx-2 inline-block text-center"
              >
                Edit Page
              </Link>
              {page.type !== "static" && (
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md mx-2"
                  onClick={() => handleDeletePage(page.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Dialog
        fullScreen
        open={openForm}
        onClose={handleCloseForm}
        TransitionComponent={Transition}
        keepMounted
      >
        <div>
          <div className="flex flex-row p-2 items-center justify-between bg-orange-500 text-white">
            <h2>{lang["create_page"]}</h2>
            <IoClose
              size={25}
              onClick={handleCloseForm}
              className="cursor-pointer"
            />
          </div>
          <PageForm onClose={handleCloseForm} page={selectedPage} />
        </div>
      </Dialog>

      <Dialog
        fullScreen
        open={openSections}
        onClose={handleCloseSections}
        TransitionComponent={Transition}
        keepMounted
      >
        <div>
          <div className="flex flex-row p-2 items-center justify-between bg-orange-500 text-white">
            <h2>{lang["select_section"]}</h2>
            <IoClose
              size={25}
              onClick={handleCloseSections}
              className="cursor-pointer"
            />
          </div>
          <SelectSections
            sections={selectedPage?.sections || []}
            onClose={handleCloseSections}
            page={selectedPage?.slug || "home"}
          />
        </div>
      </Dialog>
    </div>
  );
}

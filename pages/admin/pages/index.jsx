import React, { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
import { Dialog, Slide } from "@mui/material";
import PageForm from "@/components/Pages/PageForm";
import { IoClose } from "react-icons/io5";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [openForm, setOpenForm] = useState(false);
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

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

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
            </div>
          </li>
        ))}
      </ul>
      <Dialog
        fullScreen
        open={openForm}
        onClose={handleCloseForm}
        Transition={Transition}
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
          <PageForm onClose={handleCloseForm} />
        </div>
      </Dialog>
    </div>
  );
}

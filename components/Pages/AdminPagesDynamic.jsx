import React, { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
import { Dialog, Slide, Divider } from "@mui/material";
import { IoClose } from "react-icons/io5";
import SectionDynamic from "./SectionDynamic";
import Link from "next/link";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminPagesDynamic() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [openSections, setOpenSections] = useState(false);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { lang, t } = useLanguage();

  useEffect(() => {
    const pagesRef = collection(db, "pages");
    const pageSlugRef = collection(db, "pages_slug");

    const fetchData = async () => {
      try {
        const [pagesSnap, pageSlugSnap] = await Promise.all([
          getDocs(pagesRef),
          getDocs(pageSlugRef),
        ]);

        // ✅ 1. เตรียม Pages ที่ multiple === true
        const pagesData = pagesSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((page) => page.multiple === true);

        // ✅ 2. เตรียม Pages_slug ทั้งหมด
        const pageSlugData = pageSlugSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ✅ 3. รวมข้อมูลจาก pages + pages_slug
        const combinedData = pagesData.map((page) => {
          const matchedPageSlug = pageSlugData.find(
            (slug) => slug.page === page.slug
          );

          return {
            title: page.title,
            slug: page.slug,
            sections: matchedPageSlug?.sections || [],
          };
        });

        setPages(combinedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenSections = (page) => {
    setSelectedPage(page);
    setSections(page.sections);
    setOpenSections(true);
  };

  const handleCloseSections = () => {
    setSelectedPage(null);
    setSections([]);
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
      <button className="bg-orange-500 text-white px-3 py-1 rounded-md mb-4">
        Group Managements
      </button>
      <Divider sx={{ mb: 2, mt: 2 }} />
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
                onClick={() => handleOpenSections(page)}
                className="bg-orange-500 text-white px-3 py-1 rounded-md mx-2"
              >
                Sections
              </button>
              <Link
                href={`/admin-section?page=${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 text-white px-3 py-1 rounded-md mx-2 inline-block text-center"
              >
                Edit Page
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <Dialog
        fullScreen
        open={openSections}
        onClose={handleCloseSections}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          "& .MuiDialog-paper": {
            zIndex: 99,
          },
        }}
      >
        <div className="flex flex-col h-screen">
          <div className="flex flex-row items-center justify-between p-4 bg-orange-500">
            <span className="text-white font-bold">Section Select</span>
            <IoClose
              className="text-white"
              size={24}
              onClick={handleCloseSections}
            />
          </div>
          <SectionDynamic
            page={selectedPage}
            sections={sections}
            onClose={handleCloseSections}
          />
        </div>
      </Dialog>
    </div>
  );
}

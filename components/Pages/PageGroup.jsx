import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Menu, MenuItem, Tooltip, Divider } from "@mui/material";
import { toast } from "react-toastify";
import UploadImage from "../btn/UploadImage";
import useLanguage from "@/hooks/useLanguage";
import { db } from "@/services/firebase";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function PageGroup({ page, onClose }) {
  const [pageGroup, setPageGroup] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [optionsPage, setOptionsPage] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: { en: "", th: "" },
    description: { en: "", th: "" },
    slug: "",
    sections: [],
    type: "page_dynamic",
  });

  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.userId;
  const { t, lang } = useLanguage();

  useEffect(() => {
    const pagesRef = collection(db, "pages");

    const fetchData = async () => {
      const q = query(pagesRef, where("multiple", "==", true));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPageGroup(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      const optionsRef = collection(db, "options");
      const q = query(optionsRef, where("page", "==", selectedPage));
      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOptionsPage(data);
      });
      return unsubscribe;
    }
  }, [selectedPage]);

  useEffect(() => {
    if (!page && form.title.en !== "") {
      const newSlug = generateSlug(form.title.en);
      setForm((prev) => ({
        ...prev,
        slug: `${selectedPage}/${newSlug}`,
        name: newSlug,
      }));
    }
  }, [form?.title?.en]);

  useEffect(() => {
    if (page) {
      setForm({
        name: page.name,
        title: { en: page.title.en, th: page.title.th },
        description: { en: page.description.en, th: page.description.th },
        slug: page.slug,
        sections: page.sections,
        type: page.type,
      });
      setSelectedPage(page.page);
      setIsEdit(true);
    } else {
      setForm({
        name: "",
        title: { en: "", th: "" },
        description: { en: "", th: "" },
        slug: "",
        sections: [],
        type: "page_dynamic",
      });
      setSelectedPage("");
      setIsEdit(false);
    }
  }, [page]);

  // ฟังก์ชันสร้าง `slug`
  const generateSlug = (text) => {
    const raw = typeof text === "string" ? text : text?.en || text?.th || "";
    return raw
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // ลบอักขระพิเศษ
      .replace(/\s+/g, "-"); // แปลงช่องว่างเป็น `-`
  };

  const handleSubmit = async () => {
    const newData = {
      ...form,
      page: selectedPage,
    };
    const newOptions = {
      name: {
        en: form.title.en,
        th: form.title.th,
      },
      page: selectedPage,
      type: "group",
      value: form.name,
      active: true,
    };

    try {
      if (isEdit) {
        newData.updated_at = new Date().toISOString();
        newData.updated_by = userId;
        await updateDoc(doc(db, "pages", page.id), newData);
        await setDoc(doc(db, "options", page.id), newOptions);
      } else {
        newData.created_at = new Date().toISOString();
        newData.created_by = userId;
        await setDoc(doc(db, "pages", form.slug), newData);
        await setDoc(doc(db, "options", form.slug), newOptions);
      }
      toast.success(lang["page_updated_successfully"] || "อัปเดตหน้าเรียบร้อย");
      handleClear();
      onClose();
    } catch (error) {
      console.error("Error updating page:", error);
      toast.error(lang["something_went_wrong"]);
    }
  };

  const handleDelete = async (slug) => {};

  const handleClear = () => {
    setForm({
      name: "",
      title: { en: "", th: "" },
      description: { en: "", th: "" },
      slug: "",
      sections: [],
      type: "page_dynamic",
    });
    setOpenForm(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex flex-row items-center justify-between bg-orange-500 text-white p-4">
        <div className="flex items-center gap-2">
          <IoIosArrowBack size={20} />
          <h2>{lang["create_page"]}</h2>
        </div>
        <IoClose size={20} onClick={onClose} />
      </div>
      {/* Form */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="select_page" className="font-bold">
            {lang["select_page"]}:
          </label>
          <select
            name="select_page"
            id="select_page"
            className="border border-gray-200 p-1 text-sm rounded-md bg-white"
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
          >
            <option value="">{lang["select_page"]}</option>
            {pageGroup.map((item) => (
              <option value={item.slug}>{t(item.title)}</option>
            ))}
          </select>
        </div>
        <Divider sx={{ my: 2 }} />
        {/* Options */}
        {selectedPage && optionsPage.length > 0 && (
          <>
            <div className="flex flex-col mt-2 w-1/4 gap-1">
              {optionsPage.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer"
                >
                  <span>{t(item.name)}</span>
                  <Tooltip title={lang["delete"]} placement="top">
                    <div className="bg-red-500 text-white hover:bg-red-700 rounded-full p-1 w-6 h-6 flex items-center justify-center cursor-pointer">
                      <IoClose />
                    </div>
                  </Tooltip>
                </div>
              ))}
            </div>
            <Divider sx={{ my: 2 }} />
          </>
        )}
        {selectedPage && (
          <div
            className="flex items-center gap-2 mt-4 p-2 hover:bg-gray-200 rounded-md cursor-pointer w-1/6"
            onClick={() => (openForm ? handleClear() : setOpenForm(true))}
          >
            {openForm ? (
              <FaCircleMinus size={20} className="text-orange-500" />
            ) : (
              <FaCirclePlus size={20} className="text-orange-500" />
            )}
            <span className="font-bold">{lang["create_page"]}</span>
          </div>
        )}

        {/* Options Form */}
        {openForm && (
          <div className="flex flex-col mt-5 gap-2 w-1/2 border border-gray-200 p-4 rounded-xl shadow-lg">
            <div className="flex flex-row items-center gap-2 w-full">
              <label htmlFor="title" className="font-bold w-56">
                {lang["title"]}:<span className="text-red-500">*</span>
              </label>
              <div className="flex flex-row items-center gap-2 w-full">
                <label htmlFor="title.th">TH:</label>
                <input
                  type="text"
                  name="title.th"
                  id="title.th"
                  className="border border-gray-200 p-1 text-sm rounded-md bg-white w-full"
                  value={form?.title?.th}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: { ...form.title, th: e.target.value },
                    })
                  }
                />
              </div>
              <div className="flex flex-row items-center gap-2 w-full">
                <label htmlFor="title.en">EN:</label>
                <input
                  type="text"
                  name="title.en"
                  id="title.en"
                  className="border border-gray-200 p-1 text-sm rounded-md bg-white w-full"
                  value={form?.title?.en}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: { ...form.title, en: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex flex-row gap-2 w-full">
              <label htmlFor="description" className="font-bold w-56">
                {lang["description"]}:
              </label>
              <div className="flex flex-row gap-2 w-full">
                <label htmlFor="description.th">TH:</label>
                <textarea
                  type="text"
                  name="description.th"
                  id="description.th"
                  className="border border-gray-200 p-1 text-sm rounded-md bg-white w-full"
                  value={form?.description?.th}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: { ...form.description, th: e.target.value },
                    })
                  }
                />
              </div>
              <div className="flex flex-row gap-2 w-full">
                <label htmlFor="description.en">EN:</label>
                <textarea
                  type="text"
                  name="description.en"
                  id="description.en"
                  className="border border-gray-200 p-1 text-sm rounded-md bg-white w-full"
                  value={form?.description?.en}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: { ...form.description, en: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-2 mt-4">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                onClick={handleSubmit}
              >
                <span>{lang["save"]}</span>
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleClear}
              >
                <span>{lang["cancel"]}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

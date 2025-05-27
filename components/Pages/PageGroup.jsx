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
  addDoc,
} from "firebase/firestore";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";

export default function PageGroup({ page, onClose, data }) {
  const [pageGroup, setPageGroup] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [optionsPage, setOptionsPage] = useState([]);
  const [selectOption, setSelectOption] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: { en: "", th: "" },
    description: { en: "", th: "" },
    slug: "",
    sections: [],
    type: "dynamic_page",
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
    if (!page && form.title?.en !== "") {
      const newSlug = generateSlug(form.title?.en);
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
        type: "dynamic_page",
      });
      setSelectedPage(page.page);
      setSelectOption(page.value);
      setOpenForm(true);
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

  useEffect(() => {
    if (selectOption) {
      const slug = `${selectedPage}/${selectOption}`;
      const pageRef = collection(db, "pages");
      const q = query(pageRef, where("slug", "==", slug));
      const unsubscribe = onSnapshot(q, (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setForm({
          name: data[0]?.name,
          title: { en: data[0]?.title.en, th: data[0]?.title.th },
          description: {
            en: data[0]?.description.en,
            th: data[0]?.description.th,
          },
          slug: data[0]?.slug,
          sections: data[0]?.sections,
          type: "dynamic_page",
        });
        setSelectedPage(data[0]?.page);
      });
      return unsubscribe;
    }
  }, [selectOption]);

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
      name: form.name,
      title: { en: form.title.en, th: form.title.th },
      description: { en: form.description.en, th: form.description.th },
      page: selectedPage,
      sections: form.sections,
      slug: form.slug,
      type: form.type,
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
        await addDoc(collection(db, "pages"), newData);
        await addDoc(collection(db, "options"), newOptions);
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
    setIsEdit(false);
    setSelectedPage("");
    setSelectOption(null);
  };

  const handleEdit = (page) => {
    setIsEdit(true);
    setOpenForm(true);
    setSelectOption(page.value);
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex flex-row items-center justify-between bg-orange-500 text-white p-4">
        <div className="flex items-center gap-2">
          <IoIosArrowBack
            size={20}
            onClick={handleClose}
            className="cursor-pointer"
          />
          <h2>{lang["create_page"]}</h2>
        </div>
        <IoClose size={20} onClick={handleClose} className="cursor-pointer" />
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
        {selectedPage && (
          <button
            onClick={() => setOpenForm(true)}
            className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600"
          >
            {lang["add_group"]}
          </button>
        )}
        {selectedPage && optionsPage.length > 0 && (
          <>
            <div className="flex flex-col mt-2 w-1/4 gap-1">
              {optionsPage.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-200 p-2 rounded-md hover:bg-gray-300 cursor-pointer"
                >
                  <span>{t(item.name)}</span>
                  <div className="flex items-center gap-2">
                    <Tooltip title={lang["edit"]} placement="top">
                      <FaEdit
                        size={25}
                        className="text-orange-500 hover:text-orange-600 cursor-pointer"
                        onClick={() => handleEdit(item)}
                      />
                    </Tooltip>
                    <Tooltip title={lang["delete"]} placement="top">
                      <div className="bg-red-500 text-white hover:bg-red-700 rounded-full p-1 w-6 h-6 flex items-center justify-center cursor-pointer">
                        <IoClose />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {openForm && (
          <div className="flex flex-col p-4 mt-5">
            <div className="flex flex-col gap-2 bg-gray-100 p-4 border rounded-lg shadow-md">
              <h3>{isEdit ? lang["edit_group"] : lang["add_group"]}</h3>
              <div>
                <label htmlFor="name">{lang["name"]}:</label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border border-gray-200 p-1 text-sm rounded-md bg-white w-full"
                  placeholder="Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="title">{lang["title"]}:</label>
                <div className="flex flex-row items-center gap-2">
                  <span>TH:</span>
                  <input
                    type="text"
                    id="title.th"
                    value={form.title?.th}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: { ...form.title, th: e.target.value },
                      })
                    }
                    className="border border-gray-200 p-1 text-sm rounded-md bg-white w-full"
                    placeholder="Title TH"
                  />
                  <span>EN:</span>
                  <input
                    type="text"
                    id="title.en"
                    value={form.title?.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: { ...form.title, en: e.target.value },
                      })
                    }
                    className="border border-gray-200 p-1 text-sm rounded-md bg-white w-full"
                    placeholder="Title EN"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description">{lang["description"]}:</label>
                <div className="flex flex-row gap-2">
                  <span>TH:</span>
                  <textarea
                    type="text"
                    id="description.th"
                    value={form.description?.th}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: {
                          ...form.description,
                          th: e.target.value,
                        },
                      })
                    }
                    className="border border-gray-200 p-1 text-sm rounded-md bg-white w-full"
                    placeholder="Description TH"
                    rows={4}
                  />
                  <span>EN:</span>
                  <textarea
                    type="text"
                    id="description.en"
                    value={form.description?.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: {
                          ...form.description,
                          en: e.target.value,
                        },
                      })
                    }
                    className="border border-gray-200 p-1 text-sm rounded-md bg-white w-full"
                    placeholder="Description EN"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-center gap-4 mt-4">
                <button
                  type="button"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                  onClick={handleSubmit}
                >
                  {lang["save"]}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={handleClear}
                >
                  {lang["cancel"]}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

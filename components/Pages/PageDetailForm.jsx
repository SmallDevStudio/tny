import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import UploadImage from "../btn/UploadImage";
import OpenLibrary from "../btn/OpenLibrary";
import useLanguage from "@/hooks/useLanguage";
import { db } from "@/services/firebase";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function PageDetailForm({ page, onClose }) {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({
    name: "",
    title: { en: "", th: "" },
    description: { en: "", th: "" },
    slug: "",
  });
  const [isSlugEdited, setIsSlugEdited] = useState(false); // ตรวจสอบว่าแก้ไข slug เองหรือไม่
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);
  const userId = session?.user?.userId;

  const { lang } = useLanguage();

  // เมื่อ `name.en` เปลี่ยนแปลง ให้สร้าง `slug` อัตโนมัติ เว้นแต่เคยแก้ไขแล้ว
  useEffect(() => {
    if (!page && form.name !== "") {
      const newSlug = generateSlug(form.name);
      setForm((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [form?.name]);

  useEffect(() => {
    if (page) {
      setForm({
        name: page.name,
        title: page.title,
        description: page.description,
        slug: page.slug,
      });
      setSections(page.sections || []);
      setIsEditing(true);
    }
  }, [page]);

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  // ฟังก์ชันสร้าง `slug`
  const generateSlug = (text) => {
    const raw = typeof text === "string" ? text : text?.en || text?.th || "";
    return raw
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // ลบอักขระพิเศษ
      .replace(/\s+/g, "-"); // แปลงช่องว่างเป็น `-`
  };

  // อัปเดตค่า `form` และตรวจสอบว่าแก้ไข `slug` หรือไม่
  const handleChange = (field, lang, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleSlugChange = (value) => {
    setIsSlugEdited(true); // บอกว่าผู้ใช้แก้ไข slug แล้ว
    setForm((prev) => ({ ...prev, slug: value }));
  };

  const handleSubmitPage = async () => {
    if (!form.slug) {
      setError(lang["slug_required"]);
      toast.error(lang["slug_required"]);
      return;
    }

    const pageRef = doc(db, "pages", form.slug);

    // ✅ ถ้าเป็นการอัปเดต
    if (page && isEditing) {
      const data = {
        ...form,
        sections: sections || [],
        content: "",
        page: page.page,
        type: "dynamic_page",
        template: { base: "default", page: "page" },
        updatedAt: new Date(),
      };

      try {
        await setDoc(pageRef, data, { merge: true }); // ✅ merge คือ update
        toast.success(
          lang["page_updated_successfully"] || "อัปเดตหน้าเรียบร้อย"
        );
        handleClearForm();
        router.push("/admin/pages");
      } catch (error) {
        console.error("Error updating page:", error);
        toast.error(lang["something_went_wrong"]);
      }

      return;
    }

    // ✅ ถ้าเป็นการสร้างใหม่
    const pageSnap = await getDoc(pageRef);
    if (pageSnap.exists()) {
      setError(lang["slug_already_exists"]);
      toast.error(lang["slug_already_exists"]);
      return;
    }

    const data = {
      ...form,
      sections: [],
      content: "",
      template: { base: "default", page: "page" },
      creator: userId,
      type: "page",
      createdAt: new Date(),
    };

    try {
      await setDoc(pageRef, data);
      toast.success(lang["page_added_successfully"]);
      handleClearForm();
      onClose();
    } catch (error) {
      console.error("Error adding page:", error);
      toast.error(lang["something_went_wrong"]);
    }
  };

  const handleClearForm = () => {
    setForm({
      name: { en: "", th: "" },
      title: { en: "", th: "" },
      description: { en: "", th: "" },
      slug: "",
    });
    setFiles(null);
    setSections([]);
    setError(null);
    setIsEditing(false);
    onClose();
  };

  const handleRemoveCover = () => {
    setFiles(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          {page ? lang["edit_page"] : lang["add_page"]}
        </h2>
        {/* form */}
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["name"]} <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_name"]})
              </span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["name_write"]}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="slug"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["slug"]} <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_slug"]})
              </span>
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500
                                    ${error ? "border-red-500" : ""}`}
              placeholder={lang["slug_write"]}
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {error}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["title"]} <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_title"]})
              </span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={form?.title?.th}
              onChange={(e) => handleChange("title", "th", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["title_write"] + " (Thai)"}
              required
            />
            <input
              type="text"
              name="title"
              id="title"
              value={form?.title?.en}
              onChange={(e) => handleChange("title", "en", e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["title_write"] + " (English)"}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["description"]}
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_description"]})
              </span>
            </label>
            <textarea
              type="text"
              name="description"
              id="description"
              value={form?.description.th}
              onChange={(e) =>
                handleChange("description", "th", e.target.value)
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["description_write"] + " (Thai)"}
              rows={4}
            />
            <textarea
              type="text"
              name="description"
              id="description"
              value={form?.description.en}
              onChange={(e) =>
                handleChange("description", "en", e.target.value)
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={lang["description_write"] + " (English)"}
              rows={4}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="cover"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              {lang["cover"]} <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-2 text-xs">
                ({lang["exam_cover"]})
              </span>
            </label>
            {files && (
              <div className="flex flex-col w-full mb-2">
                <div className="relative">
                  <Image
                    src={files.url}
                    width={1000}
                    height={1000}
                    alt="Cover"
                    className="w-full h-auto rounded-lg"
                    priority
                  />
                  <Tooltip
                    title={lang["remove-image"]}
                    placement="bottom"
                    arrow
                  >
                    <button
                      type="button"
                      className="absolute top-0 right-0 m-2 p-1 text-white bg-red-500 rounded-full hover:bg-red-600"
                      onClick={() => handleRemoveCover()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                </div>
                <span className="text-sm mt-2">
                  <strong className="mr-2 text-orange-500">File Name:</strong>{" "}
                  {files.file_name}
                </span>
              </div>
            )}
            <OpenLibrary onUpload={setFiles} folder="cover" size={24} />
          </div>
        </div>

        <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            type="submit"
            className="text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleSubmitPage}
          >
            {isEditing ? lang["update"] : lang["save"]}
          </button>
          <button
            type="button"
            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleClearForm}
          >
            {lang["cancel"]}
          </button>
        </div>
      </div>
    </div>
  );
}

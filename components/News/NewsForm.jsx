import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Tooltip } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "../btn/UploadImage";
import { deleteFile } from "@/hooks/useStorage";
import SelectForm from "@/components/Selected/SelectForm";
import Loading from "../utils/Loading";
import Tags from "../Input/Tags";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
import { nanoid } from "nanoid";

const TiptapEditor = dynamic(() => import("@/components/Tiptap/TiptapEditor"), {
  ssr: false,
});

const TypeData = [
  { label: { th: "ข่าวประชาสัมพันธ์", en: "News" }, value: "news" },
  { label: { th: "ป๊อปอัพ", en: "PopUp" }, value: "popup" },
  { label: { th: "ประกาศ", en: "Announcement" }, value: "announcement" },
];

export default function NewsForm({ onClose, news, isNewNews }) {
  const { t, lang } = useLanguage();
  const { data: session } = useSession();
  const userId = session?.user?.userId;
  const [form, setForm] = useState({
    name: { th: "", en: "" },
    description: { th: "", en: "" },
    group: "",
    subgroup: "",
    type: "news",
  });
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState(null);
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (news) {
      setForm({
        name: news.name || { th: "", en: "" },
        description: news.description || { th: "", en: "" },
        group: news.group || "",
        subgroup: news.subgroup || "",
        type: news.type || "news",
      });
      setCover(news.cover || null);
      setTags(news.tags || []);
      setContent(news.content);
    } else if (isNewNews) {
      setTags([]);
    }
  }, [news]);

  const handleClear = () => {
    setForm({
      name: { th: "", en: "" },
      description: { th: "", en: "" },
      group: "",
      subgroup: "",
      type: "news",
    });
    setTags([]);
    setCover(null);
    onClose();
  };

  const handleCover = (file) => {
    setCover(file[0]);
  };

  const handleRemoveCover = () => {
    deleteFile(cover.file_id);
    setCover(null);
  };

  const generateSlug = (text) => {
    const raw = typeof text === "string" ? text : text?.en || text?.th || "";
    return raw
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // ลบอักขระพิเศษ
      .replace(/\s+/g, "-"); // แปลงช่องว่างเป็น `-`
  };

  console.log("form", form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newId = nanoid(15);
      const data = {
        name: { th: form.name.th, en: form.name.en },
        description: { th: form.description.th, en: form.description.en },
        cover: cover ? cover : null,
        group: form.group,
        subgroup: form.subgroup,
        tags: tags,
        content: content,
        type: form.type,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "",
        updated_by: "",
        slug: generateSlug(form.name.en),
      };

      console.log(data);

      const docRef = doc(db, "news", news ? news.id : newId.toString());
      const docSnap = await getDoc(docRef);

      if (isNewNews) {
        data.id = newId;
        data.created_by = userId;
        await setDoc(doc(db, "news", data.id), data);
        toast.success(lang["news_added_successfully"]);
      } else {
        data.updated_at = new Date().toISOString();
        data.updated_by = userId;
        await updateDoc(docRef, data);
        toast.success(lang["news_updated_successfully"]);
      }
      handleClear();
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error(lang["error_occured"]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white dark:bg-gray-800 w-full h-full rounded-lg shadow-lg">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row px-4 py-2 items-center justify-between bg-orange-500 w-full">
          <h1 className="text-2xl font-semibold text-white">
            {news ? lang["edit_news"] : lang["create_news"]}
          </h1>
          <Tooltip title={lang["close"]} placement="bottom">
            <button
              type="button"
              className="text-white bg-transparent hover:bg-orange-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              onClick={onClose}
            >
              <IoClose size={22} />
            </button>
          </Tooltip>
        </div>
        <div className="flex flex-col p-4 gap-2">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["image"]}
              </label>
              {/* Image */}
              {cover && (
                <div className="relative w-full h-[200px] rounded-lg">
                  <Image
                    src={cover?.url}
                    alt="mockup"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                  <div className="absolute top-0 right-1">
                    <Tooltip title={lang["remove"]} arrow>
                      <button
                        type="button"
                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => handleRemoveCover()}
                      >
                        <IoClose size={10} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}
              <UploadImage
                onUpload={(file) => handleCover(file)}
                folder="newss"
                size={20}
                userId={userId}
              />
            </div>
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              {lang["name"]}
            </label>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <input
                type="text"
                id="name.th"
                name="name.th"
                value={form?.name?.th}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: { ...form.name, th: e.target.value },
                  })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["name_placeholder"] + " (th)"}
                required
              />

              <input
                type="text"
                id="name.en"
                name="name.en"
                value={form?.name?.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: { ...form.name, en: e.target.value },
                  })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["name_placeholder"] + " (en)"}
                required
              />
            </div>
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              {lang["description"]}
            </label>
            <div className="grid grid-cols-1 gap-1 lg:grid-cols-2">
              <textarea
                type="text"
                id="description.th"
                name="description.th"
                value={form?.description?.th}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: { ...form.description, th: e.target.value },
                  })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["description_placeholder"] + " (th)"}
                rows={4}
              />

              <textarea
                type="text"
                id="description.en"
                name="description.en"
                value={form?.description?.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: { ...form.description, en: e.target.value },
                  })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["description_placeholder"] + " (en)"}
                rows={4}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["group"]}
              </label>
              <SelectForm
                type={"group"}
                page={"news"}
                value={form.group}
                setValue={(value) => setForm({ ...form, group: value })}
              />
            </div>

            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["subgroup"]}
              </label>
              <SelectForm
                type={"subgroup"}
                page={"news"}
                value={form.subgroup}
                setValue={(value) => setForm({ ...form, subgroup: value })}
              />
            </div>

            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["type_news"]}
              </label>
              <select
                name="type"
                id="type"
                value={form.type}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                defaultValue={"news"}
              >
                {TypeData.map((item, index) => (
                  <option key={index} value={item.value}>
                    {t(item.label)} {/* ใช้ตามภาษา */}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="Tages"
              className="block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {lang["tags"]}
            </label>
            <Tags tags={tags} setTags={setTags} />
          </div>
        </div>
        <div className="px-4">
          <label htmlFor="content">{lang["content"]}</label>
          <TiptapEditor
            content={content}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2 p-4 w-full">
          <button
            type="submit"
            className="w-56 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg"
            onClick={handleSubmit}
          >
            {lang["save"]}
          </button>

          <button
            type="button"
            className="w-56 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
            onClick={handleClear}
          >
            {lang["cancel"]}
          </button>
        </div>
      </div>
    </div>
  );
}

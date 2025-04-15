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
import FormatCode from "../Input/FormatCode";
import { updateLastNumber } from "@/utils/getFormattedCode";
import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import dynamic from "next/dynamic";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import th from "date-fns/locale/th";
registerLocale("th", th);
import { CiCalendar } from "react-icons/ci";

const TiptapEditor = dynamic(() => import("@/components/Tiptap/TiptapEditor"), {
  ssr: false,
});

export default function CoursesForm({ onClose, course, isNewCourse }) {
  const { lang } = useLanguage();
  const { data: session } = useSession();
  const userId = session?.user?.userId;
  const [form, setForm] = useState({
    name: { th: "", en: "" },
    description: { th: "", en: "" },
    cover: "",
    start_date: new Date(),
    end_date: new Date(),
    group: "",
    subgroup: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState(null);
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [code, setCode] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (course) {
      setForm({
        name: course.name || { th: "", en: "" },
        description: course.description || { th: "", en: "" },
        cover: course.cover || {},
        start_date: course.start_date || new Date(),
        end_date: course.end_date || new Date(),
        group: course.group || "",
        subgroup: course.subgroup || "",
        price: course.price || "",
      });
      setImage(course.image || {});
      setTags(course.tags || []);
      setCode({
        docEntry: course.docEntry,
        code: course.code,
      });
      setContent(course.content);
    } else if (isNewCourse) {
      setTags([]);
    }
  }, [course]);

  const generateUniqueDocEntry = async (baseId) => {
    let newId = baseId;
    let docRef = doc(db, "courses", newId.toString());
    let docSnap = await getDoc(docRef);

    while (docSnap.exists()) {
      newId += 1;
      docRef = doc(db, "courses", newId.toString());
      docSnap = await getDoc(docRef);
    }

    return newId;
  };

  const handleClear = () => {
    setForm({
      name: { th: "", en: "" },
      description: { th: "", en: "" },
      start_date: new Date(),
      end_date: new Date(),
      group: "",
      subgroup: "",
      price: "",
    });
    setTags([]);
    setCode(null);
    setCover(null);
    setImage({});
    onClose();
  };

  const handleUploadImage = (file) => {
    setImage(file[0]);
  };

  const handleRemoveImage = (image) => {
    deleteFile(image.file_id);
    setThumbnail(null);
  };

  const generateSlug = (text) => {
    return text
      ?.trim()
      .toLowerCase()
      .replace(/[\s]+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newId = code?.docEntry
        ? code.docEntry
        : await generateUniqueDocEntry(1); // กำหนดค่าเริ่มต้นที่ 1 ถ้าไม่มี id

      const slug = generateSlug(form.name.en);

      const pageSlug = form.group
        ? form.subgroup
          ? `courses/${form.group}/${form.subgroup}/${slug}`
          : `courses/${form.group}/${slug}`
        : `courses/${slug}`;

      const data = {
        id: newId,
        code: code ? code.code : null,
        docEntry: newId,
        name: { th: form.name.th, en: form.name.en },
        description: { th: form.description.th, en: form.description.en },
        image: image ? image : {},
        start_date: form.start_date ? form.start_date.toISOString() : null,
        end_date: form.end_date ? form.end_date.toISOString() : null,
        group: form.group,
        subgroup: form.subgroup,
        price: form.price,
        tags: tags,
        content: content,
        active: true,
        slug: slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "",
        updated_by: "",
      };

      const pageData = {
        name: form.name.en,
        description: form.description.en,
        slug: pageSlug,
        type: "page_detail",
        template: { base: "default", page: "course_detail" },
        sections: [],
        courseId: newId.toString(), // ใช้สำหรับเชื่อมกับ course
        updated_at: new Date(),
      };

      const docRef = doc(db, "courses", newId.toString());
      const docSnap = await getDoc(docRef);

      if (isNewCourse) {
        if (docSnap.exists()) {
          newId = await generateUniqueDocEntry(newId);
          data.id = newId;
          data.docEntry = newId;
        }
        data.created_by = userId;
        await setDoc(doc(db, "courses", newId.toString()), data);
        pageData.created_at = new Date();
        await addDoc(collection(db, "pages"), pageData);
        await updateLastNumber("courses", newId);
        toast.success(lang["add_course_success"]);
      } else {
        data.updated_at = new Date().toISOString();
        data.updated_by = userId;
        await updateDoc(docRef, data);
        const q = query(
          collection(db, "pages"),
          where("courseId", "==", newId.toString())
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const pageDoc = snapshot.docs[0];
          await updateDoc(pageDoc.ref, {
            name: form.name.en,
            slug: pageSlug,
            updated_at: new Date(),
          });
        }
        toast.success(lang["update_course_success"]);
      }
      handleClear();
    } catch (error) {
      console.error("Error saving course:", error);
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
            {course ? lang["edit_course"] : lang["create_course"]}
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
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              {lang["code"]}
            </label>
            <FormatCode
              setCode={setCode}
              documentId="courses"
              group={form?.group}
              subgroup={form?.subgroup}
              isNewCode={isNewCourse}
              data={course}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["image"]}
              </label>
              {/* Image */}
              {image?.url && (
                <div className="relative w-full max-w-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={image?.url}
                    alt="mockup"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain rounded-lg"
                    priority
                  />
                  <div className="absolute top-0 right-1">
                    <Tooltip title={lang["remove"]} arrow>
                      <button
                        type="button"
                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => handleRemoveImage()}
                      >
                        <IoClose size={10} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}
              <UploadImage
                onUpload={(file) => handleUploadImage(file)}
                folder="courses"
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
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["start_date"]}
              </label>
              <DatePicker
                showIcon
                selected={form.start_date}
                onChange={(date) => setForm({ ...form, start_date: date })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                minDate={new Date()}
                icon={<CiCalendar />}
                dateFormat={"dd/MM/yyyy"}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["end_date"]}
              </label>
              <DatePicker
                showIcon
                selected={form.end_date}
                onChange={(date) => setForm({ ...form, end_date: date })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                minDate={form.start_date}
                icon={<CiCalendar />}
                dateFormat={"dd/MM/yyyy"}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["group"]}
              </label>
              <SelectForm
                collectionPath={"groups"}
                value={form.group}
                setValue={(value) => setForm({ ...form, group: value })}
                page="courses"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["subgroup"]}
              </label>
              <SelectForm
                collectionPath={"subgroups"}
                value={form.subgroup}
                setValue={(value) => setForm({ ...form, group: value })}
                page="courses"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              {lang["price"]}
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder={lang["price_placeholder"]}
            />
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

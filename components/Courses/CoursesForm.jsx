import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Tooltip, Slide, Dialog } from "@mui/material";
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
  orderBy,
  limit,
} from "firebase/firestore";
import dynamic from "next/dynamic";
import ParticipantsModel from "@/components/modal/ParticipantsModel";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import th from "date-fns/locale/th";
registerLocale("th", th);
import { CiCalendar } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { FaPlusSquare } from "react-icons/fa";
import ColorPicker from "../Input/ColorPicker";
const TiptapEditor = dynamic(() => import("@/components/Tiptap/TiptapEditor"), {
  ssr: false,
});

const sampleData = {
  content: {
    th: "<p>เนื้อหา....</p>",
    en: "<p>Contents...</p>",
  },
};

export default function CoursesForm({ onClose, course, isNewCourse }) {
  const { t, lang } = useLanguage();
  const { data: session } = useSession();
  const userId = session?.user?.userId;
  const [form, setForm] = useState({
    name: { th: "", en: "" },
    gen: 0,
    description: { th: "", en: "" },
    cover: "",
    group: "",
    subgroup: "",
    price: "",
    location: "",
    location_url: "",
    youtube_url: "",
    registration_url: "",
    download_url: "",
    schedule_type: "single",
  });
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState(null);
  const [image, setImage] = useState(null);
  const [imageEng, setImageEng] = useState(null);
  const [tags, setTags] = useState([]);
  const [code, setCode] = useState(null);
  const [content, setContent] = useState({ th: "", en: "" });
  const [participants, setParticipants] = useState([]);
  const [lastNumber, setLastNumber] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [language, setLanguage] = useState("th");
  const [schedules, setSchedules] = useState([
    {
      start_date: new Date(),
      end_date: new Date(),
      start_time: "",
      end_time: "",
    },
  ]);
  const [button, setButton] = useState({
    color: "#000000",
    text: { th: "", en: "" },
    url: "",
  });

  useEffect(() => {
    if (course) {
      setForm({
        name: course.name || { th: "", en: "" },
        gen: course.gen || 0,
        description: course.description || { th: "", en: "" },
        cover: course.cover || {},
        group: course.group || "",
        subgroup: course.subgroup || "",
        price: course.price || "",
        location: course.location || "",
        location_url: course.location_url || "",
        youtube_url: course.youtube_url || "",
        registration_url: course.registration_url || "",
        download_url: course.download_url || "",
        schedule_type: course.schedule_type || "single",
      });
      setImage(course.image || {});
      setTags(course.tags || []);
      setCode({
        docEntry: course.docEntry,
        code: course.code,
      });
      setContent({
        th: course?.content?.th || sampleData.content.th,
        en: course?.content?.en || sampleData.content.en,
      });
      setParticipants(course.participants);
      setSchedules(
        course.schedules
          ? course.schedules
          : [
              {
                start_date: new Date(),
                end_date: new Date(),
                start_time: "",
                end_time: "",
              },
            ]
      );
      setImageEng(course.imageEng || {});
      setButton({
        color: course.button?.color || "#000000",
        text: course.button?.text || { th: "", en: "" },
        url: course.button?.url || "",
      });
    } else if (isNewCourse) {
      setTags([]);
    }
  }, [course]);

  useEffect(() => {
    const fetchLastNumbers = async () => {
      const snapshot = await getDocs(collection(db, "courses"));

      const maxId = snapshot.docs
        .map((doc) => {
          const id = doc.id;
          const parsed = parseInt(id, 10);
          return isNaN(parsed) ? 0 : parsed;
        })
        .reduce((max, curr) => Math.max(max, curr), 0);

      setLastNumber(maxId + 1);
    };

    fetchLastNumbers();
  }, []);

  const generateUniqueDocEntry = async () => {
    let newId = lastNumber ? lastNumber : 1;
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
      gen: 0,
      description: { th: "", en: "" },
      group: "",
      subgroup: "",
      price: "",
      location: "",
      location_url: "",
      youtube_url: "",
      registration_url: "",
      download_url: "",
    });
    setTags([]);
    setCode(null);
    setCover(null);
    setImage({});
    setImageEng({});
    setContent({ th: "", en: "" });
    setParticipants([]);
    setSchedules([]);
    setButton({ color: "#000000", text: { th: "", en: "" }, url: "" });
    onClose();
  };

  const handleUploadImage = (file) => {
    setImage(file[0]);
  };

  const handleRemoveImage = (image) => {
    deleteFile(image.file_id);
    setImage(null);
  };

  const handleUploadImageEng = (file) => {
    setImageEng(file[0]);
  };

  const handleRemoveImageEng = (image) => {
    deleteFile(image.file_id);
    setImageEng(null);
  };

  const generateSlug = (text) => {
    return text
      ?.trim()
      .toLowerCase()
      .replace(/[\s]+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");
  };

  const safeToISOString = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value.toISOString();
    const date = new Date(value);
    return isNaN(date) ? null : date.toISOString();
  };

  const normalizeTime = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr.includes(".")) {
      // แปลง 9.30 เป็น 09:30
      const [h, m] = timeStr.split(".");
      const hour = h.padStart(2, "0");
      const minute = m.padEnd(2, "0");
      return `${hour}:${minute}`;
    }
    if (timeStr.includes(":")) {
      const [h, m] = timeStr.split(":");
      return `${h.padStart(2, "0")}:${m.padEnd(2, "0")}`;
    }
    return timeStr;
  };

  const timeStringToDate = (timeStr) => {
    const normalized = normalizeTime(timeStr);
    if (!normalized) return null;
    const [hours, minutes] = normalized.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const handleParticipants = (participants) => {
    setParticipants((prev) => [...prev, participants]);
  };

  const handleTags = (tags) => {
    setTags((prev) => [...prev, tags]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleRemove = (teamId) => {
    const removed = participants.find((t) => t.id === teamId);
    if (removed) {
      setParticipants(participants.filter((t) => t.id !== teamId));
    }
  };

  const getNextOrder = async () => {
    const q = query(
      collection(db, "courses"),
      orderBy("order", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const maxOrder = querySnapshot.docs[0].data().order;
      return maxOrder + 1;
    } else {
      return 1; // ถ้ายังไม่มีข้อมูล
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const nextOrder = await getNextOrder();

    try {
      let newId = course?.id ? course.id : await generateUniqueDocEntry(); // กำหนดค่าเริ่มต้นที่ 1 ถ้าไม่มี id

      const slug = generateSlug(form.name.en);

      let docRef = doc(db, "courses", newId.toString());
      const docSnap = await getDoc(docRef);

      const pageSlug = form.group
        ? form.subgroup
          ? `courses/${form.group}/${form.subgroup}/${slug}`
          : `courses/${form.group}/${slug}`
        : `courses/${slug}`;

      if (schedules.length > 1) {
        setForm((prev) => ({ ...prev, schedule_type: "multiple" }));
      }

      const schedulesData = schedules.map((schedule) => ({
        ...schedule,
        start_date: safeToISOString(schedule.start_date),
        end_date: safeToISOString(schedule.end_date),
        start_time: schedule.start_time
          ? normalizeTime(schedule.start_time)
          : null,
        end_time: schedule.end_time ? normalizeTime(schedule.end_time) : null,
      }));

      const data = {
        id: newId,
        code: code ? code.code : null,
        docEntry: newId,
        name: { th: form.name.th, en: form.name.en },
        gen: form.gen,
        description: { th: form.description.th, en: form.description.en },
        image: image ? image : {},
        imageEng: imageEng ? imageEng : {},
        schedule_type: form.schedule_type ? form.schedule_type : "single",
        schedules: schedulesData,
        group: form.group,
        subgroup: form.subgroup,
        price: form.price,
        location: form.location,
        location_url: form.location_url,
        youtube_url: form.youtube_url,
        registration_url: form.registration_url,
        download_url: form.download_url,
        participants: participants ? participants : [],
        button: {
          color: button.color,
          text: { th: button.text.th, en: button.text.en },
          url: button.url,
        },
        tags: tags,
        content: content,
        active: true,
        slug: slug,
        order: isNewCourse ? nextOrder : course.order, // ✅ เพิ่มตรงนี้
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "",
        updated_by: "",
      };

      if (isNewCourse) {
        if (docSnap.exists()) {
          newId = await generateUniqueDocEntry(newId);
          data.id = newId;
          data.docEntry = newId;

          // ✅ ต้อง update docRef ด้วย!
          docRef = doc(db, "courses", newId.toString());
        }

        data.created_by = userId;
        await setDoc(docRef, data);
        await updateLastNumber("courses", newId);
        toast.success(lang["course_added_successfully"]);
      } else {
        data.updated_at = new Date().toISOString();
        data.updated_by = userId;
        await updateDoc(docRef, data, { merge: true }); // ✅ docRef ต้องตรงกับ newId ที่สุดท้าย
        toast.success(lang["course_updated_successfully"]);
      }
      handleClear();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(lang["error_occured"]);
    } finally {
      setLoading(false);
    }
  };

  const e = (data) => {
    return data?.[language] || "";
  };

  const handleContentChange = (newContent) => {
    setContent((prevContent) => ({
      ...prevContent,
      [language]: newContent, // ✅ อัปเดตค่าของภาษาที่เลือกเท่านั้น
    }));
  };

  const addNewSchedule = () => {
    setSchedules([
      ...schedules,
      {
        start_date: new Date(),
        end_date: new Date(),
        start_time: "",
        end_time: "",
      },
    ]);
  };

  const updateSchedule = (index, key, value) => {
    const updated = [...schedules];
    updated[index][key] = value;
    setSchedules(updated);
  };

  const removeSchedule = (index) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row px-4 py-2 items-center justify-between bg-orange-500 w-full">
          <h1 className="text-2xl font-semibold text-white">
            {course ? lang["edit_course"] : lang["create_course"]}
          </h1>
          <Tooltip title={lang["close"]} placement="bottom">
            <button
              type="button"
              className="text-white bg-transparent hover:bg-orange-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              onClick={handleClear}
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
              code={code}
              docId={course?.id}
              group={form?.group}
              subgroup={form?.subgroup}
              isNewCode={isNewCourse}
              data={course}
              lastNumber={lastNumber}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  {lang["imageTh"]}
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
                          onClick={() => handleRemoveImage(image)}
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
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  {lang["imageEng"]}
                </label>
                {/* Image */}
                {imageEng?.url && (
                  <div className="relative w-full max-w-[300px] rounded-lg overflow-hidden">
                    <Image
                      src={imageEng?.url}
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
                          onClick={() => handleRemoveImageEng(image)}
                        >
                          <IoClose size={10} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                )}
                <UploadImage
                  onUpload={(file) => handleUploadImageEng(file)}
                  folder="courses"
                  size={20}
                  userId={userId}
                />
              </div>
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

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["gen"]}
              </label>
              <input
                type="text"
                id="gen"
                name="gen"
                value={form?.gen}
                onChange={(e) => setForm({ ...form, gen: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/4 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div className="flex flex-col gp-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["participants"]}
              </label>
              {participants?.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row flex-wrap gap-2">
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-row items-center justify-between px-2 py-111 gap-2 bg-gray-100 rounded-full"
                      >
                        <span>{t(p.name)}</span>
                        <IoClose
                          size={20}
                          className="cursor-pointer text-red-500"
                          onClick={() => handleRemove(p.id)}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <FaPlusSquare
                      size={20}
                      className="text-orange-500 cursor-pointer"
                      onClick={handleOpenModal}
                    />
                  </div>
                  {openModal && (
                    <ParticipantsModel
                      onClose={handleCloseModal}
                      participants={participants}
                      setParticipants={setParticipants}
                    />
                  )}
                </div>
              ) : (
                <>
                  <div
                    className="flex flex-row items-center px-6 py-2 gap-4 bg-gray-200 rounded-xl w-1/4 cursor-pointer hover:bg-gray-300"
                    onClick={handleOpenModal}
                  >
                    <FiUsers />
                    <span>{lang["add_participants"]}</span>
                  </div>
                  {openModal && (
                    <ParticipantsModel
                      onClose={handleCloseModal}
                      participants={participants}
                      setParticipants={setParticipants}
                    />
                  )}
                </>
              )}
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

          {/* Schedules */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">กำหนดการ</h3>
              <button onClick={addNewSchedule}>
                <FaPlusSquare
                  size={20}
                  className="text-orange-600 hover:text-orange-700"
                />
              </button>
            </div>
            {schedules &&
              schedules.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      {lang["start_date"]}
                    </label>
                    <DatePicker
                      isClearable
                      showIcon
                      selected={item.start_date}
                      onChange={(date) =>
                        updateSchedule(index, "start_date", date)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      minDate={new Date()}
                      icon={<CiCalendar />}
                      dateFormat={"dd/MM/yyyy"}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      {lang["end_date"]}
                    </label>
                    <DatePicker
                      isClearable
                      showIcon
                      selected={item.end_date}
                      onChange={(date) =>
                        updateSchedule(index, "end_date", date)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      minDate={new Date()}
                      icon={<CiCalendar />}
                      dateFormat={"dd/MM/yyyy"}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      {lang["start_time"]}
                    </label>
                    <TimePicker
                      value={timeStringToDate(item.start_time)}
                      onChange={(time) =>
                        updateSchedule(index, "start_time", time)
                      }
                      format="HH:mm"
                      disableClock
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      {lang["end_time"]}
                    </label>
                    <TimePicker
                      value={timeStringToDate(item.end_time)}
                      onChange={(time) =>
                        updateSchedule(index, "end_time", time)
                      }
                      format="HH:mm"
                      disableClock
                    />
                  </div>
                  <div className="flex mt-4 ml-5">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                      onClick={() => removeSchedule(index)}
                    >
                      <RiDeleteBin5Line size={22} />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-row gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["group"]}
              </label>
              <SelectForm
                type={"group"}
                page={"courses"}
                value={form.group}
                setValue={(value) => setForm({ ...form, group: value })}
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["subgroup"]}
              </label>
              <SelectForm
                type={"subgroup"}
                page={"courses"}
                value={form.subgroup}
                setValue={(value) => setForm({ ...form, subgroup: value })}
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
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["location"]}
              </label>

              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["location_placeholder"]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["location_url"]}
              </label>

              <input
                type="text"
                id="location_url"
                name="location_url"
                value={form.location_url}
                onChange={(e) =>
                  setForm({ ...form, location_url: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["location_url_placeholder"]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["youtube_url"]}
              </label>

              <input
                type="text"
                id="youtube_url"
                name="youtube_url"
                value={form.youtube_url}
                onChange={(e) =>
                  setForm({ ...form, youtube_url: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["youtube_url_placeholder"]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["registration_url"]}
              </label>

              <input
                type="text"
                id="registration_url"
                name="registration_url"
                value={form.registration_url}
                onChange={(e) =>
                  setForm({ ...form, registration_url: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["registration_url_placeholder"]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                {lang["download_url"]}
              </label>

              <input
                type="text"
                id="download_url"
                name="download_url"
                value={form.download_url}
                onChange={(e) =>
                  setForm({ ...form, download_url: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["download_url_placeholder"]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
            <div className="flex flex-col">
              <label htmlFor="buttonColor">{lang["button_color"]}</label>
              <div className="flex items-center gap-2">
                <ColorPicker
                  value={button.color || "#000000"}
                  onChange={(color) => setButton({ ...button, color: color })}
                  size={40}
                />
                <input
                  type="text"
                  id="buttonColor"
                  name="buttonColor"
                  value={button.color}
                  onChange={(e) =>
                    setButton({ ...button, color: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder={lang["button_color_placeholder"]}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="bottonText">{lang["button_text"]}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="button.text.th"
                  name="button.text.th"
                  value={button.text.th}
                  onChange={(e) =>
                    setButton({
                      ...button,
                      text: { ...button.text, th: e.target.value },
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder={lang["button_text_placeholder"] + " (th)"}
                />
                <input
                  type="text"
                  id="button.text.en"
                  name="button.text.en"
                  value={button.text.en}
                  onChange={(e) =>
                    setButton({
                      ...button,
                      text: { ...button.text, en: e.target.value },
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder={lang["button_text_placeholder"] + " (en)"}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="buttonUrl">{lang["button_url"]}</label>
              <input
                type="text"
                id="button.url"
                name="button.url"
                value={button.url}
                onChange={(e) => setButton({ ...button, url: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["button_url_placeholder"]}
              />
            </div>
          </div>
        </div>
        {/* Editor */}
        <div className="px-4 w-full">
          <div className="flex flex-row items-center justify-end gap-2 w-full">
            <button
              className={`px-4 py-1 rounded-md font-bold transition ${
                language === "th"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => setLanguage("th")}
            >
              TH
            </button>
            <button
              className={`px-4 py-1 rounded-md font-bold transition ${
                language === "en"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>
          <TiptapEditor
            content={content[language]}
            onChange={(contents) => handleContentChange(contents)}
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

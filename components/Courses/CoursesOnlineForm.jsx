import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Tooltip, Slide, Dialog, Divider } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "../btn/UploadImage";
import { deleteFile } from "@/hooks/useStorage";
import SelectForm from "@/components/Selected/SelectForm";
import Loading from "../utils/Loading";
import Tags from "../Input/Tags";
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
import VideoModal from "./VideoModal";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { FaEdit, FaPlusSquare, FaTrashAlt, FaRegEye } from "react-icons/fa";
import { RxVideo } from "react-icons/rx";
import useCode from "@/hooks/useCode";
import VideoUpload from "../utils/VideoUpload";
import useVideo from "@/hooks/useVideo";
const TiptapEditor = dynamic(() => import("@/components/Tiptap/TiptapEditor"), {
  ssr: false,
});

const sampleData = {
  content: {
    th: "<p>เนื้อหา....</p>",
    en: "<p>Contents...</p>",
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CoursesOnlineForm({ onClose, course, isNewCourse }) {
  const { t, lang } = useLanguage();
  const { data: session } = useSession();
  const userId = session?.user?.userId;
  const [form, setForm] = useState({
    name: { th: "", en: "" },
    description: { th: "", en: "" },
    group: "",
    subgroup: "",
    price: "",
    preview_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageEng, setImageEng] = useState(null);
  const [tags, setTags] = useState([]);
  const [codePreview, setCodePreview] = useState({
    docEntry: null,
    code: null,
  });
  const [content, setContent] = useState({ th: "", en: "" });
  const [participants, setParticipants] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [priviewVideo, setPriviewVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [currentVideoUpload, setCurrentVideoUpload] = useState(null);
  const [videoIndex, setVideoIndex] = useState(null);
  const [openEditVideoModal, setOpenEditVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [language, setLanguage] = useState("th");
  const { code, updateLastNumber } = useCode({
    documentName: "online-course",
  });

  const { deleteVideo } = useVideo();

  useEffect(() => {
    if (course) {
      setForm({
        name: course.name || { th: "", en: "" },
        description: course.description || { th: "", en: "" },
        group: course.group || "",
        subgroup: course.subgroup || "",
        price: course.price || "",
      });
      setImage(course.image || {});
      setImageEng(course.imageEng || {});
      setPriviewVideo(course.preview || "");
      setVideos(course.video || []);
      setTags(course.tags || []);
      setCodePreview({
        docEntry: course.docEntry,
        code: course.code,
      });
      setContent({
        th: course?.content?.th || sampleData.content.th,
        en: course?.content?.en || sampleData.content.en,
      });
      setParticipants(course.participants);
    } else if (isNewCourse) {
      setTags([]);
      setCodePreview(code);
      setVideos([]);
      setPriviewVideo(null);
    }
  }, [course]);

  const handleClear = () => {
    setForm({
      name: { th: "", en: "" },
      description: { th: "", en: "" },
      group: "",
      subgroup: "",
      price: "",
    });
    setCodePreview(null);
    setTags([]);
    setImage({});
    setImageEng({});
    setContent({ th: "", en: "" });
    setParticipants([]);
    setPriviewVideo(null);
    setVideos([]);
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
      collection(db, "online-courses"),
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
      let newId = course?.id ? course.id : code.docEntry; // กำหนดค่าเริ่มต้นที่ 1 ถ้าไม่มี id

      const slug = generateSlug(form.name.en);

      let docRef = doc(db, "online-courses", newId.toString());
      const docSnap = await getDoc(docRef);

      const data = {
        id: newId,
        code: code ? code.code : null,
        docEntry: code ? code.docEntry : null,
        name: { th: form.name.th, en: form.name.en },
        description: { th: form.description.th, en: form.description.en },
        preview: priviewVideo ? priviewVideo : {},
        video: videos ? videos : [],
        image: image ? image : {},
        imageEng: imageEng ? imageEng : {},
        group: form.group,
        subgroup: form.subgroup,
        price: form.price,
        participants: participants ? participants : [],
        tags: tags,
        content: content,
        active: true,
        slug: slug,
        order: isNewCourse ? nextOrder : course.order, // ✅ เพิ่มตรงนี้
        created_at: course?.created_at || "",
        updated_at: "",
        created_by: "",
        updated_by: "",
        status: true,
      };

      if (isNewCourse) {
        if (docSnap.exists()) {
          data.id = code.docEntry;
          data.docEntry = code.docEntry;

          // ✅ ต้อง update docRef ด้วย!
          docRef = doc(db, "online-courses", newId.toString());
        }

        data.created_by = userId;
        data.created_at = new Date().toISOString();
        data.updated_at = new Date().toISOString();
        await setDoc(docRef, data);
        await updateLastNumber(newId);
        toast.success(lang["course_added_successfully"]);
      } else {
        data.created_at = course.created_at
          ? course.created_at
          : new Date().toISOString();
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

  const handleOpenVideoModal = (current) => {
    setCurrentVideoUpload(current);
    setOpenVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setCurrentVideoUpload(null);
    setOpenVideoModal(false);
  };

  const handleEditVideo = (video, index) => {
    setSelectedVideo(video);
    setVideoIndex(index);
    setOpenEditVideoModal(true);
  };

  const handleCloseEditVideoModal = () => {
    setVideoIndex(null);
    setSelectedVideo(null);
    setOpenEditVideoModal(false);
  };

  const handleUploadVideo = (newVideo) => {
    if (currentVideoUpload === "preview") {
      setPriviewVideo(newVideo[0]);
    } else {
      setVideos((prevVideos) => [...prevVideos, ...newVideo]);
    }
    setCurrentVideoUpload(null);
    setOpenVideoModal(false);
  };

  console.log("videos", videos);
  console.log("priviewVideo", priviewVideo);

  const handleDeleteVideo = async (id, fileId) => {
    await deleteVideo(fileId);
    setVideos((prevVideo) => prevVideo.filter((v) => v.id !== id));
  };

  const handleOnEditVideo = (video) => {
    const updatedVideos = [...videos];
    updatedVideos[videoIndex] = { ...updatedVideos[videoIndex], ...video };
    setVideos(updatedVideos);
    handleCloseEditVideoModal();
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row px-4 py-2 items-center justify-between bg-orange-500 w-full">
          <h1 className="text-2xl font-semibold text-white">
            {course ? lang["edit_course_online"] : lang["create_course_online"]}
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
            <input
              name="code"
              id="code"
              value={codePreview?.code ? codePreview.code : code.code}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Code"
              disabled
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
        </div>
        {/* Editor */}
        <div className="px-4 w-full">
          <div className="flex flex-row items-center gap-2 w-full">
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
        {/* Video Section */}
        <div className="p-4 mt-4">
          <span className="flex items-center gap-2 font-bold text-lg text-orange-500">
            <RxVideo size={20} />
            {lang["video_management"]}
          </span>
          <Divider sx={{ my: 2 }} />
          {/* Preview Video Section */}
          <h3>{lang["preview_course"]}</h3>
          {priviewVideo?.url && (
            <div className="my-2 border border-gray-300 p-2 shadow-sm w-fit">
              <div className="relative">
                <Image
                  src={priviewVideo?.thumbnail}
                  alt={t(priviewVideo?.title)}
                  width={300}
                  height={150}
                  loading="lazy"
                />
                <div className="flex flex-row gap-2 justify-center mt-1">
                  <Tooltip title={lang["preview"]} placement="bottom">
                    <FaRegEye
                      size={28}
                      className="bg-white border p-1 rounded-md cursor-pointer hover:bg-gray-200"
                    />
                  </Tooltip>
                  <Tooltip title={lang["delete"]} placement="bottom">
                    <RiDeleteBin5Line
                      size={28}
                      className="bg-white border p-1 rounded-md cursor-pointer hover:bg-gray-200"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
          <Tooltip title={lang["add_preview_course"]} placement="bottom">
            <button
              type="button"
              className="flex items-center gap-2 w-70 px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg"
              onClick={() => handleOpenVideoModal("preview")}
            >
              <FaPlusSquare size={20} />
              {lang["add_preview_course"]}
            </button>
          </Tooltip>

          <Divider sx={{ my: 2 }} />
          {/* Video List Section */}
          <Tooltip title={lang["add_video"]} placement="bottom">
            <button
              type="button"
              className="flex items-center gap-2 w-40 px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg"
              onClick={() => handleOpenVideoModal("video")}
            >
              <FaPlusSquare size={20} />
              {lang["add_video"]}
            </button>
          </Tooltip>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {videos && videos.length > 0
              ? videos.map((v, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 border border-gray-300 p-2 shadow-sm"
                  >
                    <Image
                      src={v.thumbnail}
                      alt={t(v.title)}
                      width={200}
                      height={100}
                      loading="lazy"
                    />
                    <p className="text-sm text-black text-center">
                      {t(v.title)}
                    </p>
                    <div className="flex flex-row gap-2 justify-center">
                      <FaRegEye
                        size={28}
                        className="bg-white border p-1 rounded-md cursor-pointer hover:bg-gray-200"
                      />
                      <FaEdit
                        size={28}
                        className="bg-white border p-1 rounded-md cursor-pointer hover:bg-gray-200"
                        onClick={() => handleEditVideo(v, i)}
                      />
                      <RiDeleteBin5Line
                        size={28}
                        className="bg-white border p-1 rounded-md cursor-pointer hover:bg-gray-200"
                        onClick={() => handleDeleteVideo(i, v.fileId)}
                      />
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>

        {/* Toolbar Section */}
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
      <Dialog
        open={openVideoModal}
        onClose={handleCloseVideoModal}
        TransitionComponent={Transition}
      >
        <VideoUpload
          onClose={handleCloseVideoModal}
          onProcess={handleUploadVideo}
          folder="online-courses"
          multiple={currentVideoUpload === "video"}
        />
      </Dialog>

      <Dialog
        open={openEditVideoModal}
        onClose={handleCloseEditVideoModal}
        TransitionComponent={Transition}
        fullScreen
      >
        <VideoModal
          data={selectedVideo}
          onClose={handleCloseEditVideoModal}
          onEdit={handleOnEditVideo}
        />
      </Dialog>
    </div>
  );
}

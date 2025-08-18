import React, { useState, useEffect } from "react";
import axios from "axios";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Tooltip, Slide, Dialog, Divider } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FaPlusSquare, FaVideo } from "react-icons/fa";
import { useVideoThumbnail } from "@/hooks/useVideoThumbnail";
import Loading from "../utils/Loading";
import VideoUpload from "../utils/VideoUpload";
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VideoModal({
  data,
  docId,
  course,
  page,
  onSave,
  onClose,
}) {
  const [textUrl, setTextUrl] = useState({
    url: "",
    isUploaded: false,
  });
  const [video, setVideo] = useState({});
  const [title, setTitle] = useState({ th: "", en: "" });
  const [description, setDescription] = useState({ th: "", en: "" });
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { t, lang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setTextUrl({ url: data.url, isUploaded: data.isUploaded });
      setVideo(data.video);
      setThumbnail(data.thumbnail);
      setTitle({ th: data.title.th, en: data.title.en });
      setDescription({ th: data.description.th, en: data.description.en });
    }
  }, [data]);

  useEffect(() => {
    if (textUrl.url && textUrl.isUploaded === false) {
      fetchYoutube(textUrl.url);
    } else {
      setLoading(false);
    }
  }, [textUrl]);

  const fetchYoutube = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/get-youtube?youtubeUrl=${url}`);
      setVideo(response.data.video);
      setThumbnail(response.data.thumbnail);
      setTitle({ th: response.data.title, en: response.data.title });
      setDescription({
        th: response.data.description,
        en: response.data.description,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleUpload = (videos) => {
    const uploadedVideo = videos[0];
    setVideo(uploadedVideo.uploadedFiles[0]);
    setTextUrl({ url: uploadedVideo.uploadedFiles[0].url, isUploaded: true });
    setThumbnail(uploadedVideo.uploadedFiles[0].thumbnail);
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleClear = () => {
    setTextUrl({ url: "", isUploaded: false });
    setVideo({});
    setThumbnail(null);
    setTitle({ th: "", en: "" });
    setDescription({ th: "", en: "" });
    onClose();
  };

  const handleProcess = async () => {
    const data = {
      ...video,
      title: title,
      description: description,
      thumbnail: thumbnail,
      isUploaded: textUrl.isUploaded,
    };
    onSave(data);
    handleClear();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-row items-center justify-between bg-orange-500 p-2 text-white">
        <span className="font-bold text-lg">{lang["video_management"]}</span>
        <button onClick={onClose}>
          <IoClose size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 bg-white p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="url" className="block font-bold">
            {lang["url"]}:
          </label>
          <input
            type="text"
            id="url"
            value={textUrl.url}
            onChange={(e) =>
              setTextUrl({ ...textUrl, url: e.target.value, isUploaded: false })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder={lang["video_url_placeholder"]}
          />
        </div>
        {/* video & thumbnail */}
        <div className="flex flex-col gap-2">
          {/* Video Thumbnail */}
          {video?.thumbnail && (
            <div>
              <Image
                src={video?.thumbnail}
                alt="thumbnail"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          )}
          <Tooltip title={lang["upload_video"]} placement="top">
            <div
              className="flex items-center gap-4 bg-orange-500 hover:bg-orange-600 text-white border border-gray-300 p-2 rounded-lg w-40 cursor-pointer"
              onClick={handleOpen}
            >
              <FaVideo size={20} />
              <span>{lang["upload_video"]}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <label htmlFor="title" className="block font-bold">
            {lang["title"]}:
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <input
              name="title-th"
              value={title.th}
              onChange={(e) => setTitle({ ...title, th: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder={lang["title_placeholder"] + " (th)"}
            />
            <input
              name="title-en"
              value={title.en}
              onChange={(e) => setTitle({ ...title, en: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder={lang["title_placeholder"] + " (en)"}
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block font-bold">
            {lang["description"]}:
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <textarea
              name="description-th"
              value={description.th}
              onChange={(e) =>
                setDescription({ ...description, th: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder={lang["description_placeholder"] + " (th)"}
              rows="4"
            />
            <textarea
              name="description-th"
              value={description.en}
              onChange={(e) =>
                setDescription({ ...description, en: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder={lang["description_placeholder"] + " (en)"}
              rows="4"
            />
          </div>
        </div>
        <Divider sx={{ my: 2 }} />
        <div className="flex flex-row justify-center items-center gap-4">
          <Tooltip title={lang["save"]} placement="top">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
              onClick={handleProcess}
            >
              {lang["save"]}
            </button>
          </Tooltip>
          <Tooltip title={lang["cancel"]} placement="top">
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              onClick={handleClear}
            >
              {lang["cancel"]}
            </button>
          </Tooltip>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <VideoUpload
          onClose={handleClose}
          onProcess={handleUpload}
          folder="online"
          newUpload={!video}
          multiple={false}
        />
      </Dialog>
    </div>
  );
}

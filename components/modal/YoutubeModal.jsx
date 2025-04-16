import { useState, useEffect } from "react";
import axios from "axios";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";

export default function YoutubeModal({ onClose, contents, setContents }) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const { lang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(
        collection(db, "video"),
        where("provider", "==", "youtube")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const videosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(videosData);
      });

      return () => unsubscribe();
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (contents) {
      setSelectedVideo(contents);
    }
  }, [contents]);

  const handleSave = async () => {
    if (!youtubeUrl.trim()) {
      alert("กรุณาใส่ลิงก์ YouTube");
      return;
    }

    try {
      const response = await axios.post("/api/get-youtube", {
        youtubeUrl: youtubeUrl.trim(),
      });

      const videoData = response.data;

      const isShort = youtubeUrl.includes("/shorts/");
      const videoDoc = {
        ...videoData,
        url: youtubeUrl,
        provider: "youtube",
        type: isShort ? "short" : "youtube",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "video"), videoDoc);

      toast.success("บันทึกวิดีโอเรียบร้อย");
      setYoutubeUrl("");
      setOpenForm(false);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล YouTube:", error);
      toast.error("ไม่สามารถดึงข้อมูลจาก YouTube ได้ โปรดตรวจสอบลิงก์");
    }
  };

  const handleCancel = () => {
    setYoutubeUrl("");
    setOpenForm(false);
  };

  const handleSelectedVideo = (video) => {
    if (!selectedVideo.find((v) => v.id === video.id)) {
      setSelectedVideo((prev) => [...prev, video]);
    }
  };

  const handleRemoveSelectedVideo = (videoId) => {
    setSelectedVideo((prev) => prev.filter((video) => video.id !== videoId));
  };

  const handleOpenForm = () => {
    setOpenForm(!openForm);
  };

  const handleSubmit = () => {
    setContents(selectedVideo);
    onClose();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between bg-orange-500 text-white p-2 w-full">
        <h1>Youtube Managements</h1>
        <IoClose onClick={onClose} className="cursor-pointer" />
      </div>

      {/* Body */}
      <div className="p-4">
        <button
          onClick={() => handleOpenForm(!openForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-md"
        >
          {openForm ? "ปิด Youtube" : "เพิ่ม Youtube"}
        </button>
        <div className="grid grid-cols-2 gap-4 mt-4 p-4">
          {/* youtube */}
          <div>
            <h2 className="font-bold">Youtube:</h2>
            <Divider style={{ margin: "0 0 10px 10px" }} />
            {videos
              .filter((video) => !selectedVideo.find((v) => v.id === video.id))
              .map((video) => (
                <div
                  key={video.id}
                  className="flex items-center border border-gray-300 rounded-xl p-4 gap-2 shadow-lg m-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectedVideo(video)}
                >
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    width={50}
                    height={50}
                  />
                  <div>
                    <h5 className="text-sm">{video.title}</h5>
                  </div>
                </div>
              ))}
          </div>
          {/* selected */}
          <div>
            <h2 className="font-bold">Selected:</h2>
            <Divider style={{ margin: "0 0 10px 10px" }} />
            {selectedVideo.length > 0 &&
              selectedVideo.map((video) => (
                <div
                  key={video.id}
                  className="flex justify-between items-center border border-gray-300 rounded-xl p-4 gap-2 shadow-lg m-2"
                  onClick={() => handleRemoveSelectedVideo(video.id)}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      width={50}
                      height={50}
                    />

                    <h5 className="text-sm">{video.title}</h5>
                  </div>
                  <div className="bg-red-500 p-1 text-white rounded-full">
                    <IoClose className="cursor-pointer" size={15} />
                  </div>
                </div>
              ))}
          </div>
        </div>
        {selectedVideo.length > 0 && (
          <div className="flex justify-end p-4">
            <button
              onClick={handleSubmit}
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
            >
              {lang["save"]}
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      {openForm && (
        <div className="flex items-center border border-gray-300 rounded-xl p-4 gap-2 shadow-lg m-2">
          <label htmlFor="url">YoutubeUrl:</label>
          <input
            type="text"
            id="url"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            onChange={(e) => {
              setYoutubeUrl(e.target.value);
            }}
            value={youtubeUrl}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
          <button
            onClick={handleSave}
            className="bg-orange-500 text-white px-4 py-2 rounded-md"
          >
            {lang["save"]}
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            {lang["cancel"]}
          </button>
        </div>
      )}
    </div>
  );
}

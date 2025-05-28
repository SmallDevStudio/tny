import React, { useState, useEffect } from "react";
import axios from "axios";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { IoLogoYoutube } from "react-icons/io";
import { Divider, Slide, Dialog } from "@mui/material";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormFixHightLight({
  title,
  setTitle,
  description,
  setDescription,
  contents,
  setContents,
  style,
  setStyle,
  language,
  setLanguage,
  setEditMode,
  handleSubmit,
}) {
  const [openForm, setOpenForm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [url, setUrl] = useState("");
  const [youtube, setYoutube] = useState({});
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (url) {
      const getYoutube = async () => {
        try {
          const res = await axios.post("/api/get-youtube", { youtubeUrl: url });
          setYoutube(res.data);
        } catch (err) {
          console.error(
            "Error fetching YouTube data:",
            err.response?.data || err.message
          );
        }
      };
      getYoutube();
    } else {
      setYoutube({});
    }
  }, [url]);

  console.log("youtube", youtube);

  const e = (data) => {
    return data?.[language] || "";
  };

  const handleClear = () => {
    setLanguage("th");
    setEditMode(false);
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setUrl(video.video?.url || video.videoUrl || "");
    setYoutube(video.video || {});
    setOpenForm(true);
  };

  const handleDelete = (index) => {
    const newContents = contents.filter((_, i) => i !== index);
    setContents(newContents);
  };

  const handleAddVideo = () => {
    if (!youtube?.videoId) {
      alert("กรุณากรอกลิงก์ YouTube ให้ถูกต้อง");
      return;
    }

    const newContent = {
      video: youtube,
      title: youtube.title,
      description: youtube.description,
    };

    if (selectedVideo) {
      // กรณีแก้ไข
      const updatedContents = contents.map((item) =>
        item.video.videoId === selectedVideo.video.videoId ? newContent : item
      );
      setContents(updatedContents);
    } else {
      // กรณีเพิ่มใหม่
      setContents([...contents, newContent]);
    }

    // เคลียร์ฟอร์ม
    handleClearVideo();
  };

  const handleClearVideo = () => {
    setUrl("");
    setYoutube({});
    setSelectedVideo(null);
    setOpenForm(false);
  };

  const moveUp = (index) => {
    if (index <= 0) return;
    const newContents = [...contents];
    [newContents[index - 1], newContents[index]] = [
      newContents[index],
      newContents[index - 1],
    ];
    setContents(newContents);
  };

  const moveDown = (index) => {
    if (index >= contents.length - 1) return;
    const newContents = [...contents];
    [newContents[index + 1], newContents[index]] = [
      newContents[index],
      newContents[index + 1],
    ];
    setContents(newContents);
  };

  return (
    <div className="w-full">
      {/* Edit Mode */}
      <div className="flex flex-col border border-gray-300 rounded-md p-4 gap-2 shadow-lg">
        <div className="flex flex-col gap-2">
          <label htmlFor="title">{lang["title"]}</label>
          <input
            type="text"
            id="title-th"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={title.th}
            onChange={(e) => setTitle({ ...title, th: e.target.value })}
            placeholder="TH"
          />
          <input
            type="text"
            id="title-en"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={title.en}
            onChange={(e) => setTitle({ ...title, en: e.target.value })}
            placeholder="EN"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description">{lang["description"]}</label>
          <textarea
            type="text"
            id="description-th"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={description.th}
            onChange={(e) =>
              setDescription({ ...description, th: e.target.value })
            }
            placeholder="TH"
            rows={4}
          />
          <textarea
            type="text"
            id="description-en"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={description.en}
            onChange={(e) =>
              setDescription({ ...description, en: e.target.value })
            }
            placeholder="EN"
            rows={4}
          />
        </div>

        {/* Youtube Link */}
        <div>
          <h2 className="font-bold mb-1">Youtube Link</h2>
          <Divider sx={{ mb: 2 }} />
          <button
            onClick={() => setOpenForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            เพิ่มวิดีโอ
          </button>
          <div className="flex flex-col mt-2">
            {contents.map((content, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between border p-2 rounded-xl mb-1 w-1/2 bg-gray-100"
              >
                <div className="flex flex-row items-center gap-2">
                  <div className="flex items-center">
                    <button onClick={() => moveUp(index)} title="Move Up">
                      ⬆️
                    </button>
                    <button onClick={() => moveDown(index)} title="Move Down">
                      ⬇️
                    </button>
                  </div>
                  <h5 className="flex-1">{content.title}</h5>
                </div>

                <div className="flex items-center gap-2">
                  <FaEdit
                    size={20}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEdit(content)}
                  />
                  <FaTrashAlt
                    size={20}
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Form Video */}
          {openForm && (
            <div className="flex flex-col bg-gray-100 border rounded-md p-4 mt-4">
              <h3 className="font-bold">สร้างวิดีโอ</h3>
              <div className="flex flex-col gap-2">
                <div>
                  <label htmlFor="url">URL</label>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    value={url}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                {youtube && youtube.thumbnailUrl && (
                  <div>
                    <Image
                      src={youtube.thumbnailUrl}
                      alt="Thumbnail"
                      width={200}
                      height={200}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="videoTitle">{lang["title"]}</label>
                  <input
                    type="text"
                    id="videoTitle"
                    name="videoTitle"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={youtube?.title}
                    onChange={(e) =>
                      setYoutube({ ...youtube, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="videoDescription">
                    {lang["description"]}
                  </label>
                  <textarea
                    type="text"
                    id="videoDescription"
                    name="videoDescription"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={youtube?.description}
                    onChange={(e) =>
                      setYoutube({ ...youtube, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleAddVideo}
                    className="bg-orange-500 hover:bg-orange-600 p-2 rounded-md text-white font-bold"
                  >
                    {lang["save"]}
                  </button>
                  <button
                    onClick={handleClearVideo}
                    className="bg-red-500 hover:bg-red-600 p-2 rounded-md text-white font-bold"
                  >
                    {lang["cancel"]}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-center items-center gap-4 w-full mt-5">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 p-2 rounded-md text-white font-bold"
          >
            {lang["save"]}
          </button>

          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-600 p-2 rounded-md text-white font-bold"
          >
            {lang["cancel"]}
          </button>
        </div>
      </div>
    </div>
  );
}

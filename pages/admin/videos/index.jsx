import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
import Upload from "@/components/utils/Upload";
import YoutubeModal from "@/components/modal/YoutubeModal";
import { FaPlus, FaYoutube } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { Slide, Dialog, Divider } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminVideos() {
  const [form, setForm] = useState({
    title: { th: "", en: "" },
    description: { th: "", en: "" },
    url: "",
  });
  const [video, setVideo] = useState(null);
  const [handleOpenForm, setHandleOpenForm] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const router = useRouter();
  const { t, lang } = useLanguage();

  const handleCloseForm = () => {
    setHandleOpenForm(null);
  };

  const handleUpload = (video) => {
    setVideo(video[0]);
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <h1 className="text-xl font-bold dark:text-white my-2">
        Video Managements
      </h1>
      {/* Tools */}
      <div>
        <div>
          <button
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => setToggleMenu(!toggleMenu)}
          >
            <FaPlus />
          </button>
          {toggleMenu && (
            <ul className="absolute flex flex-col gap-2 border rounded-b-xl p-2 shadow-md">
              <li onClick={() => setHandleOpenForm("upload")}>
                <div className="flex items-center gap-2">
                  <FiUpload size={20} className="text-blue-500" />
                  <span>Upload</span>
                </div>
              </li>
              <Divider />
              <li onClick={() => setHandleOpenForm("youtube")}>
                <div className="flex items-center gap-2">
                  <FaYoutube size={20} className="text-red-500" />
                  <span>Youtube</span>
                </div>
              </li>
            </ul>
          )}
        </div>
      </div>

      <Dialog
        open={handleOpenForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setHandleOpenForm(null)}
      >
        {handleOpenForm === "youtube" ? (
          <YoutubeModal
            contents={video}
            setContents={setVideo}
            onClose={handleCloseForm}
          />
        ) : handleOpenForm === "upload" ? (
          <Upload
            handleCloseForm={handleCloseForm}
            folder="videos"
            newUpload={!video}
            setFiles={(video) => handleUpload(video)}
          />
        ) : null}
      </Dialog>
    </div>
  );
}

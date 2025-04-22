import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";

const sampleData = {
  title: {
    th: "ทดสอบหัวเรื่อง",
    en: "Sample title",
  },
  description: {
    th: "คําอธิบายภาษาไทย",
    en: "English description",
  },
  contents: [
    {
      id: 1,
      video: {
        url: "https://www.youtube.com/shorts/hBTxCzXanV0",
        type: "short",
      },
      url: "https://www.youtube.com/shorts/hBTxCzXanV0",
    },
    {
      id: 2,
      video: {
        url: "https://www.youtube.com/shorts/y5NKozzDpOA",
        type: "short",
      },
      url: "https://www.youtube.com/shorts/y5NKozzDpOA",
    },
    {
      id: 3,
      video: {
        url: "https://www.youtube.com/shorts/U5hhH--Z-yo",
        type: "short",
      },
      url: "https://www.youtube.com/shorts/U5hhH--Z-yo",
    },
    {
      id: 4,
      video: {
        url: "https://www.youtube.com/shorts/LT-tEVu_PMc",
        type: "short",
      },
      url: "https://www.youtube.com/shorts/LT-tEVu_PMc",
    },
  ],
  style: {
    color: "#ff0000",
    backgroundColor: "#00ff00",
    fontSize: "24px",
    fontWeight: "bold",
  },
};

function HoverVideoPlayer({ url }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
      className="w-full h-full"
    >
      <ReactPlayer
        url={url}
        playing={playing}
        loop
        muted
        controls={false}
        width="100%"
        height="100%"
        style={{ pointerEvents: "none" }} // ป้องกันกดเล่นซ้อน
      />
    </div>
  );
}

export default function ShortHightLight({
  contentId,
  editMode,
  language,
  setLanguage,
  setEditMode,
}) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [contents, setContents] = useState(sampleData.contents);
  const [style, setStyle] = useState({});
  const router = useRouter();

  const { t, lang } = useLanguage();

  function getYouTubeId(url) {
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    const longMatch = url.match(/v=([^?&]+)/);
    const shortMatch2 = url.match(/shorts\/([^?&]+)/);
    return shortMatch?.[1] || longMatch?.[1] || shortMatch2?.[1] || "";
  }

  return (
    <section className="bg-white dark:bg-gray-900 py-6 px-4">
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-between gap-6 items-stretch">
        {contents.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] flex-none"
            onClick={() =>
              window.open(
                `https://www.youtube.com/shorts/${item.video.url
                  .split("/")
                  .pop()}`,
                "_blank"
              )
            }
            style={{ width: "300px", aspectRatio: "9/16" }}
          >
            <HoverVideoPlayer url={item.video.url} />
          </div>
        ))}
      </div>
    </section>
  );
}

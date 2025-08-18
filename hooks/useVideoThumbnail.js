import { useState, useEffect } from "react";

export function useVideoThumbnail(videoUrl) {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  useEffect(() => {
    if (!videoUrl) return;

    const generateThumbnail = async () => {
      try {
        const video = document.createElement("video");
        video.src = videoUrl;
        video.crossOrigin = "anonymous"; // เผื่อ video มาจาก storage

        video.addEventListener("loadeddata", () => {
          video.currentTime = 1; // ไปที่วินาทีที่ 1 ของวิดีโอ
        });

        video.addEventListener("seeked", () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageUrl = canvas.toDataURL("image/png");
          setThumbnailUrl(imageUrl);
        });
      } catch (err) {
        console.error("Error generating thumbnail:", err);
      }
    };

    generateThumbnail();
  }, [videoUrl]);

  return thumbnailUrl;
}

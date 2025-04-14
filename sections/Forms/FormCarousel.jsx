import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "@/components/btn/UploadImage";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

export default function FormCarousel({
  description,
  setDescription,
  images,
  setImages,
  autoPlay,
  setAutoPlay,
  autoPlaySpeed,
  setAutoPlaySpeed,
  language,
  setLanguage,
  setEditMode,
  handleSubmit,
}) {
  const { t, lang } = useLanguage();

  const e = (data) => {
    return data?.[language] || "";
  };

  const handleUpload = (newImages) => {
    const updatedNewImages = newImages.map((img) => ({ ...img, link: "" }));
    setImages((prev) => [...(prev || []), ...updatedNewImages]);
  };

  const handleImageRemove = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUrl = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      link: value,
    };
    setImages(updatedImages);
  };

  const handleClear = () => {
    setTitle({});
    setDescription({});
    setImages([]);
    setLanguage("th");
    setEditMode(false);
  };

  return (
    <div className="w-full">
      {/* Edit Mode */}
      <div className="flex flex-col border border-gray-300 rounded-md p-4 gap-2 shadow-lg">
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

        <div className="flex flex-row items-center gap-16">
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="autoPlay">AutoPlay</label>
            <input
              type="checkbox"
              id="autoPlay"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
            />
          </div>

          <div className="flex flex-row items-center gap-2">
            <label htmlFor="autoPlaySpeed">PlaySpeed</label>
            <input
              type="number"
              id="autoPlaySpeed"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-20 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={autoPlaySpeed / 1000}
              onChange={(e) => setAutoPlaySpeed(e.target.value * 1000)}
            />
            <span>วินาที</span>
          </div>
        </div>

        {/* Upload Image */}
        <div className="flex flex-col gap-2 w-full">
          <div className="relative">
            {images &&
              images.length > 0 &&
              images.map((m, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-2 items-start w-full"
                >
                  {/* Image + Remove Button */}
                  <div className="relative flex flex-row shrink-0">
                    <Image
                      src={m.url}
                      alt={`image-${index}`}
                      width={120}
                      height={120}
                      className="object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      className="flex items-center justify-center absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => handleImageRemove(index)}
                    >
                      <IoClose size={14} />
                    </button>
                  </div>

                  {/* URL Input */}
                  <div className="flex flex-col w-full gap-1">
                    <label
                      htmlFor={`url-${index}`}
                      className="text-sm font-medium"
                    >
                      URL:
                    </label>
                    <input
                      type="text"
                      id={`url-${index}`}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[calc(100%-200px)] p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={m.link || ""}
                      onChange={(e) => handleUrl(index, e.target.value)}
                      placeholder="URL"
                    />
                  </div>
                </div>
              ))}
          </div>
          <UploadImage size={24} onUpload={handleUpload} folder="sections" />
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

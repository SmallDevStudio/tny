import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "@/components/btn/UploadImage";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Divider, Tooltip } from "@mui/material";
import { FaSquarePlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { deleteFile } from "@/hooks/useStorage";

export default function ContentForm({
  handleClose,
  contents,
  handleContents,
  newcontent,
}) {
  const [title, setTitle] = useState({ th: "", en: "" });
  const [description, setDescription] = useState({ th: "", en: "" });
  const [image, setImage] = useState({});
  const [url, setUrl] = useState("");
  const { lang } = useLanguage();

  useEffect(() => {
    if (contents) {
      setTitle(contents.title || { th: "", en: "" });
      setDescription(contents.description || { th: "", en: "" });
      setImage(contents.image || {});
      setUrl(contents.url || "");
    } else {
      setTitle({ th: "", en: "" });
      setDescription({ th: "", en: "" });
      setImage({});
      setUrl("");
    }
  }, [contents]);

  const handleSubmit = () => {
    const newContent = {
      title,
      description,
      image: image
        ? image
        : { url: "/images/sections/sample-image-500x210.png" },
      url,
    };

    handleContents(newContent);
  };

  const handleClear = () => {
    setTitle({ th: "", en: "" });
    setDescription({ th: "", en: "" });
    setImage({});
    setUrl("");
    handleClose();
  };

  const handleUpload = (newImages) => {
    const image = newImages[0];
    setImage(image);
  };

  const handleImageRemove = async (fileId) => {
    await deleteFile(fileId);
    setImage({});
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row justify-between items-center bg-orange-500 text-white p-4">
        <h2>
          {newcontent
            ? lang["create"] + lang["content"]
            : lang["edit"] + lang["content"]}
        </h2>
        <button
          onClick={handleClose}
          className="flex flex-row justify-center items-center"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col p-4 gap-2">
        {/* Preview */}
        {image && image.url && (
          <div className="relative shrink-0 w-[200px]">
            <Image
              src={image.url}
              alt="mockup"
              width={500}
              height={500}
              className="w-full h-[200px] object-contain"
              priority
            />
            <button
              onClick={() => handleImageRemove(image.file_id)}
              className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white"
            >
              <IoClose size={24} />
            </button>
          </div>
        )}

        <div>
          <UploadImage size={24} onUpload={handleUpload} folder="sections" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="title">{lang["title"]}</label>
          <div className="flex flex-row gap-2">
            <span>TH:</span>
            <input
              type="text"
              id="title-th"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={title.th}
              onChange={(e) => setTitle({ ...title, th: e.target.value })}
              placeholder="TH"
            />
          </div>
          <div className="flex flex-row gap-2">
            <span>EN:</span>
            <input
              type="text"
              id="description-en"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={title.en}
              onChange={(e) => setTitle({ ...title, en: e.target.value })}
              placeholder="EN"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="description">{lang["description"]}</label>
          <div className="flex flex-row gap-2">
            <span>TH:</span>
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
          </div>

          <div className="flex flex-row gap-2">
            <span>EN:</span>
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
        </div>
        <div className="flex flex-col">
          <label htmlFor="url">{lang["url"]}</label>
          <input
            type="text"
            id="url"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
          />
        </div>

        <div className="flex flex-row items-center justify-center w-full gap-4">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {newcontent ? lang["save"] : lang["edit"]}
          </button>

          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {lang["cencel"]}
          </button>
        </div>
      </div>
    </div>
  );
}

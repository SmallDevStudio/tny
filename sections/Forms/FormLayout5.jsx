import React, { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "@/components/btn/UploadImage";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import ContentForm from "./ContentForm";
import { Divider, Tooltip, Slide, Dialog } from "@mui/material";
import { FaSquarePlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormLayout5({
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
  editMode,
  setEditMode,
  handleSubmit,
}) {
  const [contentsForm, setContentsForm] = useState([
    {
      title: { th: "", en: "" },
      description: { th: "", en: "" },
      image: { url: "" },
      url: "",
    },
  ]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showContentForm, setShowContentForm] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (contents) {
      setContentsForm(contents);
    }
  }, []);

  useEffect(() => {
    setContents(contentsForm);
  }, [contentsForm]);

  const e = (data) => {
    return data?.[language] || "";
  };

  const handleUpload = (newImages) => {
    const image = newImages[0];
    setContentsForm((prev) => [
      ...prev,
      {
        title: { th: "", en: "" },
        description: { th: "", en: "" },
        image,
        url: "",
      },
    ]);
  };

  const handleClear = () => {
    setTitle({});
    setDescription({});
    setContents([]);
    setLanguage("th");
    setEditMode(false);
  };

  const handleAddContentForm = () => {
    setShowContentForm(true);
  };

  const handleCloseContentForm = () => {
    setSelectedContent(null);
    setShowContentForm(false);
  };

  const handleEditContent = (index, content) => {
    setSelectedIndex(index);
    setSelectedContent(content);
    setShowContentForm(true);
  };

  const handleDeleteContent = (index) => {
    setContentsForm((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveContent = (content) => {
    if (selectedIndex !== null) {
      const updated = [...contentsForm];
      updated[selectedIndex] = content;
      setContentsForm(updated); // นี้จะไป update contents ด้วยอัตโนมัติ
    } else {
      setContentsForm((prev) => [...prev, content]);
    }
    setSelectedIndex(null);
    setShowContentForm(false);
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

        <div className="flex flex-row items-center gap-8">
          <div>
            <label htmlFor="gap">{lang["gap"]}</label>
            <input
              type="number"
              name="gap"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={style.gap}
              onChange={(e) => setStyle({ ...style, gap: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="cols">{lang["cols"]}</label>
            <input
              type="number"
              name="cols"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={style.cols}
              onChange={(e) => setStyle({ ...style, cols: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="size">{lang["size"]}</label>
            <input
              type="number"
              name="size"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={style.size}
              onChange={(e) => setStyle({ ...style, size: e.target.value })}
            />
          </div>
        </div>

        {/* Contents */}
        <div className="flex flex-col gap-2 w-full">
          <Divider
            flexItem
            orientation="horizontal"
            textAlign="left"
            style={{
              padding: "10px 0px",
              gap: "10px",
            }}
          >
            <div className="flex flex-row items-center gap-4">
              <span>{lang["content"]}</span>
              <Tooltip title={lang["add_new_content"]} placement="top" arrow>
                <FaSquarePlus
                  size={30}
                  onClick={() => {
                    setSelectedIndex(null);
                    setShowContentForm(true);
                  }}
                />
              </Tooltip>
            </div>
          </Divider>
          {!showContentForm && (
            <div className="flex flex-row flex-wrap gap-8">
              {contentsForm.map((content, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="relative max-w-[200px] h-auto">
                    <Image
                      src={content.image.url}
                      alt="mockup"
                      width={200}
                      height={200}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <h4>{t(content.title)}</h4>
                  <Divider />
                  <div className="flex flex-row items-center justify-end gap-2">
                    <div
                      className="bg-gray-200 hover:bg-gray-500 hover:text-white p-1 rounded-md text-black cursor-pointer"
                      key={idx}
                      onClick={() => handleEditContent(idx, content)}
                    >
                      <CiEdit />
                    </div>
                    <div
                      className="bg-gray-200 hover:bg-gray-500 hover:text-white p-1 rounded-md text-black cursor-pointer"
                      key={idx}
                      onClick={() => handleDeleteContent(idx)}
                    >
                      <RiDeleteBin5Line />
                    </div>
                  </div>
                </div>
              ))}
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

      <Dialog
        fullScreen
        open={showContentForm}
        TransitionComponent={Transition}
        onClose={handleCloseContentForm}
        aria-describedby="alert-dialog-slide-description"
      >
        <ContentForm
          handleClose={handleCloseContentForm}
          contents={selectedIndex !== null ? contentsForm[selectedIndex] : null}
          newcontent={selectedIndex === null}
          handleContents={handleSaveContent}
        />
      </Dialog>
    </div>
  );
}

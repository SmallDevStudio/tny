import React, { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { IoLogoYoutube } from "react-icons/io";
import { Divider, Slide, Dialog } from "@mui/material";
import YoutubeModal from "@/components/modal/YoutubeModal";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormYoutubeShow({
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
  const [youtubeContent, setYoutubeContent] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const { t, lang } = useLanguage();

  const e = (data) => {
    return data?.[language] || "";
  };

  const handleClear = () => {
    setTitle({});
    setDescription({});
    setContents([]);
    setStyle({});
    setYoutubeContent([]);
    setLanguage("th");
    setEditMode(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  console.log("style", style);

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

          <div>
            <label htmlFor="limit">{lang["limit_data"]}</label>
            <input
              type="number"
              name="limit"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={style.limited}
              onChange={(e) => setStyle({ ...style, limited: e.target.value })}
            />
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-bold">
            Youtube
          </label>
          <div className="flex flex-col gap-2 mb-2">
            <div>
              {contents.length > 0 &&
                contents.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 border bg-gray-300 hover:bg-gray-400 py-2 px-6 rounded-xl text-black w-1/2 cursor-pointer"
                  >
                    <span>{item.title}</span>
                    <div className="bg-red-500 hover:bg-red-600 p-1 rounded-full text-white cursor-pointer">
                      <IoClose size={15} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <button
            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-400 p-2 rounded-xl text-black font-bold w-56"
            onClick={handleOpenDialog}
          >
            <div className="flex items-center gap-2">
              <IoLogoYoutube size={40} className="text-red-500" />
              <span>Youtube Managements</span>
            </div>
          </button>
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
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
      >
        <YoutubeModal
          onClose={handleCloseDialog}
          contents={contents}
          setContents={setContents}
        />
      </Dialog>
    </div>
  );
}

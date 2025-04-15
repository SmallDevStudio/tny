import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "@/components/btn/UploadImage";
import Image from "next/image";

export default function FormHearder({
  title,
  setTitle,
  description,
  setDescription,
  image,
  setImage,
  style,
  setStyle,
  language,
  setLanguage,
  setEditMode,
  handleSubmit,
}) {
  const [colorPicker, setColorPicker] = useState(false);
  const [activePicker, setActivePicker] = useState(null);
  const [bgColor, setBgColor] = useState(style?.bgColor || "#757474");
  const [titleColor, setTitleColor] = useState(style?.titleColor || "#f5f2f2");
  const [desecriptionColor, setDescriptionColor] = useState(
    style?.descriptionColor || "#f5f2f2"
  );
  const [tempColor, setTempColor] = useState(style?.color || "#000000");
  const { t, lang } = useLanguage();

  const e = (data) => {
    return data?.[language] || "";
  };

  const handleUpload = (image) => {
    setImage(image[0]);
  };

  const handleClear = () => {
    setTitle({});
    setDescription({});
    setImage({});
    setContents({});
    setLanguage("th");
    setEditMode(false);
  };

  return (
    <div className="w-full">
      {/* Edit Mode */}
      <div className="flex flex-col border border-gray-300 rounded-md p-4 gap-2 shadow-lg">
        <div className="flex flex-col gap-2">
          <label htmlFor="bgColor">Backgroup Color</label>
          <div className="flex flex-row items-center gap-2 relative">
            <label htmlFor="color">{lang["color"]}</label>
            {/* Trigger color picker modal */}
            <div
              className="h-8 w-20 border border-gray-300 rounded-xl cursor-pointer"
              style={{ backgroundColor: style?.bgColor }}
              onClick={() => {
                setBgColor(style?.bgColor || "#000000");
                setActivePicker(activePicker === "bgColor" ? null : "bgColor");
              }}
            />

            {/* Modal Picker */}
            {activePicker === "bgColor" && (
              <div className="absolute z-50 top-full mt-2 left-0 bg-white dark:bg-gray-800 shadow-md border border-gray-300 p-3 rounded-md flex flex-col gap-2">
                {/* Color input */}
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 cursor-pointer"
                />

                {/* Hex input */}
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) =>
                    setBgColor(
                      e.target.value.startsWith("#")
                        ? e.target.value
                        : `#${e.target.value}`
                    )
                  }
                  className="border border-gray-300 rounded-md p-1 w-[100px] text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="#000000"
                />

                {/* Confirm button */}
                <button
                  onClick={() => {
                    setStyle({ ...style, bgColor: bgColor });
                    setActivePicker(null);
                  }}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                >
                  เลือก
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="title">{lang["title"]}</label>
          <div className="flex flex-row items-center justify-between gap-2 w-full">
            <div className="flex flex-row items-center gap-8">
              <div className="flex flex-row items-center gap-2 relative">
                <label htmlFor="color">{lang["color"]}</label>
                {/* Trigger color picker modal */}
                <div
                  className="h-8 w-20 border border-gray-300 rounded-xl cursor-pointer"
                  style={{ backgroundColor: style?.titleColor }}
                  onClick={() => {
                    setTitleColor(style?.titleColor || "#000000");
                    setActivePicker(
                      activePicker === "titleColor" ? null : "titleColor"
                    );
                  }}
                />

                {/* Modal Picker */}
                {activePicker === "titleColor" && (
                  <div className="absolute z-50 top-full mt-2 left-0 bg-white dark:bg-gray-800 shadow-md border border-gray-300 p-3 rounded-md flex flex-col gap-2">
                    {/* Color input */}
                    <input
                      type="color"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="w-10 h-10 cursor-pointer"
                    />

                    {/* Hex input */}
                    <input
                      type="text"
                      value={titleColor}
                      onChange={(e) =>
                        setTitleColor(
                          e.target.value.startsWith("#")
                            ? e.target.value
                            : `#${e.target.value}`
                        )
                      }
                      className="border border-gray-300 rounded-md p-1 w-[100px] text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="#000000"
                    />

                    {/* Confirm button */}
                    <button
                      onClick={() => {
                        setStyle({ ...style, titleColor: titleColor });
                        setActivePicker(null);
                      }}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                    >
                      เลือก
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="fontSize">{lang["fontSize"]}</label>
                <select
                  name="fontSize"
                  id="fontSize"
                  className="border border-gray-200 bg-white p-1 px-4 py-2 rounded-xl"
                  value={style?.titleFontSize}
                  onChange={(e) =>
                    setStyle({ ...style, titleFontSize: e.target.value })
                  }
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="22px">22px</option>
                  <option value="24px">24px</option>
                  <option value="26px">26px</option>
                  <option value="28px">28px</option>
                  <option value="30px">30px</option>
                  <option value="32px">32px</option>
                  <option value="38px">38px</option>
                  <option value="40px">40px</option>
                </select>
              </div>
            </div>
          </div>
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
          <div className="flex flex-row items-center justify-between gap-2 w-full">
            <div className="flex flex-row items-center gap-8">
              <div className="flex flex-row items-center gap-2 relative">
                <label htmlFor="color">{lang["color"]}</label>
                {/* Trigger color picker modal */}
                <div
                  className="h-8 w-20 border border-gray-300 rounded-xl cursor-pointer"
                  style={{ backgroundColor: style?.descriptionColor }}
                  onClick={() => {
                    setDescriptionColor(style?.descriptionColor || "#000000");
                    setActivePicker(
                      activePicker === "descriptionColor"
                        ? null
                        : "descriptionColor"
                    );
                  }}
                />

                {/* Modal Picker */}
                {activePicker === "descriptionColor" && (
                  <div className="absolute z-50 top-full mt-2 left-0 bg-white dark:bg-gray-800 shadow-md border border-gray-300 p-3 rounded-md flex flex-col gap-2">
                    {/* Color input */}
                    <input
                      type="color"
                      value={desecriptionColor}
                      onChange={(e) => setDescriptionColor(e.target.value)}
                      className="w-10 h-10 cursor-pointer"
                    />

                    {/* Hex input */}
                    <input
                      type="text"
                      value={desecriptionColor}
                      onChange={(e) =>
                        setDescriptionColor(
                          e.target.value.startsWith("#")
                            ? e.target.value
                            : `#${e.target.value}`
                        )
                      }
                      className="border border-gray-300 rounded-md p-1 w-[100px] text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="#000000"
                    />

                    {/* Confirm button */}
                    <button
                      onClick={() => {
                        setStyle({
                          ...style,
                          desecriptionColor: desecriptionColor,
                        });
                        setActivePicker(null);
                      }}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                    >
                      เลือก
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="fontSize">{lang["fontSize"]}</label>
                <select
                  name="fontSize"
                  id="fontSize"
                  className="border border-gray-200 bg-white p-1 px-4 py-2 rounded-xl"
                  value={style?.descriptionFontSize}
                  onChange={(e) =>
                    setStyle({ ...style, descriptionFontSize: e.target.value })
                  }
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="22px">22px</option>
                  <option value="24px">24px</option>
                  <option value="26px">26px</option>
                  <option value="28px">28px</option>
                  <option value="30px">30px</option>
                  <option value="32px">32px</option>
                  <option value="38px">38px</option>
                  <option value="40px">40px</option>
                </select>
              </div>
            </div>
          </div>
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

        {/* Upload Image */}
        <div className="flex flex-col gap-2 w-full">
          <div className="relative">
            {image && image.url && (
              <Image
                src={image.url}
                alt="image"
                width={200}
                height={200}
                className="object-cover"
                priority
              />
            )}
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

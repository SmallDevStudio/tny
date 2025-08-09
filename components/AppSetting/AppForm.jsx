import { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { Social } from "../utils/SocialMedia";
import useLanguage from "@/hooks/useLanguage";

export default function ApphtmlForm() {
  const [app, setApp] = useState(null);
  const [shrotDescription, setShortDescription] = useState({
    th: "",
    en: "",
  });
  const [descriptions, setDescriptions] = useState({});
  const [checkedInputs, setCheckedInputs] = useState({});
  const [social, setSocial] = useState({
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    lineUrl: "",
    twitterUrl: "",
    tiktokUrl: "",
  });

  const { subscribe, getById, update } = useDB("appdata");
  const { lang } = useLanguage();

  useEffect(() => {
    const unsubscribe = getById("app", (appData) => {
      if (appData) {
        setSocial({
          facebookUrl: appData?.social?.facebookUrl,
          instagramUrl: appData?.social?.instagramUrl,
          youtubeUrl: appData?.social?.youtubeUrl,
          lineUrl: appData?.social?.lineUrl,
          twitterUrl: appData?.social?.twitterUrl,
          tiktokUrl: appData?.social?.tiktokUrl,
        });
        setCheckedInputs({
          facebookUrl: appData?.social?.facebookUrl ? true : false,
          instagramUrl: appData?.social?.instagramUrl ? true : false,
          youtubeUrl: appData?.social?.youtubeUrl ? true : false,
          lineUrl: appData?.social?.lineUrl ? true : false,
          twitterUrl: appData?.social?.twitterUrl ? true : false,
          tiktokUrl: appData?.social?.tiktokUrl ? true : false,
        });
        setShortDescription({
          th: appData?.shortDescription?.th || "",
          en: appData?.shortDescription?.en || "",
        });
        setDescriptions({
          th: appData?.descriptions?.th,
          en: appData?.descriptions?.en,
        });
        setApp(appData);
      }
    });

    return () => unsubscribe(); // ✅ หยุดฟังเมื่อ component unmount
  }, []);

  const handleSubmit = async () => {
    const data = {
      name: app?.name,
      shortDescription: {
        th: shrotDescription.th,
        en: shrotDescription.en,
      },
      descriptions: {
        th: descriptions.th,
        en: descriptions.en,
      },
      social: {
        facebookUrl: social.facebookUrl || null,
        instagramUrl: social.instagramUrl || null,
        youtubeUrl: social.youtubeUrl || null,
        lineUrl: social.lineUrl || null,
        twitterUrl: social.twitterUrl || null,
        tiktokUrl: social.tiktokUrl || null, // ✅ เพิ่ม tiktokUrl ด้วย
      },
    };

    try {
      await update("app", data);
      toast.success("บันทึกข้อมูลสำเร็จแล้ว!");
    } catch (error) {
      console.log(error);
      toast.error("บันทึกขอมูลไม่สำเร็จ!");
    }
  };

  const handleCheckBox = (e, input) => {
    const isChecked = e.target.checked;
    setCheckedInputs((prev) => ({
      ...prev,
      [input]: isChecked,
    }));
  };

  const handleInputChange = (e, input) => {
    const value = e.target.value;
    setSocial((prev) => ({
      ...prev,
      [input]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-2 mt-4 sm:grid-cols-2 sm:gap-2">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          ข้อมูล Applications
        </h1>
        <span className="text-gray-500">จัดการข้อมูล application</span>
      </div>

      <div className="flex flex-col gap-2 mt-2 sm:grid-cols-2 sm:gap-4">
        <Tooltip title={"กรอกชื่อ application"} placement={"top-start"} arrow>
          <div className="flex flex-row items-center gap-2 w-full">
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="ชื่อ Applications"
              value={app?.name}
              onChange={(e) => setApp({ ...app, name: e.target.value })}
            />
          </div>
        </Tooltip>
        <div className="w-full">
          <label
            htmlFor="shortDescription"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            {lang["shortDescription"]}:
          </label>
          <div className="flex flex-col items-center gap-2 sm:flex-row ">
            <Tooltip
              title={lang["shortDescription_placeholder"] + " " + lang["Th"]}
              placement={"top-start"}
              arrow
            >
              <input
                type="text"
                name="shortDescription_th"
                id="shortDescription_th"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={
                  lang["shortDescription_placeholder"] + " " + lang["Th"]
                }
                onChange={(e) =>
                  setShortDescription({
                    ...shrotDescription,
                    th: e.target.value,
                  })
                }
                value={shrotDescription?.th}
              />
            </Tooltip>

            <Tooltip
              title={lang["shortDescription_placeholder"] + " " + lang["En"]}
              placement={"top-start"}
              arrow
            >
              <input
                type="text"
                name="shortDescription_en"
                id="shortDescription_en"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={
                  lang["shortDescription_placeholder"] + " " + lang["En"]
                }
                onChange={(e) =>
                  setShortDescription({
                    ...shrotDescription,
                    en: e.target.value,
                  })
                }
                value={shrotDescription?.en}
              />
            </Tooltip>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="description"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Descriptions:
          </label>
          <div className="flex flex-col items-center gap-2 sm:flex-row ">
            <Tooltip
              title={"กรอกรายละเอียด (ภาษาไทย)"}
              placement={"top-start"}
              arrow
            >
              <textarea
                type="text"
                name="description_th"
                id="description_th"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="รายละเอียด (ภาษาไทย)"
                rows={2}
                onChange={(e) =>
                  setDescriptions({ ...descriptions, th: e.target.value })
                }
                value={descriptions?.th}
              />
            </Tooltip>

            <Tooltip
              title={"กรอกรายละเอียด (ภาษาอังกฤษ)"}
              placement={"top-start"}
              arrow
            >
              <textarea
                type="text"
                name="description_en"
                id="description_en"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="รายละเอียด (ภาษาอังกฤษ)"
                rows={2}
                onChange={(e) =>
                  setDescriptions({ ...descriptions, en: e.target.value })
                }
                value={descriptions?.en}
              />
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          {Social.map((item, index) => (
            <div key={index} className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checkedInputs[item?.input]}
                  onChange={(e) => handleCheckBox(e, item?.input)}
                />
                {item?.icon} {item?.label}
              </div>
              {checkedInputs[item.input] && (
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={`Enter ${item?.label} URL`}
                  value={social[item.input]}
                  onChange={(e) => handleInputChange(e, item.input)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4 sm:grid-cols-2 sm:gap-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-20"
          onClick={handleSubmit}
        >
          บันทึก
        </button>
      </div>
    </div>
  );
}

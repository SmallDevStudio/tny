import { useState } from "react";
import { Tooltip } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { changeLanguage } from "@/store/slices/languageSlice";
import useLanguage from "@/hooks/useLanguage";

export default function LangButton({ isText }) {
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useLanguage();

  const flag = [
    { name: "English", code: "en", flag: "/images/flags/en.png" },
    { name: "ไทย", code: "th", flag: "/images/flags/th.png" },
  ];

  const selectedFlag = flag.find((item) => item.code === language);

  return (
    <div className="relative inline-block">
      <Tooltip title={lang["changelanguage"]} placement="bottom">
        <div
          className="flex items-center justify-between text-sm dark:bg-white dark:text-black border border-gray-300 rounded-full px-3 py-1.5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src={selectedFlag?.flag}
            alt={selectedFlag?.name}
            width={20}
            height={20}
            className={isText ? "mr-2" : ""}
            priority
          />
          {isText ? (
            <span>{selectedFlag?.name}</span>
          ) : (
            <span className="ml-2 uppercase">{selectedFlag?.code}</span>
          )}
          <IoIosArrowDown className="ml-2 text-gray-500" />
        </div>
      </Tooltip>

      {isOpen && (
        <ul className="absolute left-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {flag.map((item) => (
            <li
              key={item.code}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                dispatch(changeLanguage(item.code));
                setIsOpen(false);
              }}
            >
              <Image
                src={item.flag}
                alt={item.name}
                width={20}
                height={20}
                priority
              />
              <span className="text-sm text-black">{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

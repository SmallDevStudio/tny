import Image from "next/image";
import Link from "next/link";
import useLanguage from "@/hooks/useLanguage";
import { Social } from "@/components/utils/SocialMedia"; // ✅ นำเข้า Social Icons
import { Tooltip } from "@mui/material";

export default function Footer() {
  const { lang } = useLanguage();
  return (
    <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          {lang["conact_us"]}
        </span>
        <Link
          href="#"
          className="flex justify-center items-center text-2xl mt-2 font-semibold text-orange-500 dark:text-white"
        >
          THE NEW YOU CO., LTD.
        </Link>
        <p className="mb-4 font-light text-sm lg:text-lg text-gray-500 dark:text-gray-400">
          {lang["contact_desc"]}
        </p>
        <div className="flex-row items-center self-center text-sm mb-6 lg:text-xl">
          <span className="mr-2">
            โทร :{" "}
            <Link href="tel:0989145443" className="hover:text-orange-500">
              098-914-5443
            </Link>
          </span>
          |
          <span className="ml-2">
            Email:{" "}
            <Link
              href="mailto:thenewyou.pa@gmail.com"
              className="hover:text-orange-500"
            >
              thenewyou.pa@gmail.com
            </Link>
          </span>
        </div>

        {/* Social media */}
        <ul className="flex flex-wrap justify-center items-center mb-5 text-gray-500 dark:text-white gap-8">
          {Social.map((item, index) => (
            <li key={index}>
              <Tooltip title={item.name} placement="top" arrow>
                <Link href="#" className="hover:text-orange-500">
                  {item.icon} {/* ✅ ใช้ไอคอนจาก Social */}
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>

        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025{" "}
          <Link href="#" className="hover:underline">
            The New You™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

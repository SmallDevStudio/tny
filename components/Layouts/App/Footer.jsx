import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import useLanguage from "@/hooks/useLanguage";
import { Social } from "@/components/utils/SocialMedia"; // ✅ ไอคอน social
import { Tooltip } from "@mui/material";

export default function Footer() {
  const [app, setApp] = useState({});
  const [company, setCompany] = useState({});
  const { t, lang } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "appdata"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id === "app") {
          setApp(data); // ✅ เก็บข้อมูล app (มี social)
        } else if (doc.id === "company") {
          setCompany(data); // ✅ เก็บข้อมูลบริษัท
        }
      });
    }
    fetchData();
  }, []);

  // ✅ แมพ social และ url
  const socialLinks = [
    { name: "facebook", url: app?.social?.facebookUrl },
    { name: "instagram", url: app?.social?.instagramUrl },
    { name: "twitter", url: app?.social?.twitterUrl },
    { name: "youtube", url: app?.social?.youtubeUrl },
    { name: "tiktok", url: app?.social?.tiktokUrl },
    { name: "line", url: app?.social?.lineUrl },
  ];

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
          {company?.name?.en}
        </Link>

        <p className="mb-4 font-light text-sm lg:text-lg text-gray-500 dark:text-gray-400">
          {lang["contact_desc"]}
        </p>

        <p className="mb-4 font-light text-sm lg:text-lg text-gray-800 dark:text-gray-400">
          {t(company?.address)}
        </p>

        <div className="flex-row items-center self-center text-sm mb-6 lg:text-xl">
          <span className="mr-2">
            โทร :{" "}
            <Link
              href={`tel:${company?.phone}`}
              className="hover:text-orange-500"
            >
              {company?.phone}
            </Link>
          </span>
          |
          <span className="ml-2">
            Email:{" "}
            <Link
              href={`mailto:${company?.email}`}
              className="hover:text-orange-500"
            >
              {company?.email}
            </Link>
          </span>
        </div>

        {/* Social Media */}
        <ul className="flex flex-wrap justify-center items-center mb-5 text-gray-500 dark:text-white gap-8">
          {Social.map((item, index) => {
            const found = socialLinks.find(
              (s) => s.name === item.name && s.url
            );
            if (!found) return null; // ❌ ถ้าไม่มี url ไม่ต้องแสดง

            return (
              <li key={index}>
                <Tooltip title={item.name} placement="top" arrow>
                  <Link
                    href={found.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-500"
                  >
                    {item.icon}
                  </Link>
                </Tooltip>
              </li>
            );
          })}
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

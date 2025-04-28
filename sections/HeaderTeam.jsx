import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Social } from "@/components/utils/SocialMedia";
import useLanguage from "@/hooks/useLanguage";

export default function HeaderTeam({ pageData }) {
  const { t, language } = useLanguage();

  return (
    <section className="max-w-screen-lg mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <div>
          <Image
            className="object-contain"
            src={pageData?.image?.url}
            alt={pageData?.name?.en + "-" + " image"}
            width={200}
            height={200}
          />
        </div>
        <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
          {t(pageData?.name)}
        </h2>
        <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
          {t(pageData?.position)}
        </p>
        <div className="flex mt-4 space-x-6">
          <ul className="flex flex-wrap justify-center items-center text-gray-500 dark:text-white gap-8">
            {Social.map((item, index) => (
              <li key={index}>
                <Link href="" target="_blank" rel="noopener noreferrer">
                  {item.icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex tracking-tight mx-auto mt-8">
          {t(pageData?.bio)}
        </div>
      </div>
    </section>
  );
}

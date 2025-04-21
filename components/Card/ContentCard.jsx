import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";

export default function ContentCard({ item }) {
  const { t, lang } = useLanguage();
  const router = useRouter();

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm flex flex-col h-[300px] cursor-pointer">
      {/* IMAGE/VIDEO THUMBNAIL */}
      <div className="flex relative w-full h-[150px] bg-white">
        <Image
          src={item.image.url}
          alt={item.title.en}
          width={700}
          height={700}
          className="object-cover"
        />
      </div>

      {/* TEXT + TAG */}
      <div className="p-2 flex flex-col justify-between flex-1">
        <div>
          <p className="text-md text-[#0056FF] font-semibold line-clamp-3 leading-tight text-left">
            {t(item.title)}
          </p>
          <span className="text-sm text-gray-600 font-light line-clamp-3 leading-tight text-left">
            {t(item.description)}
          </span>
        </div>

        <div className="flex justify-center items-center mt-2 mb-2">
          <button className="bg-orange-500 px-6 py-2 font-bold text-white rounded-md hover:bg-orange-600">
            {lang["read_more"]}
          </button>
        </div>
      </div>
    </div>
  );
}

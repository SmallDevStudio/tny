import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";

export default function Team() {
  const [teams, setTeams] = useState([]);
  const [visibleTeams, setVisibleTeams] = useState(6); // เริ่มต้นแสดง 6 คน
  const [isExpanded, setIsExpanded] = useState(false); // ตรวจสอบว่าแสดงทั้งหมดหรือไม่
  const { lang, t } = useLanguage();
  const { subscribe } = useDB("teams");

  useEffect(() => {
    const unsubscribe = subscribe((teamData) => {
      // ✅ ใช้ `.slice()` ก่อน `.sort()` เพื่อป้องกันการเปลี่ยนแปลง state โดยตรง
      setTeams([...teamData].slice().sort((a, b) => a.order - b.order));
    });

    return () => unsubscribe();
  }, []);

  // ✅ ฟังก์ชันจัดการ Show More / Show Less
  const toggleShowMore = () => {
    if (isExpanded) {
      setVisibleTeams(6); // กลับไปแสดงแค่ 6 คน
    } else {
      setVisibleTeams(teams.length); // แสดงทั้งหมด
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-orange-500">
            รู้จัก The NEW YOU RENGER
          </h2>
        </div>

        {/* Desktop: Grid, Mobile: Horizontal Scroll */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 place-items-center">
          {teams.slice(0, visibleTeams).map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-full max-w-[300px] p-4 transition-transform transform hover:scale-105"
            >
              <Link href="#">
                <Image
                  className="w-32 h-32 rounded-full"
                  src={item.image.url}
                  alt={t(item.name)}
                  width={200}
                  height={200}
                  loading="lazy"
                />
              </Link>
              <div className="p-5 text-center">
                <h3 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                  <Link href="#">{t(item.name)}</Link>
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {t(item.bio)}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Show More / Show Less Button */}
        {teams.length > 6 && (
          <div className="flex justify-center mt sm-hidden">
            <button
              className="px-4 py-2 bg-orange-500 text-white font-semibold text-md rounded-2xl hover:bg-orange-600"
              onClick={toggleShowMore}
            >
              {isExpanded ? lang["show_less"] : lang["show_more"]}
            </button>
          </div>
        )}

        {/* Mobile: Horizontal Scroll with Touch Support */}
        <div className="lg:hidden team flex overflow-x-auto gap-2 pb-4 snap-x snap-mandatory touch-pan-x scrollbar-hide">
          {teams.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center min-w-[250px] sm:min-w-[300px] snap-start p-2 transition-transform transform hover:scale-105"
            >
              <Link href="#">
                <Image
                  className="w-32 h-32 rounded-full"
                  src={item.image.url}
                  alt={t(item.name)}
                  width={200}
                  height={200}
                  loading="lazy"
                />
              </Link>
              <div className="p-2 text-center">
                <h3 className="text-md font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
                  <Link href="#">{t(item.name)}</Link>
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {t(item.bio)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

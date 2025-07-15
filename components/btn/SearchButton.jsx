import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoSearch, IoClose } from "react-icons/io5";
import { Tooltip } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import useDB from "@/hooks/useDB";
import Image from "next/image";

export default function SearchButton({ size }) {
  const [courses, setCourses] = useState(null);
  const [filterCourses, setFilterCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { subscribe } = useDB("courses");

  useEffect(() => {
    const unsubscribe = subscribe((coursesData) => {
      if (coursesData) {
        const sorted = coursesData.sort(
          (a, b) => (a.order ?? 9999) - (b.order ?? 9999)
        );
        setCourses(sorted);
        setFilterCourses(sorted);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchTerm && courses) {
      const term = searchTerm.toLowerCase();

      const filtered = courses.filter((course) => {
        const titleMatch =
          course?.name?.th?.toLowerCase().includes(term) ||
          course?.name?.en?.toLowerCase().includes(term);

        const descMatch =
          course?.description?.th?.toLowerCase().includes(term) ||
          course?.description?.en?.toLowerCase().includes(term);

        const tagsMatch = (course?.tags || []).some((tag) =>
          tag.toLowerCase().includes(term)
        );

        return titleMatch || descMatch || tagsMatch;
      });

      setFilterCourses(filtered);
    } else {
      setFilterCourses(null);
    }
  }, [searchTerm, courses]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilterCourses(null);
    }
  }, [searchTerm]);

  const handleOpenSearch = () => {
    setSearchTerm("");
    setFilterCourses(null);
    setOpen(true);
  };

  const handleCloseSearch = () => {
    setSearchTerm("");
    setFilterCourses(null);
    setOpen(false);
  };

  return (
    <div className="relative">
      {open ? (
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-1 rounded-full border border-gray-300">
          <div className="relative w-[250px]">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-[250px] md:w-[200px] bg-white dark:bg-gray-800 border-none outline-none px-4 py-1 rounded-full text-sm"
            />
            <IoSearch
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <IoClose
            size={22}
            onClick={handleCloseSearch}
            className="cursor-pointer text-gray-600 hover:text-orange-500"
          />
        </div>
      ) : (
        <Tooltip title={lang["search"]} placement="bottom" arrow>
          <IoSearch
            size={size}
            onClick={handleOpenSearch}
            className="text-gray-600 hover:text-orange-500 dark:text-white dark:hover:text-orange-500 cursor-pointer"
          />
        </Tooltip>
      )}

      {/* 🔽 Dropdown Results */}
      {filterCourses && filterCourses.length > 0 && open && (
        <div className="absolute left-0 mt-2 w-[300px] max-h-[400px] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg z-50">
          {filterCourses.map((course) => (
            <div
              key={course?.id}
              className="flex items-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                router.push(`/courses/${course.group}/${course.slug}`);
                handleCloseSearch();
              }}
            >
              <Image
                src={course?.image?.url}
                alt={t(course?.name)}
                width={50}
                height={50}
                className="rounded-md object-cover"
              />
              <div className="flex flex-col w-full">
                <span className="font-semibold text-orange-500 text-sm">
                  {t(course?.name)}
                </span>
                <span
                  className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t(course?.description)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

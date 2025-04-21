import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import classNames from "classnames";

export default function HightLight({ item }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === item.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, item]);

  const handleClick = (index) => {
    setCurrentIndex(index);
  };

  const currentItem = item[currentIndex];

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-4 mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start h-[450px]">
          {/* SELECT HIGHLIGHT */}
          <div className="relative w-full md:w-3/4 h-full overflow-hidden rounded-lg shadow-md">
            <Image
              src={currentItem.image.url}
              alt={currentItem.title.en}
              layout="fill"
              className="object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <h2 className="text-xl font-semibold line-clamp-2">
                {t(currentItem.title)}
              </h2>
              <p className="text-sm line-clamp-2">
                {t(currentItem.description)}
              </p>
            </div>
          </div>

          {/* HIGHLIGHT ITEMS */}
          <div className="flex md:flex-col gap-2 w-full md:w-1/4 h-full overflow-x-hidden md:overflow-y-auto">
            {item.map((itm, index) => (
              <div
                key={itm.id}
                onClick={() => handleClick(index)}
                className={classNames(
                  "relative w-[33.33%] md:w-full aspect-[4/3] cursor-pointer rounded-md overflow-hidden border transition-all duration-300",
                  {
                    "border-orange-500 ring-2 ring-orange-400":
                      index === currentIndex,
                    "hover:scale-105": index !== currentIndex,
                  }
                )}
              >
                <Image
                  src={itm.image.url}
                  alt={itm.title.en}
                  layout="fill"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-white/70 p-1 text-xs text-black line-clamp-1">
                  {t(itm.title)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

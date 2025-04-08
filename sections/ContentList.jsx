import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";

export default function ContentList({ data, editMode, language }) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [images, setImages] = useState([]);
  const [row, setRow] = useState(2);

  const { t } = useLanguage();

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setImages(
        data.image
          ? data.image
          : [{ url: "/images/sections/sample-bg-1000x412.png" }]
      );
      setRow(data.row ? data.row : 2);
    }
  }, [data]);

  const e = (data) => {
    return data?.[language] || "";
  };

  return (
    <section class="bg-white dark:bg-gray-800 w-full">
      <div className="py-4 px-4 w-full lg:py-6 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-1 ">
          <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
            {editMode ? e(title) : t(title)}
          </h2>
          <p className="font-light text-gray-500 text-sm lg:text-md dark:text-gray-400">
            {editMode ? e(description) : t(description)}
          </p>
        </div>
      </div>
      <div
        className={`grid max-w-screen-xl px-4 py-4 mx-auto lg:gap-2 xl:gap-0 lg:py-2 lg:grid-cols-${row}`}
      >
        {images &&
          images.length > 0 &&
          images.map((image, index) => (
            <div
              key={index}
              className="relative hover:scale-105 transition-all duration-500 ease-in-out hover:z-50 active:z-50"
            >
              <Image
                src={image.url}
                alt={`image-${index}`}
                width={700}
                height={700}
                loading="lazy"
                className="w-full h-full object-contain cursor-pointer"
              />
            </div>
          ))}
      </div>
    </section>
  );
}

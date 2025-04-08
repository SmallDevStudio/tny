import { useState, useEffect } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";

export default function Header({ data, editMode, language }) {
  const [title, setTitle] = useState({});
  const [description, setDescription] = useState({});
  const [images, setImages] = useState([]);
  const [row, setRow] = useState(2);
  const [tagColor, setTagColor] = useState("#757474");
  const [tagColor2, setTagColor2] = useState("#f5f2f2");

  const { t } = useLanguage();

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setImages(
        data.image
          ? data.image
          : { url: "/images/sections/sample-bg-1000x412.png" }
      );
      setRow(data.row ? data.row : 2);
    }
  }, [data]);

  const e = (data) => {
    return data?.[language] || "";
  };

  return (
    <section class="bg-white dark:bg-gray-800 w-full">
      <div
        className={`flex justify-center items-center w-full py-12`}
        style={{
          backgroundColor: tagColor,
        }}
      >
        <div className="flex flex-row mx-auto max-w-screen-lg gap-8 px-6">
          <div className="flex flex-col justify-center text-center gap-2 mx-auto">
            <h2
              className={`text-2xl lg:text-4xl tracking-tight font-extrabold dark:text-orange-500`}
              style={{
                color: tagColor2,
              }}
            >
              {editMode ? e(title) : t(title)}
            </h2>
            <p
              className={`font-light text-sm lg:text-md dark:text-gray-400`}
              style={{
                color: tagColor2,
              }}
            >
              {editMode ? e(description) : t(description)}
            </p>
          </div>
          <div className="hidden lg:flex md:flex xl:flex w-[200px] h-auto ">
            <Image
              src={images.url}
              width={500}
              height={500}
              alt="sample image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

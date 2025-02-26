import ImageTextSection from "./ImageTextSection";
import TextImageSection from "./TextImageSection";

export const Sections = [
    {
        name: "ImageTextSection", 
        description: {
            en: "image and text",
            th: "รูปและข้อความ",
        },
        thumbnail: "/images/thumbnail/ImageTextSection.png",
        component: ImageTextSection,
    },

    {
        name: "TextImageSection", 
        description: {
            en: "text and image",
            th: "ข้อความและรูป",
        },
        thumbnail: "/images/thumbnail/TextImageSection.png",
        component: TextImageSection,
    },
];


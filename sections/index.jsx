import Carousel from "./Carousel";
import Team from "./Team";
import Layout1 from "./Layout1";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";
import Layout4 from "./Layout4";
import Header from "./Header";
import ContentList from "./ContentList";

export const Sections = [
  {
    name: "carousel",
    description: {
      en: "slide show",
      th: "สไลด์โชว์",
    },
    thumbnail: "/images/sections/previews/carousel.png",
    component: Carousel,
  },
  {
    name: "layout1",
    description: {
      en: "image and text",
      th: "รูปและข้อความ",
    },
    thumbnail: "/images/sections/previews/layout1.png",
    component: Layout1,
  },
  {
    name: "layout2",
    description: {
      en: "text and image",
      th: "ข้อความและรูป",
    },
    thumbnail: "/images/sections/previews/layout2.png",
    component: Layout2,
  },
  {
    name: "layout3",
    description: {
      en: "image background and text",
      th: "พื้นหลังและข้อความ",
    },
    thumbnail: "/images/sections/previews/layout3.png",
    component: Layout3,
  },
  {
    name: "layout4",
    description: {
      en: "image",
      th: "รูปภาพ",
    },
    thumbnail: "/images/sections/previews/layout4.png",
    component: Layout4,
  },
  {
    name: "team",
    description: {
      en: "show team",
      th: "แสดงทีม",
    },
    thumbnail: "/images/sections/previews/team.png",
    component: Team,
  },

  {
    name: "header",
    description: {
      en: "show header",
      th: "แสดงหัวข้อ",
    },
    thumbnail: "/images/sections/previews/header.png",
    component: Header,
  },

  {
    name: "contentList",
    description: {
      en: "show content list",
      th: "แสดงรายการเนื้อหา",
    },
    thumbnail: "/images/sections/previews/contentList.png",
    component: ContentList,
  },
];

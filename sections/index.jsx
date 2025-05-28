import Carousel from "./Carousel";
import Team from "./Team";
import Layout1 from "./Layout1";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";
import Layout4 from "./Layout4";
import Layout5 from "./Layout5";
import Header from "./Header";
import ContentList from "./ContentList";
import ContentListImage from "./ContentListImage";
import HightLight from "./HightLight";
import FixHightLight from "./FixHightLight";
import ContentHightLight from "./ContentHightLight";
import ShortHightLight from "./ShortHightLight";
import YoutubeShow from "./YoutubeShow";
import HeaderCourses from "./HeaderCourses";
import Contents from "./Contents";
import FooterCourses from "./FooterCourses";
import HeaderTeam from "./HeaderTeam";
import Customs from "./Customs";

export const Sections = [
  {
    name: "carousel",
    description: {
      en: "slide show",
      th: "สไลด์โชว์",
    },
    thumbnail: "/images/sections/previews/carousel.png",
    component: Carousel,
    group: "slideshow",
  },
  {
    name: "layout1",
    description: {
      en: "image and text",
      th: "รูปและข้อความ",
    },
    thumbnail: "/images/sections/previews/layout1.png",
    component: Layout1,
    group: "layout",
  },
  {
    name: "layout2",
    description: {
      en: "text and image",
      th: "ข้อความและรูป",
    },
    thumbnail: "/images/sections/previews/layout2.png",
    component: Layout2,
    group: "layout",
  },
  {
    name: "layout3",
    description: {
      en: "image background and text",
      th: "พื้นหลังและข้อความ",
    },
    thumbnail: "/images/sections/previews/layout3.png",
    component: Layout3,
    group: "layout",
  },
  {
    name: "layout4",
    description: {
      en: "image",
      th: "รูปภาพ",
    },
    thumbnail: "/images/sections/previews/layout4.png",
    component: Layout4,
    group: "layout",
  },
  {
    name: "layout5",
    description: {
      en: "image",
      th: "รูปภาพ",
    },
    thumbnail: "/images/sections/previews/layout5.png",
    component: Layout5,
    group: "layout",
  },
  {
    name: "team",
    description: {
      en: "show team",
      th: "แสดงทีม",
    },
    thumbnail: "/images/sections/previews/team.png",
    component: Team,
    group: "layout",
  },

  {
    name: "header",
    description: {
      en: "show header",
      th: "แสดงหัวข้อ",
    },
    thumbnail: "/images/sections/previews/header.png",
    component: Header,
    group: "header",
  },
  {
    name: "hightlight",
    description: {
      en: "content hightlight",
      th: "เนื้อหาสําคัญ",
    },
    thumbnail: "/images/sections/previews/hightlight.png",
    component: HightLight,
    group: "hightlight",
  },
  {
    name: "fixHightlight",
    description: {
      en: "content hightlight",
      th: "เนื้อหาสําคัญ",
    },
    thumbnail: "/images/sections/previews/hightlight.png",
    component: FixHightLight,
    group: "hightlight",
  },
  {
    name: "contentHightlight",
    description: {
      en: "content hightlight",
      th: "เนื้อหาสําคัญ",
    },
    thumbnail: "/images/sections/previews/contentHightlight.png",
    component: ContentHightLight,
    group: "hightlight",
  },
  {
    name: "shortHightlight",
    description: {
      en: "content hightlight",
      th: "เนื้อหาสําคัญ",
    },
    thumbnail: "/images/sections/previews/shortHightlight.png",
    component: ShortHightLight,
    group: "hightlight",
  },
  {
    name: "contentList",
    description: {
      en: "show content list",
      th: "แสดงรายการเนื้อหา",
    },
    thumbnail: "/images/sections/previews/contentList.png",
    component: ContentList,
    group: "content",
  },
  {
    name: "contentListImage",
    description: {
      en: "show content list",
      th: "แสดงรายการเนื้อหา",
    },
    thumbnail: "/images/sections/previews/contentListImage.png",
    component: ContentListImage,
    group: "content",
  },
  {
    name: "youtubeShow",
    description: {
      en: "show content list",
      th: "แสดงรายการเนื้อหา",
    },
    thumbnail: "/images/sections/previews/youtubeShow.png",
    component: YoutubeShow,
    group: "media",
  },
  {
    name: "headerCourses",
    description: {
      en: "Header for Courses",
      th: "ส่วนหัวเพจ courses",
    },
    thumbnail: "/images/sections/previews/headerCourses.png",
    component: HeaderCourses,
    group: "courses",
  },
  {
    name: "contents",
    description: {
      en: "show content",
      th: "แสดงเนื้อหา",
    },
    thumbnail: "/images/sections/previews/contents.png",
    component: Contents,
    group: "content",
  },
  {
    name: "customs",
    description: {
      en: "show content",
      th: "แสดงเนื้อหา",
    },
    thumbnail: "/images/sections/previews/contents.png",
    component: Customs,
    group: "content",
  },
  {
    name: "footerCourses",
    description: {
      en: "Footer for Courses",
      th: "ส่วนท้ายเพจ Courses",
    },
    thumbnail: "/images/sections/previews/headerCourses.png",
    component: FooterCourses,
    group: "courses",
  },
  {
    name: "headerTeam",
    description: {
      en: "Header for Team",
      th: "ส่วนหัวเพจ Team",
    },
    thumbnail: "/images/sections/previews/headerTeam.png",
    component: HeaderTeam,
    group: "team",
  },
];

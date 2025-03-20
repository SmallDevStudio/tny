import Hero from "./Hero";
import Content from "./Content";
import Blockquote from "./Blockquote";
import BlogSection from "./BlogSection";
import Carousel from "./Carousel";
import ContectForm from "./ContectForm";
import CustomerLogos from "./CustomerLogos";
import FAQ from "./FAQ";
import Feature from "./Feature";
import Team from "./Team";
import Price from "./Price";
import NewsLetter from "./NewsLetter";
import Courses from "./Courses";
import Trainings from "./Trainings";
import Partner from "./Partner";
import ExCourses from "./ExCourses";
import Fixed from "./Fixed";

export const Sections = [
  {
    name: "hero",
    description: {
      en: "image and text",
      th: "รูปและข้อความ",
    },
    thumbnail: "/images/sections/hero.png",
    component: Hero,
    content_data: true,
  },
  {
    name: "content",
    description: {
      en: "image and text",
      th: "รูปและข้อความ",
    },
    thumbnail: "/images/sections/content.png",
    component: Content,
  },
  {
    name: "blockquote",
    description: {
      en: "image, text, and quote",
      th: "รูป, ข้อความ และคําถาม",
    },
    thumbnail: "/images/sections/blockquote.png",
    component: Blockquote,
  },
  {
    name: "blogSection",
    description: {
      en: "show block",
      th: "แสดงบล็อก",
    },
    thumbnail: "/images/sections/blogsection.png",
    component: BlogSection,
  },
  {
    name: "carousel",
    description: {
      en: "slide show",
      th: "สไลด์โชว์",
    },
    thumbnail: "/images/sections/carousel.png",
    component: Carousel,
  },
  {
    name: "contectForm",
    description: {
      en: "Contect Form",
      th: "แบบฟอร์มติดต่อ",
    },
    thumbnail: "/images/sections/contectform.png",
    component: ContectForm,
  },
  {
    name: "customerLogos",
    description: {
      en: "show logo",
      th: "แสดงโลโก้",
    },
    thumbnail: "/images/sections/customerlogos.png",
    component: CustomerLogos,
  },
  {
    name: "faq",
    description: {
      en: "FAQ image and text",
      th: "คําถามที่พบบ่อย",
    },
    thumbnail: "/images/sections/faq.png",
    component: FAQ,
  },
  {
    name: "feature",
    description: {
      en: "show feature",
      th: "แสดงฟีเจอร์",
    },
    thumbnail: "/images/sections/feature.png",
    component: Feature,
  },
  {
    name: "team",
    description: {
      en: "show teams",
      th: "แสดงทีม",
    },
    thumbnail: "/images/sections/team.png",
    component: Team,
  },
  {
    name: "price",
    description: {
      en: "show price",
      th: "แสดงราคา",
    },
    thumbnail: "/images/sections/price.png",
    component: Price,
  },
  {
    name: "newsLetter",
    description: {
      en: "News Letter Form",
      th: "แบบฟอร์มรับข่าวสาร",
    },
    thumbnail: "/images/sections/newsletter.png",
    component: NewsLetter,
  },
  {
    name: "courses",
    description: {
      en: "Show Images",
      th: "แสดงรูปภาพ",
    },
    thumbnail: "/images/sections/courses.png",
    component: Courses,
  },
  {
    name: "training",
    description: {
      en: "Show Images add Text",
      th: "แสดงรูปภาพ และข้อความ",
    },
    thumbnail: "/images/sections/training.png",
    component: Trainings,
  },
  {
    name: "partner",
    description: {
      en: "Show Images",
      th: "แสดงรูปภาพ",
    },
    thumbnail: "/images/sections/partner.png",
    component: Partner,
  },
  {
    name: "exCourses",
    description: {
      en: "Show Images",
      th: "แสดงรูปภาพ",
    },
    thumbnail: "/images/sections/excourses.png",
    component: ExCourses,
  },
  {
    name: "fixed",
    description: {
      en: "Popup Menu",
      th: "แสดงรูปภาพ",
    },
    thumbnail: "/images/sections/fixed.png",
    component: Fixed,
  },
];

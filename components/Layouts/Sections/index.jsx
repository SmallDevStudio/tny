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

export const Sections = [
    {name: "hero", component: Hero},
    {name: "content", component: Content},
    {name: "blockquote", component: Blockquote},
    {name: "blogSection", component: BlogSection},
    {name: "carousel", component: Carousel},
    {name: "contectForm", component: ContectForm},
    {name: "customerLogos", component: CustomerLogos},
    {name: "faq", component: FAQ},
    {name: "feature", component: Feature},
    {name: "team", component: Team},
    {name: "price", Price},
    {name: "newsLetter", component: NewsLetter}
];

const getSectionComponent = (sectionName) => {
    return Sections.find((section) => section.name === sectionName) || [{name: sectionName}];
};

export default getSectionComponent;


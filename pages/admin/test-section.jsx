import Hero from "@/components/Layouts/Sections/Hero";
import Content from "@/components/Layouts/Sections/Content";
import Blockquote from "@/components/Layouts/Sections/Blockquote";
import BlogSection from "@/components/Layouts/Sections/BlogSection";
import Carousel from "@/components/Layouts/Sections/Carousel";
import ContectForm from "@/components/Layouts/Sections/ContectForm";
import CustomerLogos from "@/components/Layouts/Sections/CustomerLogos";
import FAQ from "@/components/Layouts/Sections/FAQ";
import Feature from "@/components/Layouts/Sections/Feature";
import Team from "@/components/Layouts/Sections/Team";
import Price from "@/components/Layouts/Sections/Price";
import NewsLetter from "@/components/Layouts/Sections/NewsLetter";

export default function TestSection() {
    return (
        <div>
            <Hero />
            <Content />
            <Blockquote />
            <BlogSection />
            <Carousel />
            <ContectForm />
            <CustomerLogos />
            <FAQ />
            <Feature />
            <Team />
            <Price />
            <NewsLetter />
        </div>
    );
}
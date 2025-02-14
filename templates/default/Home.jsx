import React from "react";
import { useRouter } from "next/router";
import HomeHeader from "@/layouts/Sections/HomeHeader";
import Footer from "@/components/Layouts/App/Footer";
import Header from "@/components/Layouts/App/Header";
import Hero from "@/components/Layouts/App/Hero";
import Content from "@/components/Layouts/App/Content";
import Feature from "@/components/Layouts/App/Feature";
import Team from "@/components/Layouts/App/Team";
import Price from "@/components/Layouts/App/Price";
import NewsLetter from "@/components/Layouts/App/NewsLetter";
import BlogSection from "@/components/Layouts/App/BlogSection";

export default function HomeTemplate({ title, content }) {
    return (
        <main className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-gray-50 flex-col min-h-screen">
            <div className="flex flex-col justify-between h-screen">
                <div className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-gray-50 gap-2 w-full">
                    <Header />
                    <Hero />
                    <Content />
                    <Feature />
                    <BlogSection />
                    <Team />
                    <Price />
                    <NewsLetter />
                </div>
                <Footer />
            </div>
        </main>
    );
}

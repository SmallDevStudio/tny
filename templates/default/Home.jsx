import React from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Layouts/App/Footer";
import Header from "@/components/Layouts/App/Header";
import Carousel from "@/components/Layouts/Sections/Carousel";
import Hero from "@/components/Layouts/Sections/Hero";
import Blockquote from "@/components/Layouts/Sections/Blockquote";
import Team from "@/components/Layouts/Sections/Team";
import BlogSection from "@/components/Layouts/Sections/BlogSection";
import Trainings from "@/components/Layouts/Sections/Trainings";
import Partner from "@/components/Layouts/Sections/Partner";
import Courses from "@/components/Layouts/Sections/Courses";
import NewsLetter from "@/components/Layouts/Sections/NewsLetter";

export default function HomeTemplate({ title, content }) {
    return (
        <main className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-gray-50 flex-col min-h-screen">
            <div className="flex flex-col justify-between h-screen">
                <div className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-gray-50 gap-2 w-full">
                    <Header />
                    {/* Sections */}
                    <Carousel />
                    <div class="flex items-start justify-start max-w-7xl px-6 sm:px-6 lg:px-12">
                        <span className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-orange-500">รู้จัก อ. เอ๋ อภัยลักษ์ ตันตระบัณฑิตย์</span>
                    </div>
                    <Hero />
                    <div class="flex items-start justify-start max-w-7xl px-6 sm:px-6 lg:px-12">
                        <span className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-orange-500">รู้จัก THE NEW YOU Academy</span>
                    </div>
                    <Blockquote />
                    <Team />
                    <BlogSection />
                    <Trainings />
                    <Partner />
                    <Courses />
                    <NewsLetter />
                </div>
                <Footer />
            </div>
        </main>
    );
}

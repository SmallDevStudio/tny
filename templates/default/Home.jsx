import React from "react";
import { useRouter } from "next/router";
import HomeHeader from "@/layouts/Sections/HomeHeader";
import Footer from "@/components/Layouts/App/Footer";
import Header from "@/components/Layouts/App/Header";
import Hero from "@/components/Layouts/App/Hero";
import Content from "@/components/Layouts/App/Content";
import Feature from "@/components/Layouts/App/Feature";
import Team from "@/components/Layouts/App/Team";

export default function HomeTemplate({ title, content }) {
    return (
        <main className="flex-1 flex-col min-h-screen">
            <div className="flex flex-col justify-between h-screen">
                <div className="flex flex-col gap-2 w-full">
                    <Header />
                    <Hero />
                    <Content />
                    <Feature />
                    <Team />
                    <div className="">
                        {content}
                    </div>
                </div>
                <Footer />
            </div>
        </main>
    );
}

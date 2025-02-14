import React from "react";
import { useRouter } from "next/router";
import HomeHeader from "@/layouts/Sections/HomeHeader";
import Footer from "@/layouts/Sections/Footer";

export default function HomeTemplate({ title, content }) {
    return (
        <main className="flex-1 flex-col min-h-screen">
            <div className="flex flex-col justify-between h-screen">
                <div className="flex flex-col w-full">
                    <HomeHeader />
                    <div className="">
                        {content}
                    </div>
                </div>
                <Footer />
            </div>
        </main>
    );
}

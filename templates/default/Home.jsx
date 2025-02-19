import React from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Layouts/App/Footer";
import Header from "@/components/Layouts/App/Header";

export default function HomeTemplate({ title, content }) {
    return (
        <main className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-gray-50 flex-col min-h-screen">
            <div className="flex flex-col justify-between h-screen">
                <div className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-gray-50 gap-2 w-full">
                    <Header />
                    {/* Sections */}
                    
                </div>
                <Footer />
            </div>
        </main>
    );
}

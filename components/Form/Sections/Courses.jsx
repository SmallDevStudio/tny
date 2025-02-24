import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const courses = [
    {id: 1, tilte: "ภาพ TNY", description: "", image: "/images/courses/1.png"},
    {id: 2, tilte: "ภาพ GMU", description: "", image: "/images/courses/2.png"},
    {id: 3, tilte: "ภาพ PM", description: "", image: "/images/courses/3.png"},
    {id: 4, tilte: "ภาพ PM", description: "", image: "/images/courses/4.png"},
    {id: 5, tilte: "ภาพ PM", description: "", image: "/images/courses/5.png"},
]
export default function Courses() {
    return (
        <section className="bg-white dark:bg-gray-800">
            <div className="py-4 px-4 mx-auto max-w-screen-xl lg:py-2 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center lg:mb-8">
                    <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">Public Courses</h2>
                    {/*<p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>*/}
                </div> 
            </div>
            <div className="grid max-w-screen-xl px-4 py-4 mx-auto lg:gap-2 xl:gap-0 lg:py-2 lg:grid-cols-2">
                {courses.map((course, index) => (
                    <div key={index} className="relative">
                        <Image
                            src={course.image}
                            alt={course.tilte}
                            width={700}
                            height={700}
                            loading="lazy"
                        />
                    </div>
                ))}

            </div>
        </section>
    );
}
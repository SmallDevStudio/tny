import React from "react";
import Footer from "@/components/Layouts/App/Footer";
import Header from "@/components/Layouts/App/Header";
import Carousel from "@/components/Layouts/Sections/Carousel";
import Hero from "@/components/Layouts/Sections/Hero";
import Blockquote from "@/components/Layouts/Sections/Blockquote";
import Team from "@/components/Layouts/Sections/Team";
import Trainings from "@/components/Layouts/Sections/Trainings";
import Partner from "@/components/Layouts/Sections/Partner";
import Courses from "@/components/Layouts/Sections/Courses";
import ExCourses from "@/components/Layouts/Sections/ExCourses";

export default function HomeTemplate({ title, content }) {
  return (
    <div className="flex flex-col justify-between h-screen">
      <div className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-gray-50 gap-2 w-full">
        <Header />
        {/* Sections */}
        <Carousel />
        <Hero />
        <Blockquote />
        <Team />
        <Courses />
        <Trainings />
        <Partner />
        <ExCourses />
      </div>
      <Footer />
    </div>
  );
}

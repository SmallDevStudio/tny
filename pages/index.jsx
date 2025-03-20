import Image from "next/image";
import { useRouter } from "next/router";
import Carousel from "@/components/Layouts/Sections/Carousel";
import Hero from "@/components/Layouts/Sections/Hero";
import Blockquote from "@/components/Layouts/Sections/Blockquote";
import Team from "@/components/Layouts/Sections/Team";
import Trainings from "@/components/Layouts/Sections/Trainings";
import Partner from "@/components/Layouts/Sections/Partner";
import Courses from "@/components/Layouts/Sections/Courses";
import Fixed from "@/components/Layouts/Sections/Fixed";
import ExCourses from "@/components/Layouts/Sections/ExCourses";

export default function Home() {
  const router = useRouter();

  return (
    <div>
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
  );
}

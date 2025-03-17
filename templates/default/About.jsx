import Footer from "@/components/Layouts/App/Footer";
import Header from "@/components/Layouts/App/Header";
import Carousel from "@/components/Layouts/Sections/Carousel";
import Hero from "@/components/Layouts/Sections/Hero";
import Blockquote from "@/components/Layouts/Sections/Blockquote";
import Team from "@/components/Layouts/Sections/Team";
import Trainings from "@/components/Layouts/Sections/Trainings";
import Partner from "@/components/Layouts/Sections/Partner";
import Courses from "@/components/Layouts/Sections/Courses";
import Fixed from "@/components/Layouts/Sections/Fixed";
import Exclusive from "@/components/Layouts/Sections/Exclusive";

export default function AboutTemplate({ title, content }) {
  return (
    <main className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-gray-50 flex-col min-h-screen">
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
          <Exclusive />
          <Fixed />
        </div>
        <Footer />
      </div>
    </main>
  );
}

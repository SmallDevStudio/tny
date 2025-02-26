import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";

const heroContent = {
    title: "Payments tool for software companies",
    description: "From checkout to global sales tax compliance, companies around the world use Flowbite to simplify their payment stack.",
    image: "/images/apailuicktan.png",
    contents: "From checkout to global sales tax compliance, companies around the world use Flowbite to simplify their payment stack."
};

export default function HeroSection({ title, description, image, content }) {
    const { lang, t } = useLanguage();

    return (
        <section className="bg-white dark:bg-gray-800 w-full">
            <div className="py-4 px-4 w-full lg:py-6 lg:px-6">
                <div className="mx-auto max-w-screen-lg text-center lg:mb-1">
                    <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
                        {title ? t(title) : heroContent.title}
                    </h2>
                    <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        {description ? t(description) : heroContent.description}
                    </p>
                </div>
            </div>

            <div className="grid max-w-screen-xl mx-auto px-4 py-8  lg:gap-12 xl:gap-4 lg:py-12 lg:grid-cols-2">
                <div className="mr-auto lg:mt-0 lg:col-span-4 lg:flex ">  
                    <Image 
                        src={heroContent.image} 
                        alt="mockup"
                        width={500}
                        height={500}
                        className="w-full max-w-[300px] h-auto object-contain"
                        priority
                    />
                </div>
            
                <div className="flex flex-col items-start mt-8 lg:w-full lg:ml-12 lg:mt-6">   
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                
            </div>
        </section>
    );
};

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";

const teamItems = [
    { name: "Bonnie Green", role: "CEO & Web Developer", image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png" },
    { name: "Leslie Livingston", role: "CTO & Web Designer", image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/leslie-livingston.png" },
    { name: "Michael Gough", role: "COO & Marketing Guru", image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png" },
    { name: "Sarah Johnson", role: "Lead UX Designer", image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png" },
];

export default function Team() {
    const [teams, setTeams] = useState([]);
    const { lang, t } = useLanguage();
    const { subscribe } = useDB("teams");

    useEffect(() => {
        const unsubscribe = subscribe((teamData) => {
            setTeams(teamData);
        });
    
        return () => unsubscribe(); // ✅ Clean up listener เมื่อ component unmount
    }, []);

    return (
        <section className="bg-white dark:bg-gray-800">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
                    <h2 className="mb-4 text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-orange-500">
                        รู้จัก The NEW YOU RENGER
                    </h2>
                </div> 

                {/* Desktop: Grid, Mobile: Horizontal Scroll */}
                <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 place-items-center">
                    {teams.map((item, index) => (
                        <div 
                            key={index}
                            className="flex flex-col items-center justify-center w-full max-w-[300px] p-4 transition-transform transform hover:scale-105"
                        >
                            <Link href="#">
                                <Image
                                    className="w-32 h-32 rounded-full" 
                                    src={item.image.url}
                                    alt={t(item.name)}
                                    width={200}
                                    height={200}
                                    loading="lazy"
                                />
                            </Link>
                            <div className="p-5 text-center">
                                <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                    <Link href="#">{t(item.name)}</Link>
                                </h3>
                                <span className="text-gray-500 dark:text-gray-400">{t(item.position)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile: Horizontal Scroll with Touch Support */}
                <div className="lg:hidden flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory touch-pan-x scrollbar-hide">
                    {teams.map((item, index) => (
                        <div 
                            key={index}
                            className="flex flex-col items-center justify-center min-w-[250px] sm:min-w-[300px] snap-start p-4 transition-transform transform hover:scale-105"
                        >
                            <Link href="#">
                                <Image
                                    className="w-32 h-32 rounded-full" 
                                    src={item.image.utl}
                                    alt={t(item.name)}
                                    width={200}
                                    height={200}
                                    loading="lazy"
                                />
                            </Link>
                            <div className="p-5 text-center">
                                <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                    <Link href="#">{t(item.name)}</Link>
                                </h3>
                                <span className="text-gray-500 dark:text-gray-400">{t(item.position)}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

import Image from "next/image";

export default function ImageTextSection({ data, lang }) {

    return (
        <section className="bg-white dark:bg-gray-800 w-full">
            <div className="py-4 px-4 w-full lg:py-6 lg:px-6">
                <div className="mx-auto max-w-screen-lg text-center lg:mb-1">
                    <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
                        {data?.title[lang]}
                    </h2>
                    <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        {data?.description? data?.description[lang] : ""}
                    </p>
                </div>
            </div>

            <div className="flex justify-center max-w-screen-2xl mx-auto">
                <div className="grid mx-auto max-w-screen-sm lg:max-w-screen-lg px-4 py-8 w-full lg:gap-12 xl:gap-4 lg:py-12 lg:grid-cols-2">
                    <div className="mr-auto lg:mt-0 lg:col-span-4 lg:flex ">  
                        <Image 
                            src={data.image?.url} 
                            alt="mockup"
                            width={500}
                            height={500}
                            className="w-full image-section h-auto object-contain"
                            priority
                        />
                
                        <div className="flex tracking-tight mx-auto mt-8 lg:w-full lg:ml-12 lg:mt-0">   
                            <div dangerouslySetInnerHTML={{ __html: data.content[lang] }} className="flex preview-box" />          
                        </div>
                    </div>                
                </div>
            </div>
        </section>
    );
};

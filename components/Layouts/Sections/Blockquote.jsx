import Image from "next/image";

export default function Blockquote() {
    return (
        <section class="bg-white dark:bg-gray-800 w-full">
            <div className="py-4 px-4 w-full lg:py-6 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center lg:mb-1 mb-4">
                    <h2 className="text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">รู้จัก THE NEW YOU Academy</h2>
                        {/*<p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>*/}
                </div> 
            </div>
            <div className="bg-gray-300 dark:bg-gray-900"
                style={{
                    backgroundImage: "url('/images/bg-block.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '100%',
                }}
            >
                <div class="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-40 lg:px-6">
                    <figure class="max-w-screen-lg mx-auto">
                        <svg class="h-12 mx-auto mb-3 text-gray-100 dark:text-orange-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor"/>
                        </svg> 
                        <blockquote>
                            <p class="text-xl font-medium text-gray-200 dark:text-white">
                            “THE NEW YOU สร้างขึ้นโดยมีเป้าหมายช่วยเปลี่ยนแปลงชีวิตผู้คนให้ดีขึ้นอย่างเต็มศักยภาพ
                            ผ่านการส่งมอบประสบการณ์และกระบวนการเรียนรู้ ที่มุ่งเน้นพัฒนาทัศนคติ ความรู้ และทักษะต่างๆ
                            ที่ครอบคลุมทั้งภายในจิตใจและภายนอกให้กับผู้เรียน”
                            </p>
                        </blockquote>
                        {/*
                        <figcaption class="flex items-center justify-center mt-6 space-x-3">
                            <Image
                                class="w-6 h-6 rounded-full" 
                                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png" 
                                alt="profile picture"
                                width={500}
                                height={500}
                            />
                            <div class="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                                <div class="pr-3 font-medium text-gray-900 dark:text-white">Micheal Gough</div>
                                <div class="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">CEO at Google</div>
                            </div>
                        </figcaption>
                        */}
                    </figure>
                </div>
            </div>
        </section>
    );
}
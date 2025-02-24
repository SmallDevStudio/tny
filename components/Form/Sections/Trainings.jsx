import Image from "next/image";

const trainingData = {
    title: "training",
    description: "",
    content: "เราเชื่อมั่นในแนวทางพัฒนาศักยภาพผู้เรียนให้ไปถึงจุดสูงสุด ผ่านการออกแบบหลักสูตรเฉพาะของแต่ละหน่วยงาน ให้สอดคล้องกับเป้าหมาย ทิศทาง นโยบาย และปัญหาที่จำเป็นต้องแก้ไขอย่างเร่งด่วนขององค์กร ผ่านรูปแบบการฝึกอบรม การโค้ชชิ่ง และการให้คำปรึกษาส่วนบุคคล",
    image: "",
    bgImage: "/images/bg-training1.png",
    bgImageSm: "/images/bg-training.png",
    url: ""
}

export default function Trainings() {
    return (
        <section className="bg-white dark:bg-gray-800">
            <div className="py-6 px-4 mx-auto max-w-screen-xl lg:py-2 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center lg:mb-2 mb-4">
                    <h2 className="text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">Corporate Trainings</h2>
                    {/*<p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>*/}
                </div> 
            </div>
            <div className="bg-gray-300 dark:bg-gray-900"
                style={{
                    backgroundImage: `url(${trainingData.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '100%',
                }}
            >
                <div class="max-w-screen-xl px-4 py-24 mx-auto text-center lg:py-80 lg:px-6">
                    <figure class="max-w-screen-lg">
                        <blockquote>
                            <p class="text-xl font-medium text-gray-800 dark:text-white lg:mt-[-150px] lg:text-3xl">
                            {trainingData.content}
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
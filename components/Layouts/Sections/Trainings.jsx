import Image from "next/image";

const trainingData = {
    title: "training",
    description: "",
    content: "เราเชื่อมั่นในแนวทางพัฒนาศักยภาพผู้เรียนให้ไปถึงจุดสูงสุด ผ่านการออกแบบหลักสูตรเฉพาะของแต่ละหน่วยงาน ให้สอดคล้องกับเป้าหมาย ทิศทาง นโยบาย และปัญหาที่จำเป็นต้องแก้ไขอย่างเร่งด่วนขององค์กร ผ่านรูปแบบการฝึกอบรม การโค้ชชิ่ง และการให้คำปรึกษาส่วนบุคคล",
    image: "",
    bgImage: "/images/bg-training1.png",
    url: ""
}

export default function Trainings() {
    return (
        <section className="bg-white dark:bg-gray-800">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-2 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center lg:mb-2 mb-4">
                    <h2 className="text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">Corporate Trainings</h2>
                    {/*<p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>*/}
                </div> 
            </div>
            <div class="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-8 lg:px-6">
                <div className="relative">
                    <Image
                        src={trainingData.bgImage}
                        alt={trainingData.title}
                        width={1500}
                        height={1500}
                        loading="lazy"
                    />
                    <div className="absolute top-5 mx-auto w-3/4 py-8 px-8 text-2xl dark:text-black">
                        {trainingData.content}
                    </div>
                </div>

            </div>
        </section>
    );
}
import Image from "next/image";

const trainingData = {
  title: "Corporate Trainings",
  description: "",
  content:
    "“เราเชื่อมั่นในแนวทางพัฒนาศักยภาพผู้เรียน ให้ไปถึงจุดสูงสุดผ่านการออกแบบหลักสูตรเฉพาะ ของแต่ละหน่วยงานให้สอดคล้องกับเป้าหมายทิศทาง นโยบายและปัญหาที่จำเป็นต้องแก้ไข อย่างเร่งด่วนขององค์กร ผ่านรูปแบบการฝึกอบรม การโค้ชชิ่ง และการให้คำปรึกษาส่วนบุคคล”",
  image: "/images/training/Training.png",
  bgImage: "/images/training/Training.png",
  bgImageSm: "/images/bg-training.png",
  url: "",
};

export default function Trainings() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="py-6 px-4 mx-auto max-w-screen-xl lg:py-2 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-2 mb-4">
          <h2 className="text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
            {trainingData.title}
          </h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            {trainingData.description}
          </p>
        </div>
      </div>
      <div className="max-w-screen-xl px-4 py-4 mx-auto">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <p className="font-semi text-black p-4 sm:text-xl lg:text-2xl dark:text-gray-200">
              {trainingData.content}
            </p>
          </div>
          <div className="flex lg:max-h-[600px]">
            <Image
              className="w-full h-full object-contain"
              src={trainingData.image}
              alt="training"
              width={400}
              height={400}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

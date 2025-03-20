import Image from "next/image";

export default function Blockquote() {
  return (
    <section class="bg-white dark:bg-gray-800 w-full">
      <div className="py-4 px-4 w-full lg:py-6 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-1 mb-4">
          <h2 className="text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
            รู้จัก THE NEW YOU Academy
          </h2>
          {/*<p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>*/}
        </div>
      </div>
      <div
        className="bg-gray-300 dark:bg-gray-900"
        style={{
          backgroundImage: "url('/images/bg-block.png')",
          backgroundSize: "cover",
          backgroundPosition: "left",
          backgroundRepeat: "no-repeat",
          height: "100%",
        }}
      >
        <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-40 lg:px-6">
          <figure className="max-w-screen-lg mx-auto">
            <blockquote>
              <p className="text-sm font-medium text-gray-200 dark:text-white lg:text-2xl">
                “THE NEW YOU
                สร้างขึ้นโดยมีเป้าหมายช่วยเปลี่ยนแปลงชีวิตผู้คนให้ดีขึ้นอย่างเต็มศักยภาพ
                ผ่านการส่งมอบประสบการณ์และกระบวนการเรียนรู้
                ที่มุ่งเน้นพัฒนาทัศนคติ ความรู้ และทักษะต่างๆ
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

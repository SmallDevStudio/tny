import Image from "next/image";

const heroContent = {
  title: "Payments tool for software companies",
  description:
    "From checkout to global sales tax compliance, companies around the world use Flowbite to simplify their payment stack.",
  image: "/images/apailuicktan.png",
  contents: {
    title:
      "ผู้ก่อตั้งสถาบันพัฒนาภาพลักษณ์ THE NEW YOU Academy และที่ปรึกษาภาพลักษณ์ (Image Consultant) ระดับสากล",
    description: [
      {
        title:
          "Image Consultant ไทยที่ทำคะแนนได้สูงที่สุดจาก 3 สถาบันชั้นนำของโลกทางด้านภาพลักษณ์ (อเมริกา อังกฤษ และ สิงคโปร์) ผู้ได้รับรางวัล Image consultant Global Rising Star Award 2017 ณ ประเทศ Mexico",
      },
      {
        title:
          "ตัวแทนคนแรกและคนเดียวของเอเชีย ที่ได้รับเชิญเป็นผู้ดำเนินรายการ และผู้บรรยายพิเศษ ให้แก่สมาชิกที่ปรึกษาภาพลักษณ์ทั่วโลก ในสมาพันธ์ที่ปรึกษา ภาพลักษณ์นานาชาติ (AICI)",
      },
      {
        title:
          "ผู้ก่อตั้งและผู้อำนวยการหลักสูตร “The Story” มหาวิทยาลัยศรีปทุม และหลักสูตร “The ConneXt” มหาวิทยาลัยหอการค้าไทย",
      },
      {
        title:
          "ประสบการณ์การสอนและการเป็นผู้บริหาร ให้กับบริษัทเอกชนชั้นหลายแห่ง มามากกว่า 20 ปี และเปลี่ยนแปลงชีวิตผู้คนมากมาย    ผ่านการอบรมให้กับองค์กรชั้นนำทั้งในและต่างประเทศรวมทั้งโค้ชชิ่งตัวต่อตัวให้กับนักธุรกิจแถวหน้าทั่วเอเชีย",
      },
      { title: "ผู้สร้าง Image Consultant ชั้นนำในประเทศไทยกว่า 70%" },
      {
        title: "เจ้าของหนังสือขายดี 2 เล่ม",
        options: [
          { text: "Look Good ดูดี ชนะใจ ทำอะไรก็ชนะ" },
          { text: "The New You ปรับลุค เปลี่ยนลักษณ์" },
        ],
      },
      { title: "KOL ด้านการพัฒนาตนเองที่มีผู้ติดตามกว่า 1.6 ล้านคน" },
    ],
  },
};
export default function Hero() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="py-4 px-4 w-full lg:py-6 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-1 ">
          <h2 className="text-2xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
            รู้จัก อ. เอ๋ อภัยลักษ์ ตันตระบัณฑิตย์
          </h2>
          {/*<p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>*/}
        </div>
      </div>
      <div className="grid max-w-screen-xl mx-auto px-4 py-8 lg:gap-12 xl:gap-4 lg:py-12 lg:grid-cols-2">
        <div className="flex justify-center w-full lg:max-w-[500px] mx-auto">
          <Image
            src={heroContent.image}
            alt="mockup"
            width={500}
            height={500}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="flex flex-col items-start mt-8 lg:w-full lg:ml-12 lg:mt-6">
          <h1 className="max-w-2xl mb-4 text-lg font-extrabold tracking-tight leading-5 md:text-lg xl:text-xl sm:text-md dark:text-white">
            {heroContent.contents.title}
          </h1>
          <div className="max-w-2xl mb-6 font-light text-gray-700 lg:mb-8 md:text-md lg:text-md dark:text-gray-400">
            <ul className="list-disc pl-5 text-sm lg:text-md xl:text-lg">
              {heroContent.contents.description.map((item, index) => (
                <div key={index}>
                  <li key={index}>{item.title}</li>
                  {item.options &&
                    item.options.map((option, optionIndex) => (
                      <ul key={optionIndex} className="list-disc pl-5">
                        <li>{option.text}</li>
                      </ul>
                    ))}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

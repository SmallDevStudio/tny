import ImageTextSection from "@/components/Form/Sections/ImageTextSection";
import useLanguage from "@/hooks/useLanguage";
const heroSampleData = {
    title: {
        "th": "ทดสอบการทำงาน", 
        "en": "Lorem ipsum dolor sit amet"
    },
    description: {
        "th": "Lorem ipsum dolor sit amet consectetur. Viverra mus eget sit dignissim lacus ornare tristique. Scelerisque euismod amet nulla aliquam nec lectus feugiat quis sed. Egestas magna ultricies enim.",
        "en": "Lorem ipsum dolor sit amet consectetur. Viverra mus eget sit dignissim lacus ornare tristique. Scelerisque euismod amet nulla aliquam nec lectus feugiat quis sed. Egestas magna ultricies enim."
    },
    image: { 
        url: "/images/sample/hero-sample.png"
    },
    content: {
        "th": "Lorem ipsum dolor sit amet consectetur. Viverra mus eget sit dignissim lacus ornare tristique. Scelerisque euismod amet nulla aliquam nec lectus feugiat quis sed. Egestas magna ultricies enim tristique pellentesque est tincidunt leo. In ornare eu turpis tincidunt lacinia dui eu dapibus arcu. Sagittis turpis curabitur non risus arcu metus dui tristique malesuada. Sem est molestie etiam netus viverra.",
        "en": "Lorem ipsum dolor sit amet consectetur. Viverra mus eget sit dignissim lacus ornare tristique. Scelerisque euismod amet nulla aliquam nec lectus feugiat quis sed. Egestas magna ultricies enim tristique pellentesque est tincidunt leo. In ornare eu turpis tincidunt lacinia dui eu dapibus arcu. Sagittis turpis curabitur non risus arcu metus dui tristique malesuada. Sem est molestie etiam netus viverra."
    }
};


export default function TestSection() {
    const { language } = useLanguage();
    return (
        <div>
            <ImageTextSection data={heroSampleData} lang={language} />
        </div>
    );
}
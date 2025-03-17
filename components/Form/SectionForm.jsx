import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "../btn/UploadImage";
import useDB from "@/hooks/useDB";
import Image from "next/image";
import TiptapEditor from "../Tiptap/TiptapEditor";
import ImageTextSection from "./Sections/ImageTextSection";
import { toast } from "react-toastify";
import Preview from "../utils/Preview";
import { Sections } from "@/components/Form/Sections";

const sampleData = {
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


export default function SectionForm({ component, data }) {
    const { lang } = useLanguage();

    const [section, setSection] = useState(null);
    const [form, setForm] = useState({
        title: sampleData.title,
        description: sampleData.description,
    });
    const [image, setImage] = useState(null);
    const [content, setContent] = useState({
        th: "<p>เขียนข้อความที่นี่...</p>",
        en: "<p>Write your text here...</p>",
    });
    const [language, setLanguage] = useState("th");
    const { add, update, getById } = useDB(section?.name);

    useEffect(() => {
        if (component) {
            const selectedSection = Sections.find((sec) => sec.name === component);
            setSection(selectedSection);
        }

        if (!section) return;
    }, [component]);

    console.log('component', component);
    console.log('section', section);

    const handleUpload = (image) => {
        setImage(image[0]);
    };

    const heroData = {
        title: form.title ? form.title : sampleData.title,
        description: form.description,
        image: image ? image : sampleData.image,
        content: content ? content : sampleData.content
    }

    const handleContentChange = (newContent) => {
        setContent((prevContent) => ({
            ...prevContent,
            [language]: newContent, // ✅ อัปเดตค่าของภาษาที่เลือกเท่านั้น
        }));
    };

    const handleFormSubmit = async () => {
        console.log(heroData);

        if (data) {
            try {
                await update(data.id, heroData);
                toast.success(lang["update_section_success"]);
            } catch (error) {
                console.log(error);
                toast.error(lang["error_occured"]);
            }
        } else {
            try {
                await add(heroData);
                toast.success(lang["add_section_success"]);
            } catch (error) {
                console.log(error);
                toast.error(lang["error_occured"]);
            }
        }
    }

    const handleFormClear = () => {
        setForm({});
        setImage(null);
        setContent({});
    }

    return (
        <div className="bg-white dark:bg-gray-800">
            <div className="max-w-screen-xl px-2 py-4">
                <div>
                    <div className="flex flex-row items-center justify-end gap-2 w-full">
                        <button
                            className={`px-4 py-1 rounded-md font-bold transition ${
                                language === "th" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                            onClick={() => setLanguage("th")}
                        >
                            TH
                        </button>
                        <button
                            className={`px-4 py-1 rounded-md font-bold transition ${
                                language === "en" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                            onClick={() => setLanguage("en")}
                        >
                            EN
                        </button>
                    </div>
                    {section && section.component ? (
                        <Preview data={heroData} Component={section.component} lang={language}/>
                    ): (
                        <p className="text-center text-gray-500">{lang["section_not_found"]}</p>
                    )}
                </div>
                

                {/* Form */}
                <div className="flex flex-col gap-2 mt-4">
                    {/* Title */}
                    <div className="flex flex-col w-full">
                        <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                            {lang["title"]}
                        </label>
                        <div className="grid col-span-1 lg:col-span-2 lg:flex gap-2">
                            <input
                                type="text"
                                name="title.th"
                                id="title.th"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder={lang["title_write"] + " (TH)"}
                                value={form?.title?.th || ""}
                                onChange={(e) =>
                                    setForm({ ...form, title: { ...form.title, th: e.target.value } })
                                }
                            />
                            <input
                                type="text"
                                name="title.en"
                                id="title.en"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder={lang["title_write"] + " (EN)"}
                                value={form?.title?.en || ""}
                                onChange={(e) =>
                                    setForm({ ...form, title: { ...form.title, en: e.target.value } })
                                }
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="w-full">
                        <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                            {lang["description"]}
                        </label>
                        <div className="grid col-span-1 lg:col-span-2 lg:flex gap-2">
                            <textarea
                                name="description.th"
                                id="description.th"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full focus:ring-primary-600 focus:border-primary-600 block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder={lang["description_write"] + " (TH)"}
                                value={form?.description?.th || ""}
                                onChange={(e) =>
                                    setForm({ ...form, description: { ...form.description, th: e.target.value } })
                                }
                                rows={4}
                            />
                            <textarea
                                name="description.en"
                                id="description.en"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full focus:ring-primary-600 focus:border-primary-600 block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder={lang["description_write"] + " (EN)"}
                                value={form?.description?.en || ""}
                                onChange={(e) =>
                                    setForm({ ...form, description: { ...form.description, en: e.target.value } })
                                }
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Upload Image */}
                    <div className="flex flex-col gap-2 w-full">
                        <div className="relative">
                            {image && image.url && (
                                <Image src={image.url} alt={image.file_name} width={200} height={200} className="object-cover" priority />
                            )}
                        </div>
                        <UploadImage size={24} onUpload={handleUpload} folder="sections" />
                    </div>

                    {/* Editor */}
                    <div className="w-full">
                        <div className="flex flex-row items-center justify-end gap-2 w-full">
                            <button
                                className={`px-4 py-1 rounded-md font-bold transition ${
                                    language === "th" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"
                                }`}
                                onClick={() => setLanguage("th")}
                            >
                                TH
                            </button>
                            <button
                                className={`px-4 py-1 rounded-md font-bold transition ${
                                    language === "en" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"
                                }`}
                                onClick={() => setLanguage("en")}
                            >
                                EN
                            </button>
                        </div>
                        <TiptapEditor content={content[language]} onChange={handleContentChange} />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center items-center gap-4 w-full mt-5">
                    <button 
                        className="bg-orange-500 hover:bg-orange-600 p-2 rounded-md text-white font-bold"
                        onClick={handleFormSubmit}
                    >
                        {lang["save"]}
                    </button>

                    <button 
                        className="bg-red-500 hover:bg-red-600 p-2 rounded-md text-white font-bold"
                        onClick={handleFormClear}
                    >
                        {lang["cancel"]}
                    </button>
                </div>
            </div>
        </div>
    );
}

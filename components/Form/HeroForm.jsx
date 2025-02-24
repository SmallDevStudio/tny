import { useState } from "react";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "../btn/UploadImage";
import useDB from "@/hooks/useDB";
import Image from "next/image";
import TiptapEditor from "../Tiptap/TiptapEditor";
import HeroSection from "./Sections/HeroSection";

export default function HeroForm({ component }) {
    const { lang } = useLanguage();

    const [form, setForm] = useState({});
    const [image, setImage] = useState({});
    const [content, setContent] = useState(`<p>${lang["write_text"]}</p>`);
    const [previewMode, setPreviewMode] = useState("desktop"); // ✅ ตั้งค่าเริ่มต้นเป็น Desktop
    const { update, getById } = useDB("hero");

    const handleUpload = (image) => {
        setImage(image[0]);
    };

    return (
        <div className="bg-white dark:bg-gray-800">
            <div className="max-w-screen-xl px-2 py-4">
                
                {/* Mode Toggle Buttons */}
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-md font-bold transition ${
                            previewMode === "desktop"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 dark:bg-gray-700"
                        }`}
                        onClick={() => setPreviewMode("desktop")}
                    >
                        🖥 Desktop
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md font-bold transition ${
                            previewMode === "mobile"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 dark:bg-gray-700"
                        }`}
                        onClick={() => setPreviewMode("mobile")}
                    >
                        📱 Mobile
                    </button>
                </div>

                {/* Preview Section */}
                <div
                    className="flex justify-center items-center border border-gray-300 rounded-lg overflow-hidden mx-auto bg-white dark:bg-gray-900"
                    style={{
                        width: previewMode === "desktop" ? "100%" : "375px", // ✅ Desktop: 100%, Mobile: 375px
                        maxWidth: previewMode === "moblie" ? "375px" : "100%", // ✅ Desktop: 100%, Mobile: 375px
                        overflow: "auto",
                        padding: "16px"
                    }}
                >
                    <HeroSection
                        title={form.title}
                        description={form.description}
                        image={image}
                        content={content}
                    />
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
                                rows={2}
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
                                rows={2}
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
                        <span className="text-sm text-gray-500">{lang["size_image"]} 500x500</span>
                    </div>

                    {/* Editor */}
                    <div>
                        <TiptapEditor content={content} onChange={(newContent) => setContent(newContent)} />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center items-center w-full mt-5">
                    <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-md text-white font-bold">
                        {lang["save"]}
                    </button>
                </div>
            </div>
        </div>
    );
}

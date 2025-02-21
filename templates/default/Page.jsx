import Footer from "@/components/Layouts/App/Footer";
import Header from "@/components/Layouts/App/Header";
import useLanguage from "@/hooks/useLanguage";

export default function PageTemplate({ title, content }) {
    const { language, lang, getText } = useLanguage();

    return (
        <main className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-gray-50 flex-col min-h-screen w-full">
            <div className="flex flex-col justify-between h-screen w-full">
                <div className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-gray-50 gap-2 w-full">
                    <Header />
                    {/* Sections */}
                    <p>{title}</p>
                    <p>{content}</p>
                    <p>{lang["welcome"]}</p>
                </div>
                <Footer />
            </div>
        </main>
    );
}

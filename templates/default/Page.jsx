import Footer from "@/layouts/Sections/Footer";

export default function PageTemplate({ title, content }) {
    return (
        <main className="flex-1 flex-col min-h-screen">
            <div className="flex flex-col justify-between h-screen">
                <div className="flex flex-col w-full">
                    <h1>{title}</h1>
                    <p>{content}</p>
                </div>

                <Footer />
            </div>
        </main>
    );
}

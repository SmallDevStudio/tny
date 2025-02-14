import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function AdminPages() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const pagesRef = collection(db, "pages");
                const snapshot = await getDocs(pagesRef);
                const pagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPages(pagesData);
            } catch (error) {
                console.error("Error fetching pages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    const handleAddPage = async () => {
        const slug = prompt("Enter Page Slug (e.g., about, courses)");
        if (!slug) return;

        try {
            await setDoc(doc(db, "pages", slug), {
                title: slug.charAt(0).toUpperCase() + slug.slice(1),
                slug: slug,
                description: `This is the ${slug} page.`,
                template: { base: "default", page: "page" },
                content: "Welcome to the new page.",
            });

            setPages([...pages, { id: slug, title: slug.charAt(0).toUpperCase() + slug.slice(1), slug }]);
        } catch (error) {
            console.error("Error adding page:", error);
        }
    };

    const handleDeletePage = async (id) => {
        if (!confirm("Are you sure you want to delete this page?")) return;

        try {
            await deleteDoc(doc(db, "pages", id));
            setPages(pages.filter(page => page.id !== id));
        } catch (error) {
            console.error("Error deleting page:", error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Pages</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4" onClick={handleAddPage}>
                Add Page
            </button>
            <ul>
                {pages.map(page => (
                    <li key={page.id} className="flex justify-between bg-gray-100 p-2 mb-2 rounded-md">
                        <span>{page.title} ({page.slug})</span>
                        <div>
                            <button className="bg-green-500 text-white px-3 py-1 rounded-md mx-2" onClick={() => router.push(`/${page.slug}`)}>View</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => handleDeletePage(page.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

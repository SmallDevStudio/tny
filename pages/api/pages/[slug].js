import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
    const { slug } = req.query;

    try {
        const pageRef = doc(db, "pages", slug);
        const pageSnap = await getDoc(pageRef);

        if (!pageSnap.exists()) {
            return res.status(404).json({ error: "Page not found" });
        }

        return res.status(200).json(pageSnap.data());
    } catch (error) {
        console.error("Error fetching page:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

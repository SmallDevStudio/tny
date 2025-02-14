import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = userDoc.data();
        
        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error("Error updating session:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

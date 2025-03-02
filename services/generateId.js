import { db } from "@/services/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default async function generateId() {
    const now = new Date();
    const year = (now.getFullYear() % 100).toString().padStart(2, "0"); // 25 for 2025
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 01 for January

    const usersRef = collection(db, "users");
    const q = query(
        usersRef,
        where("userId", ">=", `${year}${month}00000`), 
        where("userId", "<", `${year}${month}99999`), 
        orderBy("userId", "desc")
    );

    const querySnapshot = await getDocs(q);
    let lastNumber = 0;

    if (!querySnapshot.empty) {
        const lastUser = querySnapshot.docs[0].data();
        lastNumber = parseInt(lastUser.userId.slice(-5)) || 0;
    }

    const newUserId = `${year}${month}${(lastNumber + 1).toString().padStart(5, "0")}`;
    return newUserId;
}
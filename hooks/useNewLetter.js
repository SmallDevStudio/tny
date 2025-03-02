import { db } from "@/services/firebase";
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc,
    onSnapshot // ✅ เพิ่ม onSnapshot สำหรับการติดตามแบบ Realtime
} from "firebase/firestore";

export default function useNewLetter() {
    
    const createUserNewsletterSubscription = async (email, userId) => {
        try {
            const newsletterRef = collection(db, "newsletters");
            await addDoc(newsletterRef, {
                email,
                userId,
                active: true,
                createdAt: new Date().toISOString()
            });

            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { newsletter: true });

            return true;

        } catch (error) {
            console.error(error);
        }
    };

    const deleteUserNewsletterSubscription = async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { newsletter: false });

            const newsletterRef = collection(db, "newsletters");
            await updateDoc(newsletterRef, { active: false });
            

            return true;

        } catch (error) {
            console.error(error);
        }
    }

    return { 
        createUserNewsletterSubscription,
        deleteUserNewsletterSubscription
    };
}
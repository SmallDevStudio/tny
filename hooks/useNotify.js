import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from "firebase/firestore";
import axios from "axios";

// ✅ Hook แจ้งเตือน
export default function useNotify() {
    // ✅ 1. แจ้งเตือนผ่าน React-Toastify
    const notifyToast = (message, type = "info") => {
        toast[type](message);
    };

    // ✅ 2. แจ้งเตือนผ่าน LINE Message
    const sendLineMessage = async (userId, templateId, variables = {}) => {
        try {
            // ดึงเทมเพลตจาก Firebase
            const templateRef = doc(db, "lineTemplates", templateId);
            const templateSnap = await getDocs(templateRef);
            if (!templateSnap.exists()) throw new Error("Template not found");

            let message = templateSnap.data().message;
            // แทนค่าตัวแปรในเทมเพลต
            Object.keys(variables).forEach(key => {
                message = message.replace(`{{${key}}}`, variables[key]);
            });

            const response = await axios.post("/api/line", { userId, message });
            return response.data;
        } catch (error) {
            console.error("Error sending LINE Message:", error);
        }
    };

    // ✅ 3. แจ้งเตือนผ่าน Email
    const sendEmail = async (email, templateId, variables = {}) => {
        try {
            // ดึงเทมเพลตจาก Firebase
            const templateRef = doc(db, "emailTemplates", templateId);
            const templateSnap = await getDocs(templateRef);
            if (!templateSnap.exists()) throw new Error("Template not found");

            let { subject, body } = templateSnap.data();
            // แทนค่าตัวแปรในเทมเพลต
            Object.keys(variables).forEach(key => {
                subject = subject.replace(`{{${key}}}`, variables[key]);
                body = body.replace(`{{${key}}}`, variables[key]);
            });

            const response = await axios.post("/api/email", { email, subject, body });
            return response.data;
        } catch (error) {
            console.error("Error sending Email:", error);
        }
    };

    // ✅ 4. แจ้งเตือนผ่าน Firebase Notification
    const sendFirebaseNotification = async (userId, message, link = "") => {
        try {
            const notificationRef = collection(db, "notifications");
            await addDoc(notificationRef, {
                userId,
                message,
                link,
                isRead: false,
                readBy: [],
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding notification:", error);
        }
    };

    // ✅ 5. อัปเดตสถานะการอ่านแจ้งเตือนใน Firebase
    const markAsRead = async (notificationId, userId) => {
        try {
            const notificationRef = doc(db, "notifications", notificationId);
            await updateDoc(notificationRef, {
                isRead: true,
                readBy: userId ? [userId] : []
            });
        } catch (error) {
            console.error("Error updating notification:", error);
        }
    };

    return {
        notifyToast,
        sendLineMessage,
        sendEmail,
        sendFirebaseNotification,
        markAsRead
    };
}

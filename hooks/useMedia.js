import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";

export default function useMedia() {
    const { data: session } = useSession();
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ ฟังก์ชันดึงข้อมูลไฟล์ทั้งหมด
    const getAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const querySnapshot = await getDocs(collection(db, "mediaLibrary"));
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMedia(items);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ ฟังก์ชันดึงไฟล์ตาม ID
    const getById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, "mediaLibrary", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error("File not found");
            }
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // ✅ ฟังก์ชันดึงไฟล์ตาม User ID หรือ ไฟล์ที่เป็น global
    const getByUser = async (userId = null) => {
        setLoading(true);
        setError(null);
        try {
            let q;
            if (userId) {
                q = query(collection(db, "mediaLibrary"), where("user", "==", userId));
            } else {
                q = query(collection(db, "mediaLibrary"), where("user", "==", "global"));
            }
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return items;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // ✅ ฟังก์ชันอัปโหลดไฟล์เดี่ยว
    const add = async (file, folder = "", subfolder = "") => {
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);
            formData.append("subfolder", subfolder);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            // ✅ บันทึกข้อมูลลง Firebase
            const docRef = await addDoc(collection(db, "mediaLibrary"), {
                name: file.name,
                url: result.url,
                type: file.type,
                size: file.size,
                mine: file.type,
                tag: [],
                folder,
                subfolder,
                user: session?.user?.id || "global", // ✅ กำหนดเจ้าของไฟล์เป็น Global ถ้าไม่มี user
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            return { id: docRef.id, ...result };
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // ✅ ฟังก์ชันอัปโหลดหลายไฟล์
    const addMulti = async (files, folder = "", subfolder = "") => {
        const uploadedFiles = [];
        for (const file of files) {
            const uploadedFile = await add(file, folder, subfolder);
            if (uploadedFile) uploadedFiles.push(uploadedFile);
        }
        return uploadedFiles;
    };

    // ✅ ฟังก์ชันอัปเดตข้อมูลไฟล์
    const update = async (id, updatedData) => {
        setError(null);
        try {
            const docRef = doc(db, "mediaLibrary", id);
            await updateDoc(docRef, {
                ...updatedData,
                updatedAt: new Date().toISOString(),
            });
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    // ✅ ฟังก์ชันลบไฟล์เดี่ยว
    const remove = async (id, url) => {
        setError(null);
        try {
            const response = await fetch("/api/delete", {
                method: "POST",
                body: JSON.stringify({ url }),
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            // ✅ ลบข้อมูลจาก Firestore
            const docRef = doc(db, "mediaLibrary", id);
            await deleteDoc(docRef);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    // ✅ ฟังก์ชันลบหลายไฟล์
    const deleteMulti = async (items) => {
        const deletedItems = [];
        for (const item of items) {
            const deleted = await remove(item.id, item.url);
            if (deleted) deletedItems.push(item.id);
        }
        return deletedItems;
    };

    useEffect(() => {
        getAll();
    }, []);

    return { media, loading, error, getAll, getById, getByUser, add, addMulti, update, remove, deleteMulti };
}

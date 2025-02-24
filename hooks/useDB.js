import { useState, useEffect } from "react";
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

export default function useDB(collectionName) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ ฟังก์ชันดึงข้อมูลทั้งหมด
    const getAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(items);
            return items; // ✅ ต้อง return ค่า
        } catch (err) {
            setError(err.message);
            return []; // ✅ ป้องกัน error ถ้าเกิดปัญหา
        } finally {
            setLoading(false);
        }
    };

    // ✅ ฟังก์ชันติดตามข้อมูลแบบ Real-time
    const subscribe = (callback) => {
        const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(items);
            callback(items); // ✅ ส่งข้อมูลไปยัง callback เพื่ออัปเดต UI
        });

        return unsubscribe; // ✅ ต้อง return unsubscribe เพื่อหยุดการฟัง
    };

    // ✅ ฟังก์ชันดึงข้อมูลเอกสารตาม ID แบบ Realtime
    const getById = (id, callback) => {
        setLoading(true);
        setError(null);
        const docRef = doc(db, collectionName, id);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const docData = { id: docSnap.id, ...docSnap.data() };
                callback(docData); // ✅ ส่งข้อมูลไปยัง callback เพื่ออัปเดต UI
            } else {
                callback(null); // ✅ คืนค่า null ถ้าไม่มีเอกสาร
            }
            setLoading(false);
        }, (err) => {
            setError(err.message);
            setLoading(false);
        });

        return unsubscribe; // ✅ ต้อง return unsubscribe เพื่อหยุดการฟัง
    };

    // ✅ ฟังก์ชันเพิ่มเอกสารใหม่
    const add = async (newData) => {
        setError(null);
        try {
            const docRef = await addDoc(collection(db, collectionName), newData);
            return docRef.id;
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // ✅ ฟังก์ชันอัปเดตเอกสาร
    const update = async (id, updatedData) => {
        setError(null);
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, updatedData);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    // ✅ ฟังก์ชันลบเอกสาร
    const remove = async (id) => {
        setError(null);
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    useEffect(() => {
        getAll(); // โหลดข้อมูลเมื่อเริ่มต้น
    }, [collectionName]);

    return { data, loading, error, getAll, getById, add, update, remove, subscribe };
}

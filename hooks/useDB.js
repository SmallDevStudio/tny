import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

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
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ ฟังก์ชันดึงข้อมูลเอกสารตาม ID
    const getById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error("Document not found");
            }
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionName]);

    return { data, loading, error, getAll, getById, add, update, remove };
}

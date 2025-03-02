import { db } from "@/services/firebase";
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc,
    arrayUnion,
    arrayRemove,
    onSnapshot 
} from "firebase/firestore";
import { useState, useEffect } from "react";

export default function useUsers(callback) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAllUsers = async () => {
        setError(null);
        setLoading(true);

        const unsubscribe = onSnapshot(collection(db, "users"), async (snapshot) => {
            let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(items);
            callback(items);
        });

        return unsubscribe;
    };

    const getUserById = async (id, callback) => {
        setError(null);
        setLoading(true);
        const docRef = doc(db, "users", id);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const docData = { id: docSnap.id, ...docSnap.data() };
                callback(docData);
            } else {
                callback(null);
            }
        });

        return unsubscribe;
    };

    const createUser = async (data) => {
        try {
            const docRef = await addDoc(collection(db, "users"), data);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const updateUser = async (id, data) => {
        try {
            const docRef = doc(db, "users", id);
            await updateDoc(docRef, data);
            console.log("Document updated with ID: ", docRef.id);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const deleteUser = async (id) => {
        try {
            await deleteDoc(doc(db, "users", id));
            console.log("Document deleted with ID: ", id);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    useEffect(() => {
        const unsubscribe = getAllUsers();
        return () => unsubscribe();
    }, []);
    
    return { 
        users, 
        loading, 
        error,
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser
    };
}
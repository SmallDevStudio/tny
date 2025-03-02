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

// ✅ ฟังก์ชันดึงข้อมูล Users
const fetchUsersData = async (userIds) => {
    const usersData = [];
    for (const userId of userIds) {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            usersData.push({ id: userId, ...userSnap.data() });
        }
    }
    return usersData;
};

export default function useUserGroup(callback) {
    const [userGroup, setUserGroup] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAllUserGroup = async() => {
        const unsubscribe = onSnapshot(collection(db, "userGroup"), async (snapshot) => {
            let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserGroup(items);
            callback(items);
        });

        return unsubscribe;
    };

    const getUserGroupById = async (id, callback) => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, "userGroup", id);
            const unsubscribe = onSnapshot(docRef, async (docSnap) => {
                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() };
                    callback(data);
                } else {
                    callback(null);
                }
            });

            return unsubscribe;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const addUserGroup = async (data) => {
        try {
            await addDoc(collection(db, "userGroup"), data);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateUserGroup = async (id, data) => {
        try {
            const docRef = doc(db, "userGroup", id);
            await updateDoc(docRef, data);
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteUserGroup = async (id) => {
        try {
            const docRef = doc(db, "userGroup", id);
            await deleteDoc(docRef);
        } catch (err) {
            setError(err.message);
        }
    };

    const addUserToGroup = async (groupId, userIds) => {
        try {
            const groupRef = doc(db, "userGroup", groupId);

            // ✅ รองรับหลาย userId
            if (!Array.isArray(userIds)) userIds = [userIds];

            await updateDoc(groupRef, {
                users: arrayUnion(...userIds)
            });

            // ✅ อัปเดต users.group ใน Firestore
            for (const userId of userIds) {
                const userRef = doc(db, "users", userId);
                await updateDoc(userRef, { group: groupId });
            }

            console.log(`Users added to group ${groupId}:`, userIds);

        } catch (err) {
            setError(err.message);
        }
    };

    const removeUserFromGroup = async (groupId, userIds) => {
        try {
            const groupRef = doc(db, "userGroup", groupId);

            // ✅ รองรับหลาย userId
            if (!Array.isArray(userIds)) userIds = [userIds];

            await updateDoc(groupRef, {
                users: arrayRemove(...userIds)
            });

            // ✅ อัปเดต users.group ใน Firestore
            for (const userId of userIds) {
                const userRef = doc(db, "users", userId);
                await updateDoc(userRef, { group: "" });
            }

            console.log(`Users removed from group ${groupId}:`, userIds);

        } catch (err) {
            setError(err.message);
        }
    };

    return { 
        userGroup, 
        loading, 
        error, 
        getAllUserGroup, 
        getUserGroupById, 
        addUserGroup, 
        updateUserGroup, 
        deleteUserGroup,
        addUserToGroup,
        removeUserFromGroup
    };
}
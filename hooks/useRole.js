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

export default function useRole(callback) {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ ฟังก์ชันดึงข้อมูล Role (active เท่านั้น หรือทั้งหมด)
    const getAllRoles = async (all = false) => {
        setLoading(true);
        setError(null);
        try {
            const unsubscribe = onSnapshot(collection(db, "roles"), async (snapshot) => {
                let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // ✅ กรองเฉพาะ role ที่ active ถ้า all = false
                if (!all) {
                    items = items.filter(role => role.active);
                }

                // ✅ ดึงข้อมูล Users ของแต่ละ role
                for (const role of items) {
                    role.users = await fetchUsersData(role.users || []);
                }

                setRoles(items);
                callback(items);
            });

            return unsubscribe;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ ฟังก์ชันดึงข้อมูล Role ตาม id (active เท่านั้น หรือทั้งหมด)
    const getRoleById = async (id, all = false, callback) => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, "roles", id);
            const unsubscribe = onSnapshot(docRef, async (docSnap) => {
                if (docSnap.exists()) {
                    let roleData = { id: docSnap.id, ...docSnap.data() };

                    // ✅ ถ้า all = false และ role ไม่ active ให้ return null
                    if (!all && !roleData.active) {
                        callback(null);
                        return;
                    }

                    // ✅ ดึงข้อมูล Users
                    roleData.users = await fetchUsersData(roleData.users || []);
                    callback(roleData);
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
    };

    // ✅ เพิ่ม Role
    const addRole = async (data) => {
        try {
            const docRef = await addDoc(collection(db, "roles"), data);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    // ✅ อัปเดต Role
    const updateRole = async (id, data) => {
        try {
            const docRef = doc(db, "roles", id);
            await updateDoc(docRef, data);
            console.log("Document updated with ID: ", docRef.id);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    // ✅ ลบ Role
    const deleteRole = async (id) => {
        try {
            await deleteDoc(doc(db, "roles", id));
            console.log("Document deleted with ID: ", id);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    // ✅ เพิ่มผู้ใช้เข้า Role
    const addUserToRole = async (roleId, userIds) => {
        try {
            const roleRef = doc(db, "roles", roleId);

            // ✅ รองรับหลาย userId
            if (!Array.isArray(userIds)) userIds = [userIds];

            await updateDoc(roleRef, {
                users: arrayUnion(...userIds)
            });

            // ✅ อัปเดต users.role ใน Firestore
            for (const userId of userIds) {
                const userRef = doc(db, "users", userId);
                await updateDoc(userRef, { role: roleId });
            }

            console.log(`Users added to role ${roleId}:`, userIds);
        } catch (e) {
            console.error("Error adding user to role: ", e);
        }
    };

    // ✅ ลบผู้ใช้จาก Role
    const removeUserFromRole = async (roleId, userIds) => {
        try {
            const roleRef = doc(db, "roles", roleId);

            // ✅ รองรับหลาย userId
            if (!Array.isArray(userIds)) userIds = [userIds];

            await updateDoc(roleRef, {
                users: arrayRemove(...userIds)
            });

            // ✅ อัปเดต users.role เป็น "user"
            for (const userId of userIds) {
                const userRef = doc(db, "users", userId);
                await updateDoc(userRef, { role: "user" });
            }

            console.log(`Users removed from role ${roleId}:`, userIds);
        } catch (e) {
            console.error("Error removing user from role: ", e);
        }
    };

    useEffect(() => {
        const unsubscribe = getAllRoles();
        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { 
        roles, 
        loading, 
        error, 
        getAllRoles,
        getRoleById,
        addRole,
        updateRole,
        deleteRole,
        addUserToRole,
        removeUserFromRole
    };
};

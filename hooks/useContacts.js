export default function useContacts() {
    // ✅ เพิ่ม Contact
    const addContact = async (userId, contactData) => {
        try {
            const contactRef = collection(db, "contacts");
            await addDoc(contactRef, {
                ...contactData,
                userId,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    // ✅ ดึง Contact ตาม User
    const getContactsByUser = async (userId) => {
        try {
            const q = query(collection(db, "contacts"), where("userId", "==", userId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching contacts:", error);
            return [];
        }
    };

    // ✅ เพิ่ม Group Contact
    const addGroup = async (userId, groupName, members) => {
        try {
            const groupRef = collection(db, "contactGroups");
            await addDoc(groupRef, {
                userId,
                groupName,
                members,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding contact group:", error);
        }
    };

    return { addContact, getContactsByUser, addGroup };
}

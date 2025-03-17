import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export async function getFormattedCode(documentId, increment = 1, inputGroup, inputSubgroup) {
    try {
        const docRef = doc(db, "numbering", documentId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            throw new Error("Document not found");
        }

        const data = docSnap.data();
        const {
            prefix = "",
            suffix = "",
            number_digits = 5,
            start_number = 1,
            year = false,
            month = false,
            day = false,
            group = [],
            subgroup = [],
            formatCode = [],
        } = data;

        // แปลงค่าตามเงื่อนไขที่บันทึกไว้
        const yearValue = year ? new Date().getFullYear().toString().slice(-2) : "";
        const monthValue = month ? (new Date().getMonth() + 1).toString().padStart(2, "0") : "";
        const dayValue = day ? new Date().getDate().toString().padStart(2, "0") : "";
        
        // ค้นหาค่า group และ subgroup ตามที่ระบุใน courses
        const groupData = group.find(g => g.name === inputGroup || g.name === data.group) || {};
        const subgroupData = subgroup.find(sg => sg.name === inputSubgroup || sg.name === data.subgroup) || {};
        const groupValue = groupData.value || "";
        const subgroupValue = subgroupData.value || "";
        
        // คำนวณหมายเลขใหม่โดยใช้ start_number และ increment
        const newNumber = (start_number + increment - 1).toString().padStart(number_digits, "0");

        // เรียงลำดับตาม formatCode
        const generatedCode = formatCode.map((item) => {
            switch (item) {
                case "prefix": return prefix;
                case "group": return groupValue;
                case "subgroup": return subgroupValue;
                case "year": return yearValue;
                case "month": return monthValue;
                case "day": return dayValue;
                case "number_digits": return newNumber;
                case "suffix": return suffix;
                default: return "";
            }
        }).join("");

        return generatedCode;
    } catch (error) {
        console.error("Error generating format code:", error);
        return null;
    }
};

export async function updateLastNumber(documentId, number) {
    try {
        const docRef = doc(db, "numbering", documentId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.error(`Document ${documentId} not found, creating new one.`);
            await setDoc(docRef, { last_number: number + 1 });
        } else {
            await updateDoc(docRef, { last_number: number + 1 });
        }

        console.log(`Updated last_number for ${documentId} to ${number}`);
    } catch (error) {
        console.error("Error updating last number:", error);
    }
}


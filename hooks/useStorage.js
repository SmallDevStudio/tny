import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/services/firebase";
import { nanoid } from "nanoid";
import { collection, addDoc, setDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";


export const uploadFile = async (file, folder, onProgress) => {
    if (!file) return null;

    try {
        const fileId = nanoid(10);
        const fileRef = ref(storage, `upload/${folder}/${file.name}`);

        const metadata = {
            contentType: file.type, // ระบุประเภทไฟล์ เช่น image/png, application/pdf
        };

        const uploadTask = uploadBytesResumable(fileRef, file, metadata);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
        });

        await uploadTask;

        const fileURL = await getDownloadURL(fileRef);

        const fileData = {
            url: fileURL,
            file_name: file.name,
            mime_type: file.type,
            file_size: file.size,
            file_id: fileId,
        };

        await setDoc(doc(db, "files", fileId), fileData);

        return fileData;
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
};

export const deleteFile = async (folder, file) => {
    const fileId = file.file_id;
    const fileName = file.file_name;

    try {
        const fileRef = ref(storage, `upload/${folder}/${fileName}`);
        await deleteObject(fileRef);
        const docRef = doc(db, "files", fileId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting file:", error);
    }
};


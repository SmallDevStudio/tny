import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, db } from "@/services/firebase";
import { nanoid } from "nanoid";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export const uploadFile = async (file, folder, userId, onProgress) => {
    if (!file) return null;

    try {
        const fileId = nanoid(10);
        const fileRef = ref(storage, `upload/${file.name}`);
        const metadata = { contentType: file.type };

        const uploadTask = uploadBytesResumable(fileRef, file, metadata);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress(progress); // อัปเดตเปอร์เซ็นต์การอัปโหลด
                },
                (error) => {
                    console.error("Upload failed:", error);
                    reject(error);
                },
                async () => {
                    try {
                        const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

                        const fileData = {
                            url: fileURL,
                            file_name: file.name,
                            mime_type: file.type,
                            file_size: file.size,
                            file_id: fileId,
                            file_path: `upload/${file.name}`,
                            folder: folder ? folder : null,
                            keyword: [],
                            creator: userId,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };

                        await setDoc(doc(db, "files", fileId), fileData);
                        resolve(fileData);
                    } catch (error) {
                        console.error("Error getting file URL:", error);
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
};

export const deleteFile = async (fileId) => {
    try {
        const fileDocRef = doc(db, "files", fileId);
        const fileDoc = await getDoc(fileDocRef);

        if (!fileDoc.exists()) {
            console.warn(`File with ID ${fileId} not found in Firestore.`);
            return;
        }

        const fileData = fileDoc.data();
        const filePath = fileData.file_path; // ดึง path ของไฟล์จาก Firestore

        if (!filePath) {
            console.error("File path not found in database.");
            return;
        }

        const fileRef = ref(storage, filePath);

        // ลบไฟล์จาก Firebase Storage
        await deleteObject(fileRef);
        console.log(`File deleted from storage: ${filePath}`);

        // ลบข้อมูลไฟล์จาก Firestore
        await deleteDoc(fileDocRef);
        console.log(`File deleted from Firestore: ${fileId}`);
    } catch (error) {
        console.error("Error deleting file:", error);
    }
};

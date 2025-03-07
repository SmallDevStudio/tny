import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { IoClose } from "react-icons/io5";
import { db } from "@/services/firebase";
import { updateDoc, doc, setDoc, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { Tooltip } from "@mui/material";

export default function Tags({ tags, setTags }) {
    const [inputTag, setInputTag] = useState("");
    const { lang } = useLanguage();

    const handleKeyDownTags = async (e) => {
        const value = e.target.value;
        if (e && e.keyCode === 32) {
            const tagUnique = tags.filter((tag) => tag.toLowerCase() === (value.trim()).toLowerCase());
            if (tagUnique.length === 0) {
                value.trim();
                const docRef = collection(db, "tags");
                const docSnap = await getDocs(docRef);
                const docData = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const tagUnique = docData.filter((tag) => tag.name.toLowerCase() === (value.trim()).toLowerCase());
                if (tagUnique.length === 0) {
                    await addDoc(docRef, { name: value.trim() });
                }
                setTags([...tags, value.trim()]);
                setInputTag("");
            } else {
                setInputTag("");
            }
        }
    };

    const handleDeleteTag = async (index) => {
        const docRef = collection(db, "tags");
        const docSnap = await getDocs(docRef);
        const docData = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const tagRef = docData.find((tag) => tag.name.toLowerCase() === tags[index].toLowerCase());
        if (tagRef) {
            await deleteDoc(doc(db, "tags", tagRef.id));
        }
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-row items-center flex-wrap gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
            {tags && tags.map((tag, index) => (
                <div key={index}
                    className="flex flex-row items-center gap-1 p-1 bg-gray-200 rounded-full"
                >
                    <span>{tag}</span>
                    <Tooltip title={lang["delete"]} placement="bottom" arrow>
                        <IoClose size={15} className="cursor-pointer text-red-500 hover:text-red-600" onClick={() => handleDeleteTag(index)} />
                    </Tooltip>
                </div>
            ))}
            <input
                type="text"
                id="tags"
                name="tags"
                value={inputTag}
                placeholder={lang["tags_placeholder"]}
                className="focus:outline-none w-auto min-w-10"
                onChange={(e) => setInputTag(e.target.value)}
                onKeyDown={handleKeyDownTags}
            />
        </div>
    );
}
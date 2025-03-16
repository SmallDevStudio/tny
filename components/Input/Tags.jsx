import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { IoClose } from "react-icons/io5";
import { db } from "@/services/firebase";
import { updateDoc, doc, setDoc, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { Tooltip } from "@mui/material";
import useDB from "@/hooks/useDB";

export default function Tags({ tags, setTags }) {
    const [tagsData, setTagsData] = useState([]);
    const [inputTag, setInputTag] = useState("");
    const [filterTags, setFilterTags] = useState([]);
    const { lang } = useLanguage();
    const { subscribe } = useDB("tags");

    useEffect(() => {
        const unsubscribe = subscribe((tagsData) => {
            setTagsData(tagsData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (inputTag) {
            setFilterTags(tagsData.filter((tag) => tag.name.toLowerCase().includes(inputTag.toLowerCase())));
        } else {
            setFilterTags([]);
        }
    }, [inputTag, tagsData]);

    const handleKeyDownTags = async (e) => {
        const value = e.target.value.trim();
        if (e.keyCode === 32 && value) {
            if (!tags.includes(value.toLowerCase())) {
                const docRef = collection(db, "tags");
                const docSnap = await getDocs(docRef);
                const docData = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const tagUnique = docData.filter((tag) => tag.name.toLowerCase() === value.toLowerCase());
                if (tagUnique.length === 0) {
                    await addDoc(docRef, { name: value });
                }
                setTags([...tags, value]);
            }
            setInputTag("");
        }
    };

    const handleDeleteTag = async (index) => {
        const tagToDelete = tags[index];
        setTags(tags.filter((_, i) => i !== index));

        const docRef = collection(db, "tags");
        const docSnap = await getDocs(docRef);
        const docData = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const tagRef = docData.find((tag) => tag.name.toLowerCase() === tagToDelete.toLowerCase());

        if (tagRef) {
            await deleteDoc(doc(db, "tags", tagRef.id));
        }
    };

    return (
        <div className="relative flex flex-row items-center flex-wrap gap-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
            {tags.map((tag, index) => (
                <div key={index} className="flex flex-row items-center gap-1 p-1 bg-gray-200 rounded-full">
                    <span>{tag}</span>
                    <Tooltip title={lang["delete"]} placement="bottom" arrow>
                        <IoClose size={15} className="cursor-pointer text-red-500 hover:text-red-600" onClick={() => handleDeleteTag(index)} />
                    </Tooltip>
                </div>
            ))}
            <div className="relative">
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={inputTag}
                    placeholder={lang["tags_placeholder"]}
                    className="focus:outline-none w-auto min-w-10"
                    onChange={(e) => setInputTag(e.target.value)}
                    onKeyDown={handleKeyDownTags}
                    onBlur={() => setTimeout(() => setFilterTags([]), 200)} // ปิด dropdown เมื่อ focus หลุด
                />
                {filterTags.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-md mt-1 z-10">
                        {filterTags.map((tag, index) => (
                            <div key={index}
                                className="flex items-center gap-1 p-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={(e) => e.preventDefault()} // ป้องกัน dropdown หายก่อนคลิก
                                onClick={() => {
                                    setTags([...tags, tag.name]);
                                    setInputTag("");
                                    setFilterTags([]);
                                }}
                            >
                                <span>{tag.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

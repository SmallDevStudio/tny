import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Tooltip } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "../btn/UploadImage";
import { nanoid } from "nanoid";
import { db } from "@/services/firebase";
import { updateDoc, doc, setDoc } from "firebase/firestore";
import { deleteFile } from "@/hooks/useStorage";
import SelectForm from "@/components/Selected/SelectForm";
import Loading from "../utils/Loading";
import Tags from "../Input/Tags";

export default function CoursesForm({ onClose, course, isNewCourse }) {
    const { lang } = useLanguage();
    const { data: session } = useSession();
    const userId = session?.user?.userId;
    const [form, setForm] = useState({
        code: "",
        name: { th: "", en: "" },
        description: { th: "", en: "" },
        cover: "",
        thumbnail: "",
        group: "",
        subgroup: "",
        price: "",
    });
    const [loading, setLoading] = useState(false);
    const [cover, setCover] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (course) {
            setForm({
                code: course.id || "",
                name: course.name || { th: "", en: "" },
                description: course.description || { th: "", en: "" },
                cover: course.cover || {},
                thumbnail: course.thumbnail || {},
                group: course.group || "",
                subgroup: course.subgroup || "",
                price: course.price || "",
            });
        } else if (isNewCourse) {
            generateCode(); // ✅ Generate รหัสใหม่เมื่อเป็น Course ใหม่
            setTags([]);
        }
    }, [course]);

    const generateCode = () => {
        const codeNumber = nanoid(10);
        const year = new Date().getFullYear();
        const newyear = year.toString().substr(-2);
        const month = new Date().getMonth() + 1;
        const newMonth = month < 10 ? `0${month}` : month;
        const code = `C${newyear}${newMonth}${codeNumber}`;

        setForm({ ...form, code: code });
    };

    const handleClear = () => {
        setForm({
            code: "",
            name: { th: "", en: "" },
            description: { th: "", en: "" },
            image: "",
            group: "",
            subgroup: "",
            price: "",
        });
        setTags([]);
        onClose();
    };

    const handleCover = (file) => {
        setCover(file[0]);
    };

    const handleThumbnail = (file) => {
        setThumbnail(file[0]);
    };

    const handleRemoveCover = () => {
        deleteFile(cover.file_id);
        setCover(null);
    };

    const handleRemoveThumbnail = () => {
        deleteFile(thumbnail.file_id);
        setThumbnail(null);
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        const data = {
            id: form.code,
            name: { th: form.name.th, en: form.name.en },
            description: { th: form.description.th, en: form.description.en },
            cover: cover ? cover : null,
            thumbnail: thumbnail? thumbnail : null,
            group: form.group,
            subgroup: form.subgroup,
            price: form.price,
            tags: tags,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: session?.user?.userId,
        };
    
        try {
            if (course) {
                const courseRef = doc(db, "courses", course.id);
                await updateDoc(courseRef, data);
                toast.success(lang["course_updated_successfully"]);
            } else {
                const courseRef = doc(db, "courses", data.id);
                await setDoc(courseRef, data);
                toast.success(lang["course_added_successfully"]);
            }
    
            handleClear();
        } catch (error) {
            console.error(error);
            toast.error(lang["error_occurred"]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="bg-white dark:bg-gray-800 max-w-[750px] w-full h-full rounded-lg shadow-lg">
            <div className="flex flex-col w-full h-full">
                <div className="flex flex-row px-4 py-2 items-center justify-between bg-orange-500 w-full">
                    <h1 className="text-2xl font-semibold text-white">
                        {course ? lang["edit_course"] : lang["create_course"]}
                    </h1>
                    <Tooltip title={lang["close"]} placement="bottom">
                    <button
                        type="button"
                        className="text-white bg-transparent hover:bg-orange-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                        onClick={onClose}
                    >
                        <IoClose size={22}/>
                    </button>
                    </Tooltip>
                </div>
                <div className="flex flex-col p-4 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                            {lang["code"]}
                        </label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={form?.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder={lang["code_placeholder"]}
                            disabled={!isNewCourse}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                                {lang["image"]}
                            </label>
                            {/* Image */}
                            {cover && (
                                <div className="relative w-full h-[200px] rounded-lg">
                                    <Image
                                        src={cover?.url}
                                        alt="mockup"
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover rounded-lg"
                                        priority
                                    />
                                    <div className="absolute top-0 right-1">
                                        <Tooltip title={lang["remove"]} arrow>
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                onClick={() => handleRemoveCover()}
                                            >
                                                <IoClose size={10} />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            )}
                            <UploadImage 
                                onUpload={(file) => handleCover(file)} 
                                folder="courses" 
                                size={20} 
                                userId={userId}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                                {lang["thumbnail"]}
                            </label>
                            {/* Image */}
                            {thumbnail && (
                                <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                                    <Image
                                        src={thumbnail?.url}
                                        alt="mockup"
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover rounded-lg"
                                        priority
                                    />
                                    <div className="absolute top-0 right-1">
                                        <Tooltip title={lang["remove"]} arrow>
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                onClick={() => handleRemoveThumbnail()}
                                            >
                                                <IoClose size={10} />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            )}
                            <UploadImage 
                                onUpload={(file) => handleThumbnail(file)} 
                                folder="courses" 
                                size={20} 
                                userId={userId}
                            />
                        </div>
                    </div>
                    <div className="">
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                            {lang["name"]}
                        </label>
                        <input
                            type="text"
                            id="name.th"
                            name="name.th"
                            value={form?.name?.th}
                            onChange={(e) => setForm({ ...form, name: { ...form.name, th: e.target.value } })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder={lang["name_placeholder"] + " (th)"}
                            required
                        />

                        <input          
                            type="text"
                            id="name.en"
                            name="name.en"
                            value={form?.name?.en}
                            onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder={lang["name_placeholder"] + " (en)"}
                            required
                        />
                    </div>

                    <div className="">
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                            {lang["description"]}
                        </label>
                        <div className="grid grid-cols-2 gap-1">
                            <textarea
                                type="text"
                                id="description.th"
                                name="description.th"
                                value={form?.description?.th}
                                onChange={(e) => setForm({ ...form, description: { ...form.description, th: e.target.value } })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder={lang["description_placeholder"] + " (th)"}
                                rows={4}
                            />

                            <textarea         
                                type="text"
                                id="description.en"
                                name="description.en"
                                value={form?.description?.en}
                                onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder={lang["description_placeholder"] + " (en)"}
                                rows={4}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                                {lang["group"]}
                            </label>
                            <SelectForm 
                                collection={"groups"}
                                value={form.group}
                                setValue={(value) => setForm({ ...form, group: value })}
                            />
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                                {lang["subgroup"]}
                            </label>
                            <SelectForm 
                                collection={"subgroups"}
                                value={form.group}
                                setValue={(value) => setForm({ ...form, group: value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                            {lang["price"]}
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder={lang["price_placeholder"]}
                        />
                    </div>

                    <div>
                        <label htmlFor="Tages"
                            className="block text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            {lang["tags"]}
                        </label>
                        <Tags tags={tags} setTags={setTags} />
                        
                    </div>
                </div>
                <div className="flex flex-row gap-2 p-4">
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg"
                        onClick={handleSubmit}
                    >
                        {lang["save"]}
                    </button>

                    <button
                        type="button"
                        className="w-full py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
                        onClick={handleClear}
                    >
                        {lang["cancel"]}
                    </button>
                </div>
            </div>
        </div>
    );
}


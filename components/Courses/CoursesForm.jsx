import { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Tooltip } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "../btn/UploadImage";
import { nanoid } from "nanoid";

export default function CoursesForm({ onClose, course }) {
    const { lang, t } = useLanguage();
    const { data: session } = useSession();
    const router = useRouter();
    const { add, update } = useDB("courses");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        if (form.code === undefined) {
            generateCode();
        };
    }, []);

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
        setForm({});
        onClose();
    };

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
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                                {lang["image"]}
                            </label>
                            {/* Image */}
                            {form?.image && (
                                <div className="relative w-full h-40 rounded-lg overflow-hidden">
                                    <Image
                                        src={form?.image?.url}
                                        alt="mockup"
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover"
                                        priority
                                    />
                                </div>
                            )}
                            <UploadImage onUpload={(url) => setForm({ ...form, image: url })} size={20} />
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
                            onChange={(e) => setForm({ ...form, form:{...form.name, th: e.target.value }})}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder={lang["name_placeholder"] + " (th)"}
                            required
                        />

                        <input          
                            type="text"
                            id="name.en"
                            name="name.en"
                            value={form?.name?.en}
                            onChange={(e) => setForm({ ...form, form:{...form.name, en: e.target.value }})}
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
                                onChange={(e) => setForm({ ...form, form:{...form.description, th: e.target.value }})}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder={lang["description_placeholder"] + " (th)"}
                                rows={4}
                            />

                            <textarea         
                                type="text"
                                id="description.en"
                                name="description.en"
                                value={form?.description?.en}
                                onChange={(e) => setForm({ ...form, form:{...form.description, en: e.target.value }})}
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
                            <select
                                name="group"
                                id="group"
                                value={form.group}
                                onChange={(e) => setForm({ ...form, group: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            >
                                <option value="">{lang["select_group"]}</option>
                                <option value=""></option>
                                <option value="1">{lang["add_group"]}</option>
                            </select>
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                                {lang["subgroup"]}
                            </label>
                            <select
                                name="subgroup"
                                id="subgroup"
                                value={form.subgroup}
                                onChange={(e) => setForm({ ...form, subgroup: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            >
                                <option value="">{lang["select_subgroup"]}</option>
                                <option value=""></option>
                                <option value="1">{lang["add_subgroup"]}</option>
                            </select>
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
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder={lang["price_placeholder"]}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-2 p-4">
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg"
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


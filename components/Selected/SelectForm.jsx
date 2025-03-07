import { useEffect, useState } from "react";
import useLanguage from "@/hooks/useLanguage";
import useDB from "@/hooks/useDB";
import { Divider } from "@mui/material";

export default function SelectForm({ collection, value, setValue }) {
    const [selectedData, setSelectedData] = useState([]);
    const [optionName, setOptionName] = useState("");
    const { lang } = useLanguage();
    const { subscribe, add } = useDB(collection);

    useEffect(() => {
        const unsubscribe = subscribe((data) => {
            if (data) {
                setSelectedData(data);
            }
        });

        return () => unsubscribe(); // ✅ หยุดฟังเมื่อ component unmount
    }, []);

    const handleCreateOption = async () => {
        if (!optionName.trim()) return;

        const newOption = { name: optionName, value: optionName.toLowerCase().replace(/\s+/g, "_") };
        await add(newOption); // ✅ เพิ่มข้อมูลลงใน database
        setOptionName("");
        setValue('');
    };

    return (
        <div className="relative">
            <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            >
                <option value="">{lang["select_option"]}</option>
                {selectedData.length > 0 ? (
                    selectedData.map((data) => (
                        <option key={data.id} value={data.value}>{data.name}</option>
                    ))
                ) : (
                    <option value="">{lang["null_select_option"]}</option>
                )}
                <option disabled>──────────</option>
                <option value="create">{lang["create_select_option"]}</option>
            </select>

            {value === "create" && (
                <div className="mt-2 flex items-center gap-2">
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder={lang["create_option_placeholder"]}
                        value={optionName}
                        onChange={(e) => setOptionName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateOption()}
                    />
                    <button
                        className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={handleCreateOption}
                    >
                        {lang["save"]}
                    </button>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import useDB from "@/hooks/useDB";
import { getFormattedCode } from "@/utils/getFormattedCode";

export default function FormatCode({ data, setCode, documentId, group, subgroup, isNewCode }) {
    const [formattedCode, setFormattedCode] = useState(null);
    const [codeData, setCodeData] = useState(null);
    const { lang } = useLanguage();
    const { getById } = useDB("numbering");

    useEffect(() => {
        if (isNewCode) {
            const unsubscribe = getById(documentId, async (document) => {
                if (document) {
                    setCodeData(document);
                    const formattedCode = await getFormattedCode(document.document, document.last_number);
                    setFormattedCode(formattedCode);
                }
            });
            return () => unsubscribe();
        }
    }, [isNewCode]);

    useEffect(() => {
        const formatCode = async () => {
            if (data) {
                const formattedCode = await getFormattedCode(codeData?.document, course.id, group, subgroup);
                setFormattedCode(formattedCode);
            }
        };
        formatCode();
    }, [data]);

    useEffect(() => {
        const formatCode = async () => {
            if (!codeData) return;

            if (group || subgroup) {
                // ถ้า group หรือ subgroup มีค่า ให้เรียก getFormattedCode ใหม่
                const newFormattedCode = await getFormattedCode(codeData.document, codeData.last_number, group, subgroup);
                setFormattedCode(newFormattedCode);
            } else {
                // ถ้าไม่มี group และ subgroup ให้กลับไปใช้ค่าเดิม
                const defaultFormattedCode = await getFormattedCode(codeData.document, codeData.last_number);
                setFormattedCode(defaultFormattedCode);
            }
        };

        formatCode();
    }, [group, subgroup, codeData]);

    const updateCode = {
        docEntry: codeData?.start_number + codeData?.last_number - 1,
        code: formattedCode,
    }

    useEffect(() => {
        if (formattedCode) {
            setCode(updateCode);
        }
    }, [formattedCode]);

    return (
        <div
            id="code"
            name="code"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
            {formattedCode}
        </div>
    );
}

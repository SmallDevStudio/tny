import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import useDB from "@/hooks/useDB";
import { getFormattedCode } from "@/utils/getFormattedCode";

export default function FormatCode({
  data,
  code,
  setCode,
  documentId,
  isNewCode,
  lastNumber,
}) {
  const [formattedCode, setFormattedCode] = useState(null);
  const { lang } = useLanguage();
  const { getById } = useDB("numbering");

  useEffect(() => {
    const formatCode = async () => {
      if (isNewCode) {
        const formattedCode = await getFormattedCode(documentId, lastNumber);
        setFormattedCode(formattedCode);
      } else {
        const formattedCode = await getFormattedCode(documentId, data.id);
        setFormattedCode(formattedCode);
      }
    };
    formatCode();
  }, []);

  const getUpdateCode = () => {
    if (isNewCode) {
      const updateCode = {
        docEntry: data?.start_number + data?.last_number - 1,
        code: formattedCode,
      };
      return updateCode;
    } else {
      const updateCode = {
        docEntry: data?.start_number + data?.last_number - 1,
        code: formattedCode,
      };
      return updateCode;
    }
  };

  useEffect(() => {
    if (formattedCode) {
      setCode(getUpdateCode);
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

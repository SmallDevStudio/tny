import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import axios from "axios";
import useLanguage from "@/hooks/useLanguage";
import moment from "moment";
import "moment/locale/th";
import { Slide, Dialog } from "@mui/material";
import NumberingForm from "@/components/Numbering/NumberingForm";
import { getFormattedCode } from "@/utils/getFormattedCode";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase"; // ต้อง import firebase db
import dynamic from "next/dynamic";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DocumentNumbering() {
  const [data, setData] = useState([]);
  const [formattedCodes, setFormattedCodes] = useState({});
  const [lastNumber, setLastNumber] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { subscribe } = useDB("numbering");
  const { lang } = useLanguage();

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      if (data) {
        setData(data);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLastNumbers = async () => {
      const result = {};

      for (const item of data) {
        try {
          const snapshot = await getDocs(collection(db, item.document));

          const maxId = snapshot.docs
            .map((doc) => parseInt(doc.id, 10))
            .filter((id) => !isNaN(id))
            .reduce((max, curr) => Math.max(max, curr), 0);

          result[item.id] = maxId + 1; // ✅ last_number = max + 1
        } catch (err) {
          console.warn(`ไม่พบ collection: ${item.document}`);
          result[item.id] = 1; // ✅ ถ้าไม่มี collection → ใส่ 1
        }
      }

      setLastNumber(result);
    };

    if (data.length > 0) {
      fetchLastNumbers();
    }
  }, [data]);

  useEffect(() => {
    const fetchAllCodes = async () => {
      const result = {};
      for (const item of data) {
        const nextNum = lastNumber[item.id] || 1;
        const code = await getFormattedCode(item.document, nextNum);
        result[item.id] = code;
      }
      setFormattedCodes(result);
    };

    if (data.length > 0 && Object.keys(lastNumber).length > 0) {
      fetchAllCodes();
    }
  }, [data, lastNumber]);

  const handleOpenForm = () => {
    setSelectedItem(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedItem(null);
    setOpenForm(false);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenForm(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 mx-auto">
      <h1 className="text-2xl font-semibold p-4">
        {lang["document_number_management"]}
      </h1>
      <span onClick={handleOpenForm}>add</span>
      <table className="w-full table-auto text-xs">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-1 w-12">#</th>
            <th className="px-4 py-1">{lang["documents"]}</th>
            <th className="px-4 py-1 w-56">{lang["document_number"]}</th>
            <th className="px-4 py-1 w-56">{lang["document_number_use"]}</th>
            <th className="px-4 py-1 w-56">{lang["created_at"]}</th>
            <th className="px-4 py-1 w-56">{lang["updated_at"]}</th>
            <th className="px-4 py-1 ">{lang["tools"]}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 ">
          {data &&
            data.map((item, index) => {
              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td>{index + 1}</td>
                  <td>{item.document}</td>
                  <td>{item.previewCode}</td>
                  <td>{formattedCodes[item.id] || lang["loading"]}</td>
                  <td>{moment(item.created_at).format("ll")}</td>
                  <td>{moment(item.updated_at).format("ll")}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)}>
                        {lang["edit"]}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex flex-row justify-between items-center p-2 text-xs">
        <div className="flex gap-2">
          <span>{lang["record_length"]}:</span>
          <span>{data.length > 0 ? data.length : 0}</span>
        </div>
      </div>
      <Dialog
        open={openForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseForm}
        aria-labelledby="alert-dialog-slide-title"
      >
        <NumberingForm
          document={selectedItem}
          onClose={handleCloseForm}
          newNumbering={!selectedItem}
        />
      </Dialog>
    </div>
  );
}

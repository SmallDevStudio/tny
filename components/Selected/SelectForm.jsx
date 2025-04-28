import React, { useEffect, useState } from "react";
import useLanguage from "@/hooks/useLanguage";
import useDB from "@/hooks/useDB";
import { Divider, Slide, Dialog } from "@mui/material";
import { db } from "@/services/firebase";
import {
  getDocs,
  query,
  collection,
  onSnapshot,
  where,
  doc,
  updateDoc,
  setDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Line, RiPencilLine } from "react-icons/ri";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectForm({ page, value, setValue, type }) {
  const [group, setGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [optionName, setOptionName] = useState({ th: "", en: "" });
  const [openDialogModal, setopenDialogModalModal] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!type || !page) return;

    const q = query(collection(db, "options"), where("page", "==", page));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroup(groups);
    });

    return () => unsubscribe();
  }, [type, page]);

  useEffect(() => {
    if (value === "create") {
      setopenDialogModalModal(true);
    }
  }, [value]);

  const handleCreateOption = async () => {
    if (!optionName?.th?.trim() && !optionName?.en?.trim()) return;

    const valueKey = optionName.en.toLowerCase().replace(/\s+/g, "_");

    try {
      if (selectedGroup) {
        // 👇 Update Option
        await updateDoc(doc(db, "options", selectedGroup.id), {
          name: {
            th: optionName.th,
            en: optionName.en,
          },
          value: valueKey,
          page: page,
          type: type, // << ต้องมี type ด้วย
          updated_at: new Date().toISOString(),
        });
        setSelectedGroup(null);
      } else {
        // 👇 Create New Option
        const newOption = {
          name: {
            th: optionName.th,
            en: optionName.en,
          },
          value: valueKey,
          page: page,
          type: type, // << ต้องมี type ด้วย
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log("newOption", newOption);

        // ต้องสร้าง doc ใหม่ให้ firebase สร้าง id ให้อัตโนมัติ
        await addDoc(collection(db, "options"), newOption);
      }

      // รีเซ็ต state
      setOptionName({ th: "", en: "" });
      setValue("");
      setopenDialogModalModal(false);
    } catch (err) {
      console.error("Error creating/updating option:", err);
    }
  };

  const handleCloseDialog = () => {
    setValue("");
    setOptionName("");
    setSelectedGroup(null);
    setopenDialogModalModal(false);
  };

  const handleRemoveOption = async (group) => {
    setSelectedGroup(group);
    const result = await Swal.fire({
      title: lang["are_you_sure"],
      text: lang["you_wont_be_able_to_revert_this"],
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: lang["yes_delete_it"],
      cancelButtonText: lang["cancel"],
    });

    if (result.isConfirmed) {
      try {
        // 1. ลบ group
        await remove(group.id);

        setSelectedGroup(null);
      } catch (err) {
        console.error("Error deleting group or page:", err);
      }
    }
  };

  const handleUpdateOption = (group) => {
    setSelectedGroup(group);
    setOptionName(group.name);
  };

  return (
    <div className="relative">
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="">{lang["select_option"]}</option>
        {group.length > 0 ? (
          group.map((data, index) => (
            <option key={index} value={data.value}>
              {t(data.name)}
            </option>
          ))
        ) : (
          <option value="">{lang["null_select_option"]}</option>
        )}
        <option disabled>──────────</option>
        <option value="create">{lang["create_select_option"]}</option>
      </select>

      <Dialog
        open={openDialogModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            width: "100% !important",
            maxWidth: "600px !important",
          },
        }}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex flex-row items-center justify-between w-full p-2 bg-orange-500 text-white">
            <h2>จัดการ group</h2>
            <IoClose onClick={handleCloseDialog} size={24} />
          </div>
          {/* Groups */}
          <div className="flex flex-col w-full px-2 py-1">
            {group.length > 0
              ? group.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 items-center gap-2"
                  >
                    <span className="text-sm">{t(item.name)}</span>
                    <div className="flex flex-row items-center gap-2">
                      <RiPencilLine
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleUpdateOption(item)}
                      />
                      <RiDeleteBin5Line
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveOption(item)}
                      />
                    </div>
                  </div>
                ))
              : null}
          </div>
          {/* form */}
          <div className="flex flex-col gap-2 p-2">
            <div>
              <label htmlFor="th">TH:</label>
              <input
                type="text"
                id="th"
                name="th"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={"TH"}
                value={optionName.th}
                onChange={(e) =>
                  setOptionName({ ...optionName, th: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="en">EN:</label>
              <input
                type="text"
                id="en"
                name="en"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={"EN"}
                value={optionName.en}
                onChange={(e) =>
                  setOptionName({ ...optionName, en: e.target.value })
                }
              />
            </div>
            <button
              className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={handleCreateOption}
            >
              {lang["save"]}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

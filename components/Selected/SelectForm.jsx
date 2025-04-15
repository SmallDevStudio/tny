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

export default function SelectForm({ collectionPath, value, setValue, page }) {
  const [group, setGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [optionName, setOptionName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { lang } = useLanguage();
  const { subscribe, add, update, remove } = useDB(collectionPath);

  useEffect(() => {
    if (!collectionPath || !page) return;

    const q = query(collection(db, collectionPath), where("page", "==", page));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroup(groups);
    });

    return () => unsubscribe();
  }, [collectionPath, page]);

  useEffect(() => {
    if (value === "create") {
      setOpenDialog(true);
    }
  }, [value]);

  const generateSlug = (text) => {
    const raw = typeof text === "string" ? text : text?.en || text?.th || "";
    return raw
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // ลบอักขระพิเศษ
      .replace(/\s+/g, "-"); // แปลงช่องว่างเป็น `-`
  };

  const handleCreateOption = async () => {
    if (!optionName.trim()) return;

    const valueSlug = optionName.toLowerCase().replace(/\s+/g, "_");
    const slug = generateSlug(valueSlug);

    try {
      if (selectedGroup) {
        // 👇 แก้ไข group
        await update(selectedGroup.id, {
          name: optionName,
          value: valueSlug,
          page: page,
        });

        // 👇 แก้ไข page
        const q = query(
          collection(db, "pages"),
          where("slug", "==", `${page}/${selectedGroup.value}`)
        );
        const snapshot = await getDocs(q);

        const pageRef = snapshot.docs[0]?.ref;
        if (pageRef) {
          await updateDoc(pageRef, {
            name: optionName,
            slug: `${page}/${slug}`,
          });
        }

        setSelectedGroup(null);
      } else {
        // 👇 เพิ่ม group ใหม่
        const newOption = {
          name: optionName,
          value: valueSlug,
          page: page,
        };
        await add(newOption);

        const pageData = {
          name: optionName,
          title: {
            en: "",
            th: "",
          },
          description: {
            en: "",
            th: "",
          },
          slug: `${page}/${slug}`,
          template: { base: "default", page },
          sections: [],
          type: "dynamic_page",
          createdAt: new Date(),
        };

        await addDoc(collection(db, "pages"), pageData);
      }

      // รีเซ็ต state
      setOptionName("");
      setValue("");
      setOpenDialog(false);
    } catch (err) {
      console.error("Error creating/updating:", err);
    }
  };

  const handleCloseDialog = () => {
    setValue("");
    setOptionName("");
    setSelectedGroup(null);
    setOpenDialog(false);
  };

  const deletePageBySlug = async (slug) => {
    const q = query(collection(db, "pages"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    const batchDeletes = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(batchDeletes);
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

        // 2. ลบ page
        const slug = `${page}/${group.value}`;
        await deletePageBySlug(slug);

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
          group.map((data) => (
            <option key={data.id} value={data.value}>
              {data.name}
            </option>
          ))
        ) : (
          <option value="">{lang["null_select_option"]}</option>
        )}
        <option disabled>──────────</option>
        <option value="create">{lang["create_select_option"]}</option>
      </select>

      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex flex-row items-center justify-between w-full p-2 bg-orange-500 text-white">
            <h2>จัดการ group</h2>
            <IoClose onClick={handleCloseDialog} size={24} />
          </div>
          {/* Groups */}
          <div className="flex flex-col w-full p-2">
            {group.length > 0
              ? group.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 items-center gap-2"
                  >
                    <span className="text-sm">{item.name}</span>
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
          <div className="flex flex-row items-center gap-2 p-2">
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
        </div>
      </Dialog>
    </div>
  );
}

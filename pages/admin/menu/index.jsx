import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import useLanguage from "@/hooks/useLanguage";
import { Dialog, Slide, Divider } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaPlus, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [items, setItems] = useState([]);
  const [itemForm, setItemForm] = useState({
    title: { th: "", en: "" },
    url: "",
  });
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [previewMenu, setPreviewMenu] = useState([]);
  const [customMenu, setCustomMenu] = useState([]);
  const [selectedCustomMenu, setSelectedCustomMenu] = useState(null);
  const [filteredCustomMenu, setFilteredCustomMenu] = useState([]);
  const [openMenuItemsForm, setOpenMenuItemsForm] = useState(null);
  const [style, setStyle] = useState({ position: "horizontal" });
  const { lang, t } = useLanguage();

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getDocs(collection(db, "menu"));
      setMenu(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchPages = async () => {
      const data = await getDocs(collection(db, "pages"));
      setPages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchPages();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "custom-menu"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCustomMenu(data);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updated = pages.filter(
      (p) => !previewMenu.find((item) => item.id === p.id)
    );
    setFilteredPages(updated);
  }, [pages, previewMenu]);

  useEffect(() => {
    if (menu.length > 0) {
      const saved = menu[0];

      // เชื่อมเมนูที่ save ไว้กับ pages เพื่อดึงข้อมูล id และ slug กลับมา
      const mergedPreview = saved.items.map((item, index) => {
        const matchedPage = pages.find((p) => "/" + p.slug === item.url);
        return {
          ...item,
          id: matchedPage?.id || index.toString(), // ถ้าไม่มีให้ใช้ index เป็น fallback id
          slug: matchedPage?.slug || item.url?.replace("/", ""),
        };
      });

      setPreviewMenu(mergedPreview);
      setStyle(saved.style || { position: "horizontal" });
    }
  }, [menu, pages]); // ✅ ให้ทำงานใหม่เมื่อ menu หรือ pages ถูกโหลด

  const handleAddToPreview = (item) => {
    if (!previewMenu.find((i) => i.id === item.id)) {
      setPreviewMenu([...previewMenu, item]);

      // ถ้าเป็น custom menu (ไม่มี slug)
      if (!item.slug) {
        setCustomMenu((prev) => prev.filter((c) => c.id !== item.id));
      } else {
        setPages((prev) => prev.filter((p) => p.id !== item.id));
      }
    }
  };

  const handleRemoveFromPreview = (pageId) => {
    const targetId = String(pageId); // เผื่อ id มีชนิดต่างกัน เช่น number vs string
    const removedItem = previewMenu.find((p) => String(p.id) === targetId);

    if (!removedItem) {
      console.warn("ไม่พบรายการที่ต้องลบ", pageId);
      return;
    }

    // ✅ อัปเดต previewMenu โดยกรองออก
    setPreviewMenu((prev) => prev.filter((p) => String(p.id) !== targetId));

    // ✅ คืนรายการกลับไปยัง filteredPages ถ้าไม่ซ้ำ
    if (!removedItem.slug) {
      setCustomMenu((prev) => [...prev, removedItem]);
    } else {
      setPages((prev) => [...prev, removedItem]);
    }
  };

  const handleMove = (index, direction) => {
    const newPreview = [...previewMenu];
    const targetIndex =
      direction === "up" || direction === "left" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < previewMenu.length) {
      [newPreview[index], newPreview[targetIndex]] = [
        newPreview[targetIndex],
        newPreview[index],
      ];
      setPreviewMenu(newPreview);
    }
  };

  const handleSaveMenu = async () => {
    try {
      const menuData = {
        style: style,
        items: previewMenu.map((item, index) => ({
          order: index,
          name: item.slug || "",
          title: item.title || "",
          url: item.slug ? "/" + item.slug : "",
          id: item.id || index.toString(), // เพิ่ม id ตอน save ด้วย
        })),
        updatedAt: new Date(),
      };

      const menuRef = collection(db, "menu");
      const existingMenus = await getDocs(menuRef);

      if (!existingMenus.empty) {
        // ✅ อัปเดตเมนูเดิม (ใช้ตัวแรก)
        const firstMenu = existingMenus.docs[0];
        await updateDoc(doc(db, "menu", firstMenu.id), menuData);
        toast.success("อัปเดตเมนูเรียบร้อยแล้ว");
      } else {
        // ✅ เพิ่มเมนูใหม่
        menuData.createdAt = new Date();
        await addDoc(menuRef, menuData);
        toast.success("สร้างเมนูใหม่เรียบร้อยแล้ว");
      }
    } catch (error) {
      console.error("Error saving menu:", error);
      toast.error("บันทึกเมนูล้มเหลว");
    }
  };

  const handleOpenMenuItem = (type) => {
    setOpenMenuItemsForm(type);
  };

  const handleCloseMenuItem = () => {
    setOpenMenuItemsForm(null);
  };

  const handleSaveCustomMenuItem = async () => {
    const customRef = collection(db, "custom-menu");

    const newMenuItem = {
      title: itemForm.title,
      url: itemForm.url,
    };

    try {
      if (itemForm.id) {
        const docRef = doc(db, "custom-menu", itemForm.id);
        await updateDoc(docRef, newMenuItem);
        toast.success("อัปเดตเมนูเรียบร้อย");
      } else {
        await addDoc(customRef, newMenuItem);
        toast.success("เพิ่มเมนูใหม่เรียบร้อย");
      }
      handleClerForm();
    } catch (error) {
      console.error("Error saving custom menu item:", error);
      toast.error("บันทึกเมนูล้มเหลว");
    }
  };

  const handleEditCustomMenuItem = (item) => {
    setItemForm(item);
    handleOpenMenuItem(true);
  };

  const handleDeleteCustomMenuItem = async (id) => {
    const customRef = doc(db, "custom-menu", id);
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบรายการนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(customRef);
        toast.success("ลบเมนูเรียบร้อยแล้ว");
      } catch (error) {
        console.error("Error deleting custom menu item:", error);
        toast.error("ลบเมนูล้มเหลว");
      }
    }
  };

  const handleClerForm = () => {
    setItemForm({
      title: "",
      url: "",
    });
    handleCloseMenuItem();
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-screen px-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {lang["menu-management"]}
        </h1>
      </div>

      {/* Preview Section */}
      <div className="mt-4 p-4">
        <h2 className="text-xl font-bold mb-2">Preview</h2>
        <div className="flex flex-row items-center gap-2">
          <label htmlFor="position">{lang["position"]}</label>
          <select
            id="position"
            className="border border-gray-400 rounded-xl p-1"
            value={style.position}
            onChange={(e) => setStyle({ ...style, position: e.target.value })}
          >
            <option value="horizontal">{lang["horizontal"]}</option>
            <option value="vertical">{lang["vertical"]}</option>
          </select>
        </div>

        <div
          className={`mt-4 flex justify-center p-4 border rounded-md gap-2 ${
            style.position === "horizontal" ? "flex-row" : "flex-col"
          }`}
        >
          {previewMenu.map((item, index) => (
            <div
              key={item.id || index}
              onContextMenu={(e) => {
                e.preventDefault();
                if (confirm("ลบเมนูนี้หรือไม่?"))
                  handleRemoveFromPreview(item.id);
              }}
              className="relative border border-gray-300 px-4 py-2 rounded-md bg-white cursor-pointer dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-gray-600"
            >
              {t(item.title)}
              <div className="absolute -top-2 -right-2 cursor-pointer text-red-500">
                <IoClose onClick={() => handleRemoveFromPreview(item.id)} />
              </div>
              <div className="flex gap-1 mt-1 justify-center">
                {index > 0 && (
                  <button
                    onClick={() =>
                      handleMove(
                        index,
                        style.position === "horizontal" ? "left" : "up"
                      )
                    }
                    className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-400 rounded"
                  >
                    ⬆️⬅️
                  </button>
                )}
                {index < previewMenu.length - 1 && (
                  <button
                    onClick={() =>
                      handleMove(
                        index,
                        style.position === "horizontal" ? "right" : "down"
                      )
                    }
                    className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-400 rounded"
                  >
                    ⬇️➡️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row justify-center">
        <button
          type="button"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          onClick={handleSaveMenu}
        >
          {lang["save"]}
        </button>
      </div>

      {/* Pages Selector */}
      <div className="flex flex-row items-center gap-2 px-4 py-2 mt-4">
        <div
          className="bg-orange-500 text-white p-2 rounded-lg cursor-pointer"
          onClick={() => handleOpenMenuItem("menu")}
        >
          <FaPlus />
        </div>
      </div>
      <div className="border border-gray-400 rounded-xl ">
        <h3 className="p-4 border-b border-gray-400 bg-orange-500 rounded-t-xl text-white">
          {lang["menu"]}
        </h3>
        <div className="px-4 pt-4">
          <h5 className="font-bold">{lang["pages"]}</h5>
          <Divider />
        </div>
        <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-4">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="flex flex-row items-center border border-gray-400 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleAddToPreview(page)}
            >
              {t(page.title)}
            </div>
          ))}
        </div>
        {/* Custom Menu */}
        {customMenu.length > 0 && (
          <div className="pb-4">
            <div className="px-4 pb-4">
              <h5 className="font-bold">Custom Menu</h5>
              <Divider />
            </div>
            <div className="grid grid-cols-1 gap-2 px-4 lg:grid-cols-4">
              {customMenu.map((page) => (
                <div
                  key={page.id}
                  className="flex flex-row items-center border border-gray-400 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleAddToPreview(page)}
                >
                  {t(page.title)}
                  <div className="flex items-center gap-2 ml-auto">
                    <FaEdit
                      size={16}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCustomMenuItem(page);
                      }}
                    />
                    <IoClose
                      size={24}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomMenuItem(page.id);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {openMenuItemsForm && (
        <div className="p-4">
          <div className="flex flex-col border border-gray-400 p-4 rounded-xl mt-4 gap-2">
            <div className="flex flex-row items-center justify-between w-full">
              <h2>เพิ่ม menu</h2>
              <IoClose
                size={24}
                className="cursor-pointer"
                onClick={handleClerForm}
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="title">{lang["title"]}</label>
              <input
                type="text"
                id="title-th"
                className="border border-gray-400 rounded-xl p-1"
                value={itemForm.title?.th || ""}
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    title: {
                      ...itemForm.title,
                      th: e.target.value,
                    },
                  })
                }
                placeholder="TH"
              />

              <input
                type="text"
                id="title-en"
                className="border border-gray-400 rounded-xl p-1"
                value={itemForm.title?.en || ""}
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    title: {
                      ...itemForm.title,
                      en: e.target.value,
                    },
                  })
                }
                placeholder="EN"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="url">{lang["url"]}</label>
              <input
                type="text"
                id="url"
                className="border border-gray-400 rounded-xl p-1"
                value={itemForm.url}
                onChange={(e) =>
                  setItemForm({ ...itemForm, url: e.target.value })
                }
                placeholder="URL"
              />
            </div>
            <div className="flex flex-row justify-center gap-4">
              <button
                type="button"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                onClick={handleSaveCustomMenuItem}
              >
                {lang["save"]}
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleClerForm}
              >
                {lang["cancel"]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

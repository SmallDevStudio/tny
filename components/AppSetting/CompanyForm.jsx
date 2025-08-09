import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import { toast } from "react-toastify";
import Image from "next/image";
import useLanguage from "@/hooks/useLanguage";
import { IoClose, IoImage } from "react-icons/io5";
import { Dialog, Slide, Tooltip } from "@mui/material";
import Upload from "../utils/Upload";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CompanyForm() {
  const [company, setCompany] = useState({
    logo: {},
    name: { th: "", en: "" },
    address: { th: "", en: "" },
    phone: [],
    email: "",
  });
  const [phoneInput, setPhoneInput] = useState(""); // ✅ state สำหรับเก็บค่าที่พิมพ์อยู่
  const [open, setOpen] = useState(false);

  const { getById, update } = useDB("appdata");
  const { lang } = useLanguage();

  useEffect(() => {
    const unsubscribe = getById("company", (companyData) => {
      if (companyData) {
        setCompany(companyData);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    try {
      await update("company", company, { merge: true });
      toast.success("บันทึกข้อมูลสำเร็จแล้ว!");
    } catch (error) {
      console.error(error);
      toast.error("บันทึกข้อมูลไม่สำเร็จ!");
    }
  };

  const handleUploadLogo = (file) => {
    setCompany({ ...company, logo: file[0] });
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const keyDownHandler = (e) => {
    if (e.key === "Enter" || e.key === " " || e.code === "Space") {
      e.preventDefault();
      const trimmedPhone = phoneInput.trim();
      if (trimmedPhone) {
        setCompany((prev) => ({
          ...prev,
          phone: [...(prev.phone || []), trimmedPhone], // ✅ ถ้าไม่มี ให้ใช้ []
        }));
        setPhoneInput("");
      }
    }
  };

  const handleDeletePhone = (index) => {
    setCompany((prev) => {
      const updatedPhone = [...prev.phone];
      updatedPhone.splice(index, 1);
      return { ...prev, phone: updatedPhone };
    });
  };

  return (
    <div className="flex flex-col gap-2 mt-4 sm:grid-cols-2 sm:gap-4">
      {/* Logo */}
      <div className="flex flex-col gap-2 w-full">
        <div>
          {company?.logo?.url && (
            <div className="relative">
              <Image
                src={company.logo.url}
                width={100}
                height={100}
                alt="logo"
                className="rounded-lg"
              />
            </div>
          )}
        </div>
        <Tooltip title={lang["upload_image"]} arrow>
          <div
            className="flex flex-row items-center gap-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 rounded-xl p-2 cursor-pointer w-[250px]"
            onClick={handleClickOpen}
          >
            <IoImage size={24} />
            <div className="flex flex-col">
              <span className="font-bold text-orange-500">
                {lang["upload_image"]}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lang["upload_image_desc"]}
              </span>
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Company Name */}
      <div className="sm:col-span-2">
        <label className="block mb-1 text-sm font-bold text-gray-900 dark:text-white">
          ชื่อบริษัท
        </label>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="ชื่อบริษัท (ภาษาไทย)"
            value={company?.name?.th}
            onChange={(e) =>
              setCompany((prev) => ({
                ...prev,
                name: { ...prev.name, th: e.target.value },
              }))
            }
            className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full"
          />
          <input
            type="text"
            placeholder="ชื่อบริษัท (ภาษาอังกฤษ)"
            value={company?.name?.en}
            onChange={(e) =>
              setCompany((prev) => ({
                ...prev,
                name: { ...prev.name, en: e.target.value },
              }))
            }
            className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full"
          />
        </div>
      </div>

      {/* Address */}
      <div className="sm:col-span-2">
        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          ที่อยู่
        </label>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <textarea
            placeholder="ที่อยู่ (ภาษาไทย)"
            value={company?.address?.th}
            onChange={(e) =>
              setCompany((prev) => ({
                ...prev,
                address: { ...prev.address, th: e.target.value },
              }))
            }
            rows={2}
            className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full"
          />
          <textarea
            placeholder="ที่อยู่ (ภาษาอังกฤษ)"
            value={company?.address?.en}
            onChange={(e) =>
              setCompany((prev) => ({
                ...prev,
                address: { ...prev.address, en: e.target.value },
              }))
            }
            rows={2}
            className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="w-full">
        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          เบอร์โทร
        </label>
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg p-2.5">
          {company?.phone?.map((phone, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full"
            >
              <span>{phone}</span>
              <IoClose
                className="text-red-500 cursor-pointer"
                onClick={() => handleDeletePhone(index)}
              />
            </div>
          ))}
          <input
            type="text"
            placeholder="กด Enter หรือ Space เพื่อเพิ่ม"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            onKeyDown={keyDownHandler}
            className="flex-1 bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Email */}
      <div className="w-full">
        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          อีเมล
        </label>
        <input
          type="email"
          placeholder="อีเมล"
          value={company?.email}
          onChange={(e) =>
            setCompany((prev) => ({ ...prev, email: e.target.value }))
          }
          className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full"
        />
      </div>

      {/* Submit */}
      <div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl w-20"
        >
          บันทึก
        </button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Upload
          handleCloseForm={handleClose}
          setFiles={handleUploadLogo}
          folder={"logo"}
        />
      </Dialog>
    </div>
  );
}

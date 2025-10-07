import { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { LuFileX, LuFileText } from "react-icons/lu";
import { toast } from "react-toastify";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import AddressModal from "./AddressModal";

export default function ReceiptModal({
  onClose,
  receipt,
  selectedReceipt,
  selectedAddress,
}) {
  const [selectedOption, setSelectedOption] = useState("");
  const [address, setAddress] = useState(null);

  const { data: session } = useSession();
  const userId = session?.user?.userId;

  useEffect(() => {
    if (selectedReceipt) {
      setSelectedOption(selectedReceipt);
    }
  }, [selectedReceipt]);

  const handleSelectOption = (option) => {
    if (selectedOption === option) {
      setSelectedOption("");
    } else {
      setSelectedOption(option);
    }
  };

  const handleConfirm = () => {
    if (selectedOption === "noReceipt") {
      receipt(selectedOption);
      selectedAddress(null);
      onClose();
    } else {
      if (!address) {
        toast.error("กรุณาเลือกที่อยู่สำหรับใบกำกับภาษี");
      } else {
        receipt(selectedOption);
        selectedAddress(address);
        onClose();
      }
    }
  };

  return (
    <div className="flex flex-col p-4 w-min-[300px] md:min-w-[400px] lg:min-w-[500px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">
            เลือกรูปแบบใบกำกับภาษี
          </h1>
          <IoClose
            className="inline-block mr-2 text-orange-500 cursor-pointer"
            size={30}
            onClick={onClose}
          />
        </div>
      </div>

      <Divider flexItem orientation="horizontal" sx={{ my: 2 }} />

      {/* Receipt */}
      <div className="flex flex-col gap-4 p-4">
        <div
          className={`flex items-center gap-4 border border-gray-300 rounded-lg p-4 cursor-pointer
            ${
              selectedOption === "noReceipt"
                ? "border-orange-500 bg-orange-50 text-black"
                : "text-gray-400"
            }
            `}
        >
          <input
            type="radio"
            name="noReceipt"
            id="noReceipt"
            className="cursor-pointer h-5 w-5"
            checked={selectedOption === "noReceipt"}
            onChange={() => handleSelectOption("noReceipt")}
          />
          <LuFileX size={40} />
          <h3>ไม่ต้องการใบกํากับภาษี</h3>
        </div>
        <div>
          <div
            className={`flex items-center gap-4 border border-gray-300 rounded-lg p-4 cursor-pointer
            ${
              selectedOption === "paperReceipt"
                ? "border-orange-500 bg-orange-50 text-black"
                : "text-gray-400"
            }
            `}
          >
            <input
              type="radio"
              name="paperReceipt"
              id="paperReceipt"
              className="cursor-pointer h-5 w-5"
              checked={selectedOption === "paperReceipt"}
              onChange={() => handleSelectOption("paperReceipt")}
            />
            <LuFileText size={40} />
            <h3>แบบกระดาษ</h3>
          </div>
          {selectedOption === "paperReceipt" && (
            <div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-4 mt-1">
              <h5>กรุณากรอกที่อยู่ใบกํากับภาษี</h5>
              <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />
              <AddressModal userId={userId} onProcess={setAddress} />
            </div>
          )}
        </div>
        <div
          className={`flex items-center gap-4 border border-gray-300 rounded-lg p-4 cursor-pointer
            ${
              selectedOption === "etaxReceipt"
                ? "border-orange-500 bg-orange-50 text-black"
                : "text-gray-400"
            }
            `}
        >
          <input
            type="radio"
            name="etaxReceipt"
            id="etaxReceipt"
            className="cursor-pointer h-5 w-5"
            checked={selectedOption === "etaxReceipt"}
            onChange={() => handleSelectOption("etaxReceipt")}
          />
          <LuFileText size={40} />
          <h3>แบบอิเล็กทรอนิกส์</h3>
        </div>
        {selectedOption === "etaxReceipt" && (
          <div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-4 mt-1">
            <h5>กรุณากรอกที่อยู่ใบกํากับภาษี</h5>
            <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />
            <AddressModal userId={userId} onProcess={setAddress} />
          </div>
        )}
      </div>

      <Divider flexItem orientation="horizontal" sx={{ my: 2 }} />

      <div>
        <button
          className={`bg-orange-500 text-white px-4 py-2 rounded w-full ${
            !selectedOption ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="button"
          onClick={handleConfirm}
          disabled={!selectedOption}
        >
          ตกลง
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import { IoClose, IoCardOutline } from "react-icons/io5";
import { BsBank } from "react-icons/bs";
import { RiQrScanLine } from "react-icons/ri";
import { toast } from "react-toastify";
import Image from "next/image";

export default function PaymentModal({ onClose, payment, data }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    if (data) {
      setSelectedPaymentMethod(data);
    }
  }, [data]);

  const handleSelectOption = (option) => {
    if (selectedPaymentMethod === option) {
      setSelectedPaymentMethod("");
    } else {
      setSelectedPaymentMethod(option);
    }
  };

  const handleConfirm = () => {
    if (!selectedPaymentMethod) {
      toast.error("กรุณาเลือกวิธีการชำระเงิน");
    } else {
      payment(selectedPaymentMethod);
      onClose();
    }
  };

  return (
    <div className="flex flex-col p-4 w-min-[300px] md:min-w-[400px] lg:min-w-[500px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">
            เลือกรูปแบบการชำระเงิน
          </h1>
          <IoClose
            className="inline-block mr-2 text-orange-500 cursor-pointer"
            size={30}
            onClick={onClose}
          />
        </div>
      </div>

      <Divider flexItem orientation="horizontal" sx={{ my: 2 }} />

      {/* Payment Options */}
      <div className="flex flex-col gap-4 p-4">
        {/* creditCard */}
        <div
          className={`flex flex-col gap-4 border border-gray-300 rounded-lg p-4 cursor-pointer
          ${
            selectedPaymentMethod === "creditCard"
              ? "border-orange-500 bg-orange-50 text-black"
              : "text-gray-400"
          }
          `}
        >
          <div
            className={`flex items-center gap-4 
            
          `}
          >
            <input
              type="radio"
              name="creditCard"
              id="creditCard"
              className="cursor-pointer h-5 w-5"
              checked={selectedPaymentMethod === "creditCard"}
              onChange={() => handleSelectOption("creditCard")}
            />
            <IoCardOutline size={40} />
            <h3>บัตรเครดิต / บัตรเดบิต</h3>
          </div>
          {selectedPaymentMethod === "creditCard" && (
            <div className="pl-9 text-sm text-gray-500">
              <p>เงื่อนไขการชำระเงิน :</p>
              <p>ชำระเงินด้วยบัตรที่ออกโดยธนาคารในประเทศไทยเท่านั้น</p>
              <Image
                src="/images/card_logo.jpeg"
                alt="Payment Methods"
                width={100}
                height={20}
                className="mt-2"
              />
            </div>
          )}
        </div>

        {/* qrPayment */}
        <div
          className={`flex flex-col gap-4 border border-gray-300 rounded-lg p-4 cursor-pointer
          ${
            selectedPaymentMethod === "qrPayment"
              ? "border-orange-500 bg-orange-50 text-black"
              : "text-gray-400"
          }
          `}
        >
          <div className={`flex items-center gap-4`}>
            <input
              type="radio"
              name="qrPayment"
              id="qrPayment"
              className="cursor-pointer h-5 w-5"
              checked={selectedPaymentMethod === "qrPayment"}
              onChange={() => handleSelectOption("qrPayment")}
            />
            <RiQrScanLine size={40} />
            <h3>QR - Code สแกนชำระเงิน</h3>
          </div>
          {selectedPaymentMethod === "qrPayment" && (
            <div className="pl-9 text-sm text-gray-500">
              <p className="font-semibold">เงื่อนไขการชำระเงิน :</p>
              <p>
                ลูกค้าสามารถใช้ Mobile Banking
                ของธนาคารที่ได้รับอนุญาตการชำระเงินด้วย QR Code
                ลูกค้ากรุณาทำรายการภายในเวลา10 นาที การชำระเงินไม่มีค่าธรรมเนียม
                และ ไม่ต้องแจ้งโอนเงิน
              </p>
              <p className="mt-2 font-semibold">วิธีการชำระเงิน :</p>
              <p>
                1. หลังจากลูกค้ากดยืนยันคำสั่งซื้อ ระบบจะแสดง QR Code
                สำหรับชำระเงิน
              </p>
              <p>
                2. ใช้ Mobile Banking ของธนาคารใดก็ได้ Scan QR Code
                เพื่อชำระเงิน
              </p>
              <p>
                (กรณีซื้อผ่านมือถือให้ Capture QR Code เพื่อใช้ในการชำระผ่าน
                Mobile Banking)
              </p>
              <p>
                ** ระบบจะเห็นการชำระเงินของคุณลูกค้าอัตโนมัติ
                โดยลูกค้าไม่ต้องแจ้งชำระเงิน **
              </p>
            </div>
          )}
        </div>

        {/* bankTransfer */}
        <div
          className={`flex flex-col gap-4 border border-gray-300 rounded-lg p-4 cursor-pointer
          ${
            selectedPaymentMethod === "bankTransfer"
              ? "border-orange-500 bg-orange-50 text-black"
              : "text-gray-400"
          }
          `}
        >
          <div
            className={`flex items-center gap-4
            
          `}
          >
            <input
              type="radio"
              name="bankTransfer"
              id="bankTransfer"
              className="cursor-pointer h-5 w-5"
              checked={selectedPaymentMethod === "bankTransfer"}
              onChange={() => handleSelectOption("bankTransfer")}
            />
            <BsBank size={40} />
            <h3>โอนเงินผ่านธนาคาร</h3>
          </div>
          {selectedPaymentMethod === "bankTransfer" && (
            <div className="pl-9 text-sm text-gray-500">
              <p>เงื่อนไขการชำระเงิน :</p>
              <p>
                ชำระเงินด้วยโอนเงินผ่านธนาคาร เมื่อลูกค้าชำระเงิน
                ให้ไปที่หน้าคำสั่งซื้อ แล้วลูกค้ากรุณาแจ้งชำระเงิน
                พร้อมแนบหลักฐานการชำระเงิน
              </p>
              <div className="flex flex-col justify-center items-center mt-4 w-full">
                <Image
                  className="w-32 h-32 object-contain"
                  src="/images/payments/kbank.png"
                  alt="kbank"
                  width={50}
                  height={50}
                />
                <p>ชื่อธนาคาร : กสิกรไทย</p>
                <p>เลขที่บัญชี : 123-4-56789-0</p>
                <p>ชื่อบัญชี : บริษัท ตัวอย่าง จำกัด</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            className={`bg-orange-500 text-white px-4 py-2 rounded w-full ${
              !selectedPaymentMethod ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="button"
            onClick={handleConfirm}
            disabled={!selectedPaymentMethod}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}

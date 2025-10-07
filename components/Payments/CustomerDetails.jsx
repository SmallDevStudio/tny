import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Divider, Slide, Dialog } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import { FaPlus, FaMinus } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuFileX, LuFileText } from "react-icons/lu";
import { FaCircleInfo } from "react-icons/fa6";
import { IoClose, IoCardOutline } from "react-icons/io5";
import { BsBank } from "react-icons/bs";
import { RiQrScanLine } from "react-icons/ri";
import Image from "next/image";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowDown,
} from "react-icons/io";
import {
  removeFromCart,
  clearCart,
  addToCart,
  decreaseQuantity,
} from "@/store/slices/cartSlice";
import { useDispatch } from "react-redux";
import ReceiptModal from "./ReceiptModal";
import PaymentModal from "./PaymentModal";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function CustomerDetails({
  cart = [],
  total = 0,
  vat = 0,
  grandTotal = 0,
}) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [open, setOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const handleOpen = (type) => {
    setTypeOpen(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTypeOpen("");
  };

  const handleSubmitOrder = () => {
    if (!selectedReceipt) {
      toast.error("กรุณาเลือกใบกำกับภาษี");
      return;
    }
    if (selectedReceipt !== "noReceipt" && !selectedAddress) {
      toast.error("กรุณาเลือกที่อยู่สำหรับใบกำกับภาษี");
      return;
    }
    if (!selectedPayment) {
      toast.error("กรุณาเลือกช่องทางชำระเงิน");
      return;
    }
  };

  const canProceed = Boolean(selectedPayment && selectedReceipt);
  const proceedBtnClass = canProceed
    ? "bg-orange-500 text-white px-4 py-2 rounded w-full"
    : "bg-gray-400 text-white px-4 py-2 rounded w-full";

  const money = new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const N = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:px-6 w-full">
      {/* Details Form */}
      <div className="flex flex-col w-full">
        <div className="flex items-center mb-4 bg-white p-4 rounded-lg border-b border-gray-300 shadow-sm">
          <IoIosArrowBack
            className="inline-block mr-2 text-orange-500 cursor-pointer"
            size={30}
            onClick={() => router.back()}
          />
          <h2 className="text-xl font-semibold text-orange-500">
            ข้อมูลผู้สั่งซื้อ
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* VAT/Receipt Section */}
          <div className="flex flex-col bg-white p-4 border-b border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">ใบกำกับภาษี/ใบเสร็จรับเงิน</h3>
              {selectedReceipt && (
                <div
                  className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-orange-500"
                  onClick={() => handleOpen("receipt")}
                >
                  <span>เปลี่ยน</span>
                  <IoIosArrowForward />
                </div>
              )}
            </div>
            <div className="flex flex-col mt-2">
              {/* Receipt Option */}
              {selectedReceipt ? (
                <div className="flex flex-col gap-2 bg-gray-50 p-4 border border-gray-300 rounded-lg">
                  {selectedReceipt === "noReceipt" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-orange-500">
                        <LuFileX className="" size={28} />
                        <p className="font-semibold text-xl">
                          ไม่ขอใบกำกับภาษี
                        </p>
                      </div>
                      <div className="text-sm text-gray-700 pl-10">
                        <p className="font-semibold">
                          <FaCircleInfo className="inline-block mr-1" />
                          เงื่อนไข
                        </p>
                        <p>
                          *กรณีลูกค้าเลือกไม่รับใบกำกับภาษี
                          หากต้องการขอใบกำกับภาษี
                          เต็มรูปแบบอีกครั้งสามารถขอได้ภายใน 1
                          วันที่สั่งซื้อเท่านั้น
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedReceipt === "paperReceipt" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 text-orange-500">
                        <LuFileText className="" size={28} />
                        <div className="flex flex-col">
                          <p className="font-semibold text-xl">
                            ใบกำกับภาษีแบบกระดาษ
                          </p>
                          <div className="text-xs text-gray-700">
                            <p className="font-semibold">
                              <FaCircleInfo className="inline-block mr-1" />
                              เงื่อนไข
                            </p>
                            <p>
                              *กรณีลูกค้าเลือกใบกำกับภาษีแบบกระดาษ
                              จะจัดส่งใบกำกับภาษีตามที่อยู่ในคำสั่งซื้อ
                              ไม่สามารถเปลี่ยนแปลงที่อยู่ได้
                              กรุณาตรวจสอบที่อยู่ให้ถูกต้อง ก่อนยืนยันคำสั่งซื้อ
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm border border-gray-300 rounded-lg p-2 mx-4">
                        <p className="font-semibold">
                          ที่อยู่สำหรับใบกำกับภาษี
                        </p>
                        <div className="pl-4">
                          {selectedAddress ? (
                            <div className="text-sm text-gray-700">
                              <p className="font-semibold">
                                {selectedAddress.name}{" "}
                                <span className="text-gray-500">
                                  (
                                  {selectedAddress.type === "personal"
                                    ? "บุคคลธรรมดา"
                                    : "นิติบุคคล/บริษัท"}
                                  )
                                </span>
                              </p>
                              <p className="text-gray-500">
                                เลขผู้เสียภาษี: {selectedAddress.taxId}
                              </p>
                              <p>
                                {selectedAddress.address}{" "}
                                {selectedAddress.subdistrict}{" "}
                                {selectedAddress.district}{" "}
                                {selectedAddress.province}{" "}
                                {selectedAddress.postalCode}
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-500">
                              กรุณาเลือกที่อยู่ในค่าสินค้า
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedReceipt === "etaxReceipt" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-orange-500">
                        <LuFileText className="" size={28} />
                        <p className="font-semibold text-xl">
                          ใบกำกับภาษีแบบอิเล็กทรอนิกส์
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="flex items-center justify-center gap-2 bg-gray-100 min-h-32 border border-gray-300 rounded-lg p-2 cursor-pointer"
                  onClick={() => handleOpen("receipt")}
                >
                  <FaPlus className="text-gray-400" size={24} />
                  <p className="text-gray-400">เลือกรูปแบบใบกำกับภาษี</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="flex flex-col bg-white rounded-lg p-4 border-b border-gray-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">ช่องทางชําระเงิน</h3>
              {selectedPayment && (
                <div
                  className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-orange-500"
                  onClick={() => handleOpen("payment")}
                >
                  <span>เปลี่ยน</span>
                  <IoIosArrowForward />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 bg-gray-50 p-4 border border-gray-300 rounded-lg">
              {selectedPayment ? (
                <div>
                  {selectedPayment === "creditCard" && (
                    <div>
                      <div className="flex items-center gap-2 text-orange-500">
                        <IoCardOutline className="" size={28} />
                        <p className="font-semibold text-xl">
                          ชําระด้วยบัตรเครดิต/บัตรเดบิต
                        </p>
                      </div>
                      <div className="pl-9 text-sm text-gray-500">
                        <p>เงื่อนไขการชำระเงิน :</p>
                        <p>
                          ชำระเงินด้วยบัตรที่ออกโดยธนาคารในประเทศไทยเท่านั้น
                        </p>
                        <Image
                          src="/images/card_logo.jpeg"
                          alt="Payment Methods"
                          width={100}
                          height={20}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}
                  {selectedPayment === "bankTransfer" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-orange-500">
                        <BsBank size={28} />
                        <p className="font-semibold text-xl">
                          ชําระด้วยโอนเงิน
                        </p>
                      </div>

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
                    </div>
                  )}
                  {selectedPayment === "qrPayment" && (
                    <div>
                      <div className="flex items-center gap-2 text-orange-500">
                        <RiQrScanLine size={40} />
                        <h3 className="font-semibold text-xl">
                          QR - Code สแกนชำระเงิน
                        </h3>
                      </div>
                      <Divider
                        flexItem
                        orientation="horizontal"
                        sx={{ my: 2 }}
                      />
                      <div className="pl-9 text-sm text-gray-500">
                        <p className="font-semibold">เงื่อนไขการชำระเงิน :</p>
                        <p>
                          ลูกค้าสามารถใช้ Mobile Banking
                          ของธนาคารที่ได้รับอนุญาตการชำระเงินด้วย QR Code
                          ลูกค้ากรุณาทำรายการภายในเวลา10 นาที
                          การชำระเงินไม่มีค่าธรรมเนียม และ ไม่ต้องแจ้งโอนเงิน
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
                          (กรณีซื้อผ่านมือถือให้ Capture QR Code
                          เพื่อใช้ในการชำระผ่าน Mobile Banking)
                        </p>
                        <p>
                          ** ระบบจะเห็นการชำระเงินของคุณลูกค้าอัตโนมัติ
                          โดยลูกค้าไม่ต้องแจ้งชำระเงิน **
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="flex items-center justify-center gap-2 bg-gray-100 min-h-32 border border-gray-300 rounded-lg p-2 cursor-pointer"
                  onClick={selectedReceipt ? () => handleOpen("payment") : null}
                >
                  <FaPlus className="text-gray-400" size={24} />
                  <p className="text-gray-400">เลือกช่องทางชําระเงิน</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border border-gray-300 rounded-lg p-4 w-full md:w-[400px] bg-white shadow-sm">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            name="discount"
            className="border rounded-lg p-1 w-full"
            placeholder="โค้ดส่วนลด"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            ใช้
          </button>
        </div>
        <div className="flex justify-between gap-4">
          จำนวนเงิน:
          <span>฿{money.format(N(total))}</span>
        </div>
        <div className="flex justify-between gap-4">
          ส่วนลด:
          <span>฿{money.format(0)}</span>
        </div>
        <div className="flex justify-between gap-4">
          VAT (7%):
          <span>฿{money.format(N(vat))}</span>
        </div>
        <div className="flex justify-between gap-4">
          จำนวนเงินที่ต้องชำระเงิน:
          <span>฿{money.format(N(grandTotal))}</span>
        </div>

        <div className="hidden md:block">
          <Divider flexItem sx={{ my: 2 }} />
          <button
            onClick={handleSubmitOrder}
            className={proceedBtnClass}
            type="button"
            disabled={!canProceed}
          >
            ดำเนินการชำระเงิน
          </button>
        </div>
      </div>

      <div className="md:hidden flex justify-center bg-white p-2 rounded-lg border border-gray-300 shadow-sm">
        <button
          onClick={handleSubmitOrder}
          className={proceedBtnClass}
          type="button"
          disabled={!canProceed}
        >
          ดำเนินการชำระเงิน
        </button>
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ "MuiDialog-paper": { margin: 0, width: "100%" } }}
      >
        {typeOpen === "receipt" && (
          <ReceiptModal
            onClose={handleClose}
            receipt={setSelectedReceipt}
            selectedReceipt={selectedReceipt}
            selectedAddress={setSelectedAddress}
          />
        )}
        {typeOpen === "payment" && (
          <PaymentModal
            onClose={handleClose}
            payment={setSelectedPayment}
            data={selectedPayment}
          />
        )}
      </Dialog>
    </div>
  );
}

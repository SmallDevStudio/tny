import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import { FaPlus, FaMinus } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  removeFromCart,
  clearCart,
  addToCart,
  decreaseQuantity,
} from "@/store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.items);
  const router = useRouter();
  const dispatch = useDispatch();

  const { t } = useLanguage();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <div className="flex flex-col justify-center items-center max-w-screen-lg mx-auto">
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <h1 className="text-2xl font-bold mb-4 text-orange-500">
            ตะกร้าของคุณ
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-between">
              <div>
                <ul className="max-h-60 overflow-y-auto space-y-2 list-disc">
                  {cart.map((item) => (
                    <li
                      key={item.courseId}
                      className="flex justify-between text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-700 dark:text-gray-100">
                          {t(item.title)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-2">
                            {/* ปุ่มลด */}
                            <button
                              onClick={() => {
                                if (item.quantity === 1) {
                                  dispatch(
                                    removeFromCart({ courseId: item.courseId })
                                  );
                                } else {
                                  dispatch({
                                    type: "cart/decreaseQuantity",
                                    payload: { courseId: item.courseId },
                                  });
                                }
                              }}
                              className="bg-gray-50 border border-gray-300 rounded p-1 text-gray-600 hover:bg-gray-100"
                            >
                              <FaMinus size={10} />
                            </button>

                            <span className="text-gray-800 dark:text-white">
                              {item.quantity}
                            </span>

                            {/* ปุ่มเพิ่ม */}
                            <button
                              onClick={() => dispatch(addToCart(item))}
                              className="bg-gray-50 border border-gray-300 rounded p-1 text-gray-600 hover:bg-gray-100"
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>

                          {/* ปุ่มลบทั้งหมด */}
                          <button
                            onClick={() =>
                              dispatch(
                                removeFromCart({ courseId: item.courseId })
                              )
                            }
                          >
                            <RiDeleteBin6Line
                              className="text-red-500 hover:text-red-700"
                              size={18}
                            />
                          </button>
                        </div>
                      </div>
                      <div className="text-right text-gray-800 dark:text-white">
                        ฿
                        {Number(item.price * item.quantity).toLocaleString(
                          "th-TH"
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-lg font-semibold">
                รวม: ฿{Number(total).toLocaleString("th-TH")}
              </p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between gap-4">
                จำนวนเงิน:
                <span>฿{Number(total).toLocaleString("th-TH")}</span>
              </div>
              <div className="flex justify-between gap-4">
                ส่วนลด:
                <span>฿0</span>
              </div>
              <div className="flex justify-between gap-4">
                จำนวนเงินที่ต้องชำระเงิน:
                <span>฿{Number(total).toLocaleString("th-TH")}</span>
              </div>
              <div className="flex gap-4 mt-4">
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
              <Divider flexItem sx={{ my: 2 }} />
              <div className="flex justify-center">
                <button
                  onClick={() => router.push("/checkout/payment")}
                  className={
                    cart.length === 0
                      ? "bg-gray-400 text-white px-4 py-2 rounded"
                      : "bg-orange-500 text-white px-4 py-2 rounded"
                  }
                  type="button"
                  disabled={cart.length === 0}
                >
                  ดำเนินการชำระเงิน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

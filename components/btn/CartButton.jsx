// components/btn/CartButton.js
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { LuShoppingCart } from "react-icons/lu";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import { useState, useRef, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  removeFromCart,
  clearCart,
  addToCart,
  decreaseQuantity,
} from "@/store/slices/cartSlice";
import { useDispatch } from "react-redux";
import useLanguage from "@/hooks/useLanguage";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function CartButton({ size = 24 }) {
  const router = useRouter();
  const items = useSelector((state) => state.cart.items);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const { t } = useLanguage();

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  console.log("Cart items:", items);

  // ปิด dropdown เมื่อคลิกนอก element
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip title="Cart">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="text-gray-600 hover:text-orange-500 dark:text-white dark:hover:text-orange-500 relative"
        >
          <Badge badgeContent={items.length} color="error">
            <LuShoppingCart size={size} />
          </Badge>
        </button>
      </Tooltip>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg border dark:border-gray-700 p-4">
          <h3 className="text-md font-bold mb-2 text-gray-800 dark:text-white">
            รายการในตะกร้า
          </h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ไม่มีสินค้าในตะกร้า
            </p>
          ) : (
            <>
              <ul className="max-h-60 overflow-y-auto space-y-2 list-disc">
                {items.map((item) => (
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
              <div className="border-t border-gray-200 dark:border-gray-600 mt-3 pt-3 text-right">
                <p className="font-bold text-gray-900 dark:text-white">
                  รวมทั้งหมด: ฿{Number(totalAmount).toLocaleString("th-TH")}
                </p>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/checkout");
                  }}
                  className="mt-2 w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                >
                  ไปชำระเงิน
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

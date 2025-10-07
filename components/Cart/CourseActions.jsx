// components/CourseActions.js
import { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { addToCart, clearCart } from "@/store/slices/cartSlice";
import { FaCartPlus } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { Tooltip } from "@mui/material";

export default function CourseActions({ course }) {
  const [isUsePayment, setIsUsePayment] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const { subscribe, getById, update } = useDB("appdata");
  const { t, lang } = useLanguage();

  useEffect(() => {
    const unsubscribe = getById("app", (appData) => {
      if (appData) {
        setIsUsePayment(appData.isUsePayment);
      }
    });
    return () => unsubscribe(); // ✅ หยุดฟังเมื่อ component unmount
  }, []);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        courseId: course.id,
        title: course.name,
        price: course.price,
        image: course.image || "",
        type: course.type || "offline",
      })
    );
  };

  const handleBuyNow = () => {
    dispatch(clearCart()); // ✅ ล้าง cart ก่อน
    dispatch(
      addToCart({
        courseId: course.id,
        title: course.name,
        price: course.price,
        image: course.image || "",
        type: course.type || "offline",
      })
    );
    router.push("/payments/checkout");
  };

  return isUsePayment ? (
    <div className="flex gap-4">
      <Tooltip title={lang["add_cart"]} placement="top">
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 h-10"
        >
          <FaCartPlus size={20} /> {lang["add_cart"]}
        </button>
      </Tooltip>

      <Tooltip title={lang["buy_now"]} placement="top">
        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 h-10"
        >
          <FaCartShopping /> {lang["buy_now"]}
        </button>
      </Tooltip>
    </div>
  ) : null;
}

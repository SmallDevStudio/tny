import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";
import useLanguage from "@/hooks/useLanguage";
import { IoIosArrowBack } from "react-icons/io";
import {
  removeFromCart,
  clearCart,
  addToCart,
  decreaseQuantity,
} from "@/store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import Checkout from "@/components/Payments/CheckOut";

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.items);
  const router = useRouter();
  const dispatch = useDispatch();

  const { t } = useLanguage();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = total * 0.07;
  const grandTotal = total + vat;

  return (
    <div className="w-full p-6 bg-gray-200 min-h-[50vh]">
      <div className="flex flex-col justify-center items-center max-w-screen-3xl mx-auto">
        <div className="border border-gray-300 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <IoIosArrowBack
              className="inline-block mr-2 text-orange-500 cursor-pointer"
              size={30}
              onClick={() => router.back()}
            />
            <h1 className="text-2xl font-bold text-orange-500">ตะกร้าของคุณ</h1>
          </div>
          <Divider flexItem orientation="horizontal" sx={{ mb: 2 }} />
          <Checkout
            cart={cart}
            total={total}
            vat={vat}
            grandTotal={grandTotal}
          />
        </div>
      </div>
    </div>
  );
}

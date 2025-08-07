// pages/cart.js
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
} from "@/store/slices/cartSlice";
import Link from "next/link";
import useLanguage from "@/hooks/useLanguage";

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const { t } = useLanguage();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">ตะกร้าของคุณ</h1>

      {cart.length === 0 ? (
        <p>ยังไม่มีสินค้าในตะกร้า</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.courseId}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <h2 className="font-semibold">{t(item.title)}</h2>
                <p className="text-sm text-gray-500">
                  ราคา: ฿{item.price} x {item.quantity}
                </p>
                <p className="text-sm font-medium text-green-700">
                  รวม: ฿{item.price * item.quantity}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() =>
                    dispatch(decreaseQuantity({ courseId: item.courseId }))
                  }
                >
                  ➖
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => dispatch(addToCart(item))}>➕</button>
                <button
                  onClick={() =>
                    dispatch(removeFromCart({ courseId: item.courseId }))
                  }
                >
                  ❌
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 text-right">
            <p className="text-xl font-bold">ยอดรวม: ฿{totalAmount}</p>
            <Link href="/checkout">
              <button className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-500">
                ดำเนินการชำระเงิน
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

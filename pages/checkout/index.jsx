import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.items);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ตะกร้าของคุณ</h1>
      {cart.map((item) => (
        <div key={item.courseId} className="mb-2">
          {item.title} × {item.quantity} = ฿{item.price * item.quantity}
        </div>
      ))}
      <p className="mt-4 text-lg font-semibold">รวม: ฿{total}</p>
      <button
        onClick={() => router.push("/checkout/payment")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        ดำเนินการชำระเงิน
      </button>
    </div>
  );
}

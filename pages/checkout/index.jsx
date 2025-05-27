import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.items);
  const router = useRouter();

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
                {cart.map((item) => (
                  <div key={item.courseId} className="mb-2">
                    {item.title} × {item.quantity} = ฿
                    {item.price * item.quantity}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-lg font-semibold">รวม: ฿{total}</p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between gap-4">
                จำนวนเงิน:
                <span>฿{total}</span>
              </div>
              <div className="flex justify-between gap-4">
                ส่วนลด:
                <span>฿{total}</span>
              </div>
              <div className="flex justify-between gap-4">
                จำนวนเงินที่ต้องชำระเงิน:
                <span>฿{total}</span>
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

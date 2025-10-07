import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
import { useDispatch } from "react-redux";
import CustomerDetails from "@/components/Payments/CustomerDetails";

export default function CustomerDetailsPage() {
  const cart = useSelector((state) => state.cart.items);

  const { t } = useLanguage();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = total * 0.07;
  const grandTotal = total + vat;

  return (
    <div className="flex flex-col bg-gray-100 min-h-[70vh] w-full">
      <div className="flex flex-col justify-center max-w-screen-3xl mx-auto w-full p-6">
        <CustomerDetails
          cart={cart}
          total={total}
          vat={vat}
          grandTotal={grandTotal}
        />
      </div>
    </div>
  );
}

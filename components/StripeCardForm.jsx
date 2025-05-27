import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";

export default function StripeCardForm({ cart, userId }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [cardholderName, setCardholderName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    if (!cardholderName || !email) {
      alert("กรุณากรอกชื่อและอีเมลให้ครบถ้วน");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, userId }),
    });
    const { clientSecret, paymentId } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: cardholderName,
          email,
        },
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      router.push(`/checkout/summary?id=${paymentId}`);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 max-w-sm mx-auto border border-gray-300">
      <h2 className="text-sm text-gray-500 mb-1">Make a payment to</h2>
      <h3 className="text-lg font-semibold mb-2 text-orange-500">
        The New You Academy
      </h3>
      {/* cart details */}
      <div></div>

      <label className="block text-sm mb-1 text-gray-700">Amount to Pay</label>
      <div className="mb-4">
        <input
          type="text"
          readOnly
          value={`฿ ${total.toFixed(2)}`}
          className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      <label className="block text-sm mb-1 text-gray-700">Name on Card</label>
      <input
        type="text"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
        placeholder="ชื่อบนบัตร"
        className="w-full px-3 py-2 mb-4 border rounded focus:outline-orange-500"
      />

      <label className="block text-sm mb-1 text-gray-700">
        Card Information
      </label>
      <div className="p-2 border rounded mb-4 bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": { color: "#a0aec0" },
              },
              invalid: { color: "#e53e3e" },
            },
          }}
        />
      </div>

      <label className="block text-sm mb-1 text-gray-700">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@email.com"
        className="w-full px-3 py-2 mb-4 border rounded focus:outline-orange-500"
      />

      <button
        onClick={handlePay}
        disabled={loading || !stripe}
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-700 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

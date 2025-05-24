import Stripe from "stripe";
import { db } from "@/services/firebase";
import { doc, updateDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { items, userId, paymentId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "thb",
          product_data: { name: item.title },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.origin}/summary?id=${paymentId}`,
      cancel_url: `${req.headers.origin}/checkout`,
      metadata: { userId, paymentId },
    });

    // Update Firestore with session ID (optional)
    await updateDoc(doc(db, "payment", paymentId), {
      stripeSessionId: session.id,
    });

    res.status(200).json({ url: session.url });
  } else {
    res.status(405).end("Method Not Allowed");
  }
}

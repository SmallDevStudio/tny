import Stripe from "stripe";
import { db } from "@/services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { cart, userId } = req.body;
  const amount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const paymentRef = await addDoc(collection(db, "payment"), {
    userId,
    coursesId: cart.map((c) => c.courseId),
    method: "stripe",
    created_at: serverTimestamp(),
    ref: Date.now().toString(),
    status: "processing",
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "thb",
    metadata: { paymentId: paymentRef.id, userId },
  });

  res
    .status(200)
    .json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentRef.id,
    });
}

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { amount, userId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // satang
      currency: "thb",
      payment_method_types: ["promptpay"],
      metadata: {
        userId,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      nextAction: paymentIntent.next_action, // มี QR code
    });
  } catch (error) {
    console.error("PromptPay Error:", error);
    res.status(500).json({ error: error.message });
  }
}

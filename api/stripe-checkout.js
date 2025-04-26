import Stripe from "stripe";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!global._firebaseAdmin) {
  initializeApp();
  global._firebaseAdmin = true;
}

const db = getFirestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { email, uid } = req.body;

  if (!email || !uid) {
    return res.status(400).json({ error: "Missing email or uid" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      metadata: { firebaseUID: uid },
      success_url: `${req.headers.origin}/index.html?checkout=success`,
      cancel_url: `${req.headers.origin}/index.html?checkout=cancel`
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}

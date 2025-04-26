import Stripe from "stripe";
import { buffer } from "micro";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!global._firebaseAdmin) {
  initializeApp();
  global._firebaseAdmin = true;
}
const db = getFirestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  let event;
  try {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    const uid = session.metadata.firebaseUID;
    if (uid) {
      await db.collection("users").doc(uid).update({
        status: "pro",
        tokenLimit: 9999,
        upgradedAt: new Date()
      });
      console.log(`User ${uid} upgraded to pro`);
    }
  }

  if (event.type === "invoice.payment_failed") {
    const customerId = session.customer;
    const subscriptions = await stripe.subscriptions.list({ customer: customerId });
    const metadataUID = subscriptions?.data[0]?.metadata?.firebaseUID;
    if (metadataUID) {
      await db.collection("users").doc(metadataUID).update({
        status: "suspended"
      });
      console.log(`User ${metadataUID} suspended due to failed payment`);
    }
  }

  res.status(200).send("Webhook received");
}

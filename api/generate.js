import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Configuration, OpenAIApi } from "openai";

if (!global._firebaseAdmin) {
  initializeApp();
  global._firebaseAdmin = true;
}

const db = getFirestore();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const {
    type, clientName, eventDate, location, menu,
    additionalInfo, keywords, industry, eventType, uid
  } = req.body;

  if (!uid) return res.status(400).json({ error: "No UID" });

  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

  const userData = userDoc.data();
  const isPro = userData.status === "pro";
  const tokensUsed = userData.tokensUsed || 0;
  const tokenLimit = userData.tokenLimit || 20;
  const cost = type === "full" ? 1 : 0.33;

  if (!isPro && tokensUsed + cost > tokenLimit) {
    return res.status(403).json({ error: "Out of tokens" });
  }

  const context = `Event for ${clientName} on ${eventDate} in ${location}.\nMenu: ${menu}\n${additionalInfo || ""}\n${keywords ? `Keywords: ${keywords}` : ""}\n${industry ? `Industry: ${industry}` : ""}\n${eventType ? `Event Type: ${eventType}` : ""}`;

  const promptBase = `Write a recap of a private chef event that already happened. Do not invite readers. Highlight the food, experience, and tone.`;

  const postTypes = {
    blog: `${promptBase}\n\nFormat as a blog post. Minimum 1000 words. Title at top. Include ${keywords} in bold if applicable.\nContext: ${context}`,
    instagram: `${promptBase}\n\nFormat as an Instagram caption with relevant hashtags.\nContext: ${context}`,
    facebook: `${promptBase}\n\nFormat as a Facebook post that could be shared on a catering business page.\nContext: ${context}`,
  };

  const toGenerate = type === "full" ? ["blog", "instagram", "facebook"] : [type];

  const responses = {};
  for (const postType of toGenerate) {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: postTypes[postType] }],
      temperature: 0.8,
      max_tokens: 1200,
    });
    responses[postType] = completion.data.choices[0].message.content;
  }

  if (!isPro) {
    await userRef.update({
      tokensUsed: tokensUsed + cost,
    });
  }

  return res.status(200).json(responses);
}

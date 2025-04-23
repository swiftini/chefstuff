export default async function handler(req, res) {
  try {
    const { type, clientName, eventDate, location, menu, additionalInfo } = req.body;

    if (!type || !clientName || !eventDate || !location || !menu) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const templates = {
      blog: `Write a blog post about a private chef dinner for ${clientName} on ${eventDate} in ${location}.
The menu included: ${menu}.
Additional context: ${additionalInfo}.
Make it elegant, story-driven, and descriptive.`,

      instagram: `Write an Instagram caption for a private chef event on ${eventDate} in ${location} for ${clientName}.
Highlight the menu: ${menu}.
Details: ${additionalInfo}.
Use emojis and hashtags. Keep it warm, short, and elegant.`,

      facebook: `Write a Facebook post for a private chef dinner with ${clientName} on ${eventDate} in ${location}.
The menu included: ${menu}.
Details: ${additionalInfo}.
Make it community-friendly and inviting with a call to action to book.`
    };

    const prompt = templates[type];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return res.status(500).json({ error: "OpenAI API call failed" });
    }

    const data = await response.json();
    res.status(200).json({ result: data.choices[0].message.content.trim() });

  } catch (error) {
    console.error("API Handler error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

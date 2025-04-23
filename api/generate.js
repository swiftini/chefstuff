export default async function handler(req, res) {
  try {
    const {
      type, clientName, eventDate, location,
      menu, additionalInfo, industry, eventType, keywords
    } = req.body;

    if (!type || !clientName || !eventDate || !location || !menu) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const keywordList = keywords
      ? keywords.split(',').map(k => k.trim()).filter(k => k)
      : [];

    const keywordBlogInstruction = keywordList.length
      ? `The following keywords must each appear at least once in the blog post: ${keywordList.join(', ')}.
Use them naturally in the content. When used, surround each keyword with double asterisks (**) for bold formatting.
Do not skip any keywords.`
      : '';

    const keywordFBInstruction = keywordList.length
      ? `The following keywords must each appear at least once in the Facebook post: ${keywordList.join(', ')}.
Use them naturally within the content.`
      : '';

    const keywordIGInstruction = keywordList.length
      ? `Convert the following keywords into hashtags and include them at the end of the Instagram caption: ${keywordList.join(', ')}.`
      : '';

    const typeSuffix = eventType && eventType.toLowerCase() !== "none"
      ? ` It was a ${eventType.toLowerCase()}.`
      : "";

    const industryLine = industry && industry.toLowerCase() !== "none"
      ? ` This was part of a ${industry.toLowerCase()} engagement.`
      : "";

    const templates = {
      blog: `# ${eventType && eventType !== "none" ? eventType + " for " : ""}${clientName} in ${location}

Write a blog post recapping a private chef event that has already occurred for ${clientName} on ${eventDate} in ${location}.
${industryLine}${typeSuffix}
The menu included: ${menu}.
Additional context: ${additionalInfo}.
${keywordBlogInstruction}
Avoid discussing future bookings or guest personal details.
Structure the post in at least 8 descriptive paragraphs.`,

      instagram: `Write an Instagram caption recapping a private chef event on ${eventDate} in ${location} for ${clientName}.
The menu featured: ${menu}.
Event details: ${additionalInfo}.${typeSuffix}${industryLine}
Avoid offering bookings or calls to action. Use elegant emojis. Speak in the past tense. ${keywordIGInstruction}`,

      facebook: `Write a Facebook post summarizing a private chef event that took place for ${clientName} on ${eventDate} in ${location}.
The food included: ${menu}.
Event info: ${additionalInfo}.${typeSuffix}${industryLine}
${keywordFBInstruction}
Do not include a call to book or fictional guest commentary. Speak in the past tense.`
    };

    const prompt = templates[type];
    if (!prompt) {
      return res.status(400).json({ error: `Invalid post type: ${type}` });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return res.status(500).json({ error: "OpenAI API call failed", details: errText });
    }

    const data = await response.json();
    return res.status(200).json({ result: data.choices[0].message.content.trim() });

  } catch (err) {
    console.error("API Handler error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
}

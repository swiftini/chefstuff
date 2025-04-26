export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { name, email, phone } = req.body;

  if (!email || !phone || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        locationId: process.env.GHL_LOCATION_ID,
        firstName: name,
        email,
        phone,
        tags: ["prompt creator"]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GHL error:", data);
      return res.status(500).json({ error: "Failed to create contact" });
    }

    res.status(200).json({ success: true, contactId: data.id });
  } catch (err) {
    console.error("GHL fetch error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

function generatePrompts() {
  const clientName = document.getElementById("clientName").value;
  const eventDate = document.getElementById("eventDate").value;
  const location = document.getElementById("location").value;
  const menu = document.getElementById("menu").value;
  const additionalInfo = document.getElementById("additionalInfo").value;

  const blog = `Write a blog post about a private chef dinner for ${clientName} on ${eventDate} in ${location}. Menu: ${menu}. Additional info: ${additionalInfo}. Make it elegant, story-driven, and sensory.`;
  const insta = `Write an Instagram caption for a private chef event on ${eventDate} for ${clientName} in ${location}. Menu: ${menu}. Details: ${additionalInfo}. Add a friendly tone, emojis, and 5 hashtags.`;
  const facebook = `Write a Facebook post for a private chef experience with ${clientName} on ${eventDate} at ${location}. Menu included: ${menu}. Notes: ${additionalInfo}. Tone should be warm and community-friendly.`;

  document.getElementById("blogPrompt").textContent = blog;
  document.getElementById("igPrompt").textContent = insta;
  document.getElementById("fbPrompt").textContent = facebook;
}

async function generateAndDisplay(type, containerId) {
  const clientName = document.getElementById("clientName").value;
  const eventDate = document.getElementById("eventDate").value;
  const location = document.getElementById("location").value;
  const menu = document.getElementById("menu").value;
  const additionalInfo = document.getElementById("additionalInfo").value;

  const outputEl = document.getElementById(containerId);
  outputEl.innerHTML = "<em>Generating...</em>";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, clientName, eventDate, location, menu, additionalInfo })
    });

    if (!response.ok) {
      throw new Error("API call failed");
    }

    const data = await response.json();
    outputEl.innerHTML = `
      <pre>${data.result}</pre>
      <button onclick="copyToClipboard('${containerId}')">Copy to Clipboard</button>
      <button onclick="downloadText('${type}', \`${data.result}\`)">Download as .txt</button>
    `;
  } catch (err) {
    outputEl.innerHTML = "<span style='color:red;'>Failed to generate post. Please check your inputs and try again.</span>";
    console.error(err);
  }
}

function generatePrompts() {
  generateAndDisplay("blog", "blogPrompt");
  generateAndDisplay("instagram", "igPrompt");
  generateAndDisplay("facebook", "fbPrompt");
}

function copyToClipboard(containerId) {
  const content = document.querySelector(`#${containerId} pre`).innerText;
  navigator.clipboard.writeText(content).then(() => {
    alert("Copied to clipboard!");
  });
}

function downloadText(type, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${type}_post.txt`;
  link.click();
}

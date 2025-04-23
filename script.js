async function generateAndDisplay(type, containerId) {
  const clientName = document.getElementById("clientName").value;
  const eventDate = document.getElementById("eventDate").value;
  const location = document.getElementById("location").value;
  const menu = document.getElementById("menu").value;
  const additionalInfo = document.getElementById("additionalInfo").value;

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, clientName, eventDate, location, menu, additionalInfo })
  });

  const data = await response.json();
  const outputEl = document.getElementById(containerId);
  outputEl.innerHTML = `
    <pre>${data.result}</pre>
    <button onclick="copyToClipboard('${containerId}')">Copy to Clipboard</button>
  `;
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

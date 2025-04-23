function validateFields() {
  const fields = ["clientName", "eventDate", "location", "menu"];
  let valid = true;
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.style.border = "2px solid red";
      valid = false;
    } else {
      el.style.border = "1px solid #ccc";
    }
  });
  return valid;
}

["clientName", "eventDate", "location", "menu"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    validateFields();
  });
});

function appendMissingHashtags(content, keywords) {
  const missing = [];
  keywords.forEach(keyword => {
    const hashtag = "#" + keyword.replace(/\s+/g, '');
    const regex = new RegExp(`#${keyword.replace(/\s+/g, '')}\b`, 'i');
    if (!regex.test(content)) {
      missing.push(hashtag);
    }
  });
  if (missing.length) {
    content += `\n\n${missing.join(' ')}`;
  }
  return content;
}

async function generateAndDisplay(type, containerId) {
  const isValid = validateFields();
  const outputEl = document.getElementById(containerId);
  if (!isValid) {
    outputEl.innerHTML = "<span style='color:red;'>Please fill out all required fields marked with an asterisk (*).</span>";
    return;
  }

  const clientName = document.getElementById("clientName").value.trim();
  const eventDate = document.getElementById("eventDate").value.trim();
  const location = document.getElementById("location").value.trim();
  const menu = document.getElementById("menu").value.trim();
  const additionalInfo = document.getElementById("additionalInfo").value.trim();
  const industry = document.getElementById("industry").value;
  const eventType = document.getElementById("eventType").value;
  const keywordInput = document.getElementById("keywords").value;
  const keywordList = keywordInput.split(',').map(k => k.trim()).filter(k => k.length > 0);

  outputEl.innerHTML = "<em>Generating...</em>";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type, clientName, eventDate, location, menu,
        additionalInfo, industry, eventType, keywords: keywordInput
      })
    });

    if (!response.ok) throw new Error("API call failed");

    const data = await response.json();
    let content = data.result;

    // Remove markdown-style bold
    content = content.replace(/\*\*(.*?)\*\*/g, '$1');

    // Instagram hashtag fallback only
    if (type === "instagram") {
      content = appendMissingHashtags(content, keywordList);
    }

    outputEl.innerHTML = `
      <pre>${content}</pre>
      <button onclick="copyToClipboard('${containerId}')">Copy to Clipboard</button>
      <button onclick="downloadText('${type}', \`${content}\`)">Download as .txt</button>
    `;
  } catch (err) {
    console.error(err);
    outputEl.innerHTML = "<span style='color:red;'>Failed to generate post. Please try again or check your input.</span>";
  }
}

function generatePrompts() {
  generateAndDisplay("blog", "blogOutput");
  generateAndDisplay("instagram", "igOutput");
  generateAndDisplay("facebook", "fbOutput");
}

function copyToClipboard(containerId) {
  const content = document.querySelector(`#${containerId} pre`)?.innerText || document.querySelector(`#${containerId}`).innerText;
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

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

  outputEl.innerHTML = "<em>Generating...</em>";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, clientName, eventDate, location, menu, additionalInfo, industry, eventType })
    });

    if (!response.ok) throw new Error("API call failed");

    const data = await response.json();
    let formattedOutput = data.result;

    if (type === "blog") {
      const lines = data.result.split("\n").filter(line => line.trim() !== "");
      const title = lines[0].replace(/^#+\s*/, "").trim();
      const body = lines.slice(1).join("\n").trim();
      formattedOutput = `<div class="blog-title">${title}</div><pre>${body}</pre>`;
    } else {
      formattedOutput = `<pre>${data.result}</pre>`;
    }

    outputEl.innerHTML = `
      ${formattedOutput}
      <button onclick="copyToClipboard('${containerId}')">Copy to Clipboard</button>
      <button onclick="downloadText('${type}', \`${data.result}\`)">Download as .txt</button>
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

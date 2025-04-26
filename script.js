
import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const db = getFirestore();

let tokensUsed = 0;
let tokenLimit = 0;
let userStatus = "";

function updateUsageDisplay() {
  const el = document.getElementById("usage-info");
  if (userStatus === "pro") {
    el.textContent = "You have unlimited generations.";
  } else {
    el.textContent = `Tokens used: ${tokensUsed} / ${tokenLimit}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("generationForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      alert("Generate function triggered!");
    });
  }

  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener('click', async () => {
    try {
      await signOut(auth);
      const toast = document.getElementById("toast");
      toast.style.display = "block";
      setTimeout(() => {
        toast.style.display = "none";
        window.location.href = "index.html";
      }, 2000);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  });

  onAuthStateChanged(auth, async (user) => {
    const loading = document.getElementById("loading-spinner");
    loading.style.display = "block";

    if (!user) {
      loading.style.display = "none";
      window.location.href = "index.html";
    } else {
      const appDiv = document.getElementById("app");
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const name = data.name || "User";
        document.getElementById('welcome-message').textContent = `Welcome, ${name}!`;
        tokensUsed = data.tokensUsed || 0;
        tokenLimit = data.tokenLimit || 20;
        userStatus = data.status || "trial";
        updateUsageDisplay();
      }
      loading.style.display = "none";
      appDiv.style.display = "block";
    }
  });
});

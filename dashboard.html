import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
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

function logout() {
  signOut(auth).then(() => {
    window.location.href = "signup.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("generationForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await generateAndDisplay("full");
    });
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "signup.html";
    } else {
      document.getElementById("app").style.display = "block";
      currentUser = user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        tokensUsed = data.tokensUsed || 0;
        tokenLimit = data.tokenLimit || 20;
        userStatus = data.status || "trial";
        updateUsageDisplay();
      }
    }
  });
});
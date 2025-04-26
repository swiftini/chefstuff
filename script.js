
import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "firebase/auth";

// Protect page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '/index.html';
  }
});

// Logout button
const logoutButton = document.getElementById('logout-button');

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = '/index.html';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  });
}

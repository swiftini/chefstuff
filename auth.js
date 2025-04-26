
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from './firebase.js';

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signin-form').style.display = 'block';
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('reset-form').style.display = 'none';
});

document.getElementById('go-signup').addEventListener('click', () => {
  document.getElementById('signin-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
});

document.getElementById('go-login').addEventListener('click', () => {
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('signin-form').style.display = 'block';
});

document.getElementById('go-reset').addEventListener('click', () => {
  document.getElementById('signin-form').style.display = 'none';
  document.getElementById('reset-form').style.display = 'block';
});

document.getElementById('go-login-2').addEventListener('click', () => {
  document.getElementById('reset-form').style.display = 'none';
  document.getElementById('signin-form').style.display = 'block';
});

document.getElementById('login-button').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = '/dashboard.html';
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById('signup-button').addEventListener('click', async () => {
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const name = document.getElementById('signup-name').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  if (!email || !password || !name || !phone) {
    alert('Please fill out all fields.');
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = '/dashboard.html';
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById('reset-button').addEventListener('click', async () => {
  const email = document.getElementById('reset-email').value.trim();
  if (!email) {
    alert('Please enter your email.');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent!');
    document.getElementById('reset-form').style.display = 'none';
    document.getElementById('signin-form').style.display = 'block';
  } catch (error) {
    alert(error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname === '/index.html') {
    window.location.href = '/dashboard.html';
  }
});

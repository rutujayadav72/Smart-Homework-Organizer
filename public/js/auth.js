// ------------------------- LOGIN -------------------------
function login() {
  const email = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  const messageDiv = document.getElementById('loginMessage');

  if (!email || !password) {
    if (messageDiv) {
      messageDiv.innerText = 'Please enter both email and password.';
      messageDiv.style.color = 'red';
    }
    return;
  }

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      // Save in localStorage
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.name);

      return data.message;
    })
    .then(msg => {
      if (messageDiv) {
        messageDiv.innerText = msg;
        messageDiv.style.color = 'green';
      }
      window.location.href = '/index.html';
    })
    .catch(err => {
      if (messageDiv) {
        messageDiv.innerText = `Error: ${err.message}`;
        messageDiv.style.color = 'red';
      }
    });
}

// Attach login handler safely
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    login();
  });
}

// ---------------------- REGISTER -------------------------
function register() {
  const name = document.getElementById('registerName')?.value.trim();
  const email = document.getElementById('registerEmail')?.value.trim();
  const password = document.getElementById('registerPassword')?.value;
  const messageDiv = document.getElementById('registerMessage');

  if (!name || !email || !password) {
    messageDiv.innerText = 'Please fill in all fields.';
    messageDiv.style.color = 'red';
    return;
  }

  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      return data.message;
    })
    .then(msg => {
      messageDiv.innerText = msg;
      messageDiv.style.color = 'green';
      setTimeout(() => window.location.href = '/login.html', 1000);
    })
    .catch(err => {
      messageDiv.innerText = `Error: ${err.message}`;
      messageDiv.style.color = 'red';
    });
}

// Attach register handler safely
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    register();
  });
}


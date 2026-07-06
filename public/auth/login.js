document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorBox = document.getElementById('loginError');

  if (!form || !emailInput || !passwordInput || !errorBox) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const sanitizedEmail = email.trim();
    const sanitizedPassword = password.trim();

    const errors = [];

    if (!sanitizedEmail) {
      errors.push('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      errors.push('Please enter a valid email address.');
    }

    if (!sanitizedPassword) {
      errors.push('Password is required.');
    }

    if (errors.length > 0) {
      errorBox.textContent = errors.join(' ');
      errorBox.classList.remove('hidden');
      return;
    }

    errorBox.classList.add("hidden");
    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: sanitizedEmail,
            password: sanitizedPassword
        })
    })
    .then(async (response) => {
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const message = await response.text();

        errorBox.textContent = message;
        errorBox.classList.remove("hidden");
    })
    .catch(() => {
        errorBox.textContent = "Unable to connect to the server.";
        errorBox.classList.remove("hidden");
    });
  });
});

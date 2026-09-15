document.addEventListener('DOMContentLoaded', async () => {

    const form = document.getElementById('loginForm');

    const emailInput = document.getElementById('email');

    const passwordInput = document.getElementById('password');

    const errorBox = document.getElementById('loginError');

    if (!form || !emailInput || !passwordInput || !errorBox) return;


    // ==========================================
    // GET CSRF TOKEN
    // ==========================================

    let csrfToken = null;

    try {

        const csrfResponse = await fetch("/auth/csrf-token", {
            method: "GET",
            credentials: "same-origin"
        });

        if (!csrfResponse.ok) {
            throw new Error("Unable to obtain CSRF token.");
        }

        const csrfData = await csrfResponse.json();

        csrfToken = csrfData.token;

    } catch (error) {

        console.error("CSRF token error:", error);

        errorBox.textContent =
            "Unable to initialize secure login. Please refresh the page.";

        errorBox.classList.remove("hidden");

        return;
    }


    // ==========================================
    // SESSION STATUS MESSAGE
    // ==========================================

    const params = new URLSearchParams(window.location.search);

    const reason = params.get('reason');

    if (reason) {

        const reasonMessages = {

            suspended:
                'Your account was suspended while you were logged in. Please contact support for details.',

            banned:
                'Your account was permanently banned while you were logged in.',

            disabled:
                'Your account was deactivated while you were logged in.'

        };

        errorBox.textContent =
            reasonMessages[reason] ||
            'Your session was ended by an administrator.';

        errorBox.classList.remove('hidden');
    }


    // ==========================================
    // LOGIN
    // ==========================================

    form.addEventListener('submit', async (event) => {

        event.preventDefault();

        const email = emailInput.value;

        const password = passwordInput.value;

        const sanitizedEmail = email.trim();

        const sanitizedPassword = password.trim();

        const errors = [];


        // Email validation

        if (!sanitizedEmail) {

            errors.push('Email is required.');

        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {

            errors.push('Please enter a valid email address.');

        }


        // Password validation

        if (!sanitizedPassword) {

            errors.push('Password is required.');

        }


        if (errors.length > 0) {

            errorBox.textContent = errors.join(' ');

            errorBox.classList.remove('hidden');

            return;
        }


        errorBox.classList.add("hidden");


        try {

            const response = await fetch("/auth/login", {

                method: "POST",

                credentials: "same-origin",

                headers: {

                    "Content-Type": "application/json",

                    "X-CSRF-Token": csrfToken

                },

                body: JSON.stringify({

                    email: sanitizedEmail,

                    password: sanitizedPassword

                })

            });


            if (response.redirected) {

                window.location.href = response.url;

                return;
            }


            const message = await response.text();

            if (!response.ok) {

                errorBox.textContent = message;

                errorBox.classList.remove("hidden");

                return;
            }

            errorBox.textContent = message;

            errorBox.classList.remove("hidden");


        } catch (error) {

            console.error("Login error:", error);

            errorBox.textContent =
                "Unable to connect to the server.";

            errorBox.classList.remove("hidden");

        }

    });

});
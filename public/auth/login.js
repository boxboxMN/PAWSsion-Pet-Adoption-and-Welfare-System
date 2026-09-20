// 1. GLOBAL FUNCTION PARA SA HTML ONCLICK ATTRIBUTE (openModal)
window.openModal = function () {
    const modal = document.getElementById("registerModal");
    if (modal) {
        modal.style.display = "flex";
    }
};

document.addEventListener('DOMContentLoaded', async () => {

    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorBox = document.getElementById('loginError');

    if (!form || !emailInput || !passwordInput || !errorBox) return;

    // ==========================================
    // ERROR MESSAGE HELPER (auto-hide after 4s)
    // ==========================================
    const ERROR_VISIBLE_MS = 4000;
    let errorTimeoutId = null;

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove("hidden");

        if (errorTimeoutId) {
            clearTimeout(errorTimeoutId);
        }

        errorTimeoutId = setTimeout(() => {
            errorBox.classList.add("hidden");
            errorBox.textContent = "";
            errorTimeoutId = null;
        }, ERROR_VISIBLE_MS);
    }

    function hideError() {
        if (errorTimeoutId) {
            clearTimeout(errorTimeoutId);
            errorTimeoutId = null;
        }
        errorBox.classList.add("hidden");
        errorBox.textContent = "";
    }

    // ==========================================
    // MODAL & UI CONTROLS
    // ==========================================

    // Register Modal Outside Click Listener
    window.addEventListener("click", function (e) {
        const modal = document.getElementById("registerModal");
        if (modal && e.target === modal) {
            modal.style.display = "none";
        }
    });

    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const isHidden = passwordInput.type === "password";
            passwordInput.type = isHidden ? "text" : "password";
            const icon = togglePassword.querySelector("i");
            if (icon) {
                icon.className = isHidden ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
                icon.style.color = "#1656ff";
            }
            togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
        });
    }

    // Legal Modals (Privacy Policy & Terms of Service)
    const privacyLink = document.getElementById("privacyLink");
    const termsLink = document.getElementById("termsLink");
    const privacyModal = document.getElementById("privacyModal");
    const termsModal = document.getElementById("termsModal");
    const closePrivacy = document.getElementById("closePrivacy");
    const closeTerms = document.getElementById("closeTerms");

    if (privacyLink && privacyModal) {
        privacyLink.addEventListener("click", function (e) {
            e.preventDefault();
            privacyModal.classList.add("active");
        });
    }

    if (termsLink && termsModal) {
        termsLink.addEventListener("click", function (e) {
            e.preventDefault();
            termsModal.classList.add("active");
        });
    }

    if (closePrivacy && privacyModal) {
        closePrivacy.addEventListener("click", function () {
            privacyModal.classList.remove("active");
        });
    }

    if (closeTerms && termsModal) {
        closeTerms.addEventListener("click", function () {
            termsModal.classList.remove("active");
        });
    }

    if (privacyModal) {
        privacyModal.addEventListener("click", function (e) {
            if (e.target === privacyModal) {
                privacyModal.classList.remove("active");
            }
        });
    }

    if (termsModal) {
        termsModal.addEventListener("click", function (e) {
            if (e.target === termsModal) {
                termsModal.classList.remove("active");
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (privacyModal) privacyModal.classList.remove("active");
            if (termsModal) termsModal.classList.remove("active");
        }
    });

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
        showError("Unable to initialize secure login. Please refresh the page.");
        return;
    }

    // ==========================================
    // SESSION STATUS MESSAGE
    // ==========================================
    const params = new URLSearchParams(window.location.search);

    if (params.get("success") === "1") {
        const successMessage = document.getElementById("successMessage");
        if (successMessage) {
            successMessage.classList.remove("hidden");
            successMessage.style.display = "block";
        }
        window.history.replaceState({}, document.title, window.location.pathname);
    }

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

        showError(
            reasonMessages[reason] ||
            'Your session was ended by an administrator.'
        );
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
            showError(errors.join(' '));
            return;
        }

        hideError();

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
                showError(message);
                return;
            }

            showError(message);

        } catch (error) {

            console.error("Login error:", error);
            showError("Unable to connect to the server.");

        }

    });

});
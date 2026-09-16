document.addEventListener("DOMContentLoaded", async () => {
    loadSidebar("setting");
    loadTopbar({ title: "Profile Settings", subtitle: "Manage your administrator account details." });

    const form = document.getElementById("adminProfileForm");
    const alertBox = document.getElementById("alertBox");

    // Fetch current profile data
    try {
        const res = await fetch('/admin/current-user');
        const data = await res.json();
        if (data.success && data.user) {
                document.getElementById("adminName").value = data.user.name || "";
                document.getElementById("adminEmail").value = data.user.email || "";
        }
    } catch (err) {
        console.error("Failed to load profile data", err);
    }

    const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const currentPasswordInputField = document.getElementById("adminCurrentPassword");
    const currentPasswordHint = document.getElementById("currentPasswordHint");
    const newPasswordInput = document.getElementById("adminPassword");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const confirmPasswordWrapper = document.getElementById("confirmPasswordWrapper");
    const confirmPasswordInput = document.getElementById("adminConfirmPassword");

    let currentPasswordVerified = false;
    let verifyDebounceTimer = null;

    function lockNewPasswordField() {
        currentPasswordVerified = false;
        newPasswordInput.disabled = true;
        newPasswordInput.value = "";
        newPasswordInput.placeholder = "Verify current password first";
        newPasswordInput.classList.add("bg-slate-100", "text-slate-400", "cursor-not-allowed");
        togglePasswordBtn.disabled = true;
        togglePasswordBtn.classList.add("text-slate-300", "cursor-not-allowed");
        confirmPasswordWrapper.classList.add("hidden");
        confirmPasswordInput.value = "";
    }

    function unlockNewPasswordField() {
        currentPasswordVerified = true;
        newPasswordInput.disabled = false;
        newPasswordInput.placeholder = "••••••••";
        newPasswordInput.classList.remove("bg-slate-100", "text-slate-400", "cursor-not-allowed");
        togglePasswordBtn.disabled = false;
        togglePasswordBtn.classList.remove("text-slate-300", "cursor-not-allowed");
    }

    async function verifyCurrentPassword() {
        const value = currentPasswordInputField.value;

        if (!value) {
            lockNewPasswordField();
            currentPasswordHint.textContent = "Required to save any change to this profile.";
            currentPasswordHint.className = "text-[11px] text-slate-400 mt-1";
            return;
        }

        try {
            const res = await fetch('/admin/profile/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: value })
            });
            const result = await res.json();

            if (result.success && result.valid) {
                unlockNewPasswordField();
                currentPasswordHint.textContent = "Verified — you may now set a new password.";
                currentPasswordHint.className = "text-[11px] text-emerald-600 mt-1";
            } else {
                lockNewPasswordField();
                currentPasswordHint.textContent = "Incorrect password.";
                currentPasswordHint.className = "text-[11px] text-rose-500 mt-1";
            }
        } catch (err) {
            console.error("Password verification failed:", err);
            lockNewPasswordField();
            currentPasswordHint.textContent = "Unable to verify right now. Please try again.";
            currentPasswordHint.className = "text-[11px] text-rose-500 mt-1";
        }
    }

    // Debounce so we're not firing a request on every single keystroke
    currentPasswordInputField.addEventListener("input", () => {
        clearTimeout(verifyDebounceTimer);
        verifyDebounceTimer = setTimeout(verifyCurrentPassword, 500);
    });

    // Show the confirm-password field only once the admin starts typing a new password
    newPasswordInput.addEventListener("input", () => {
        confirmPasswordWrapper.classList.toggle("hidden", newPasswordInput.value.trim() === "");
    });

    // Handle Form Submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const currentPassword = document.getElementById("adminCurrentPassword").value;
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        function showError(message) {
            alertBox.classList.remove("hidden");
            alertBox.className = "mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200";
            alertBox.textContent = message;
        }

        if (!currentPassword) {
            showError("Please enter your current password to confirm this change.");
            return;
        }

        if (!emailPattern.test(email)) {
            showError("Please enter a valid email address.");
            return;
        }

        if (password) {
            if (!currentPasswordVerified) {
                showError("Please enter your correct current password before setting a new one.");
                return;
            }
            if (!passwordComplexityRegex.test(password)) {
                showError("New password must be at least 8 characters, with uppercase, lowercase, a number, and a special character.");
                return;
            }
            if (password === currentPassword) {
                showError("New password cannot be the same as your current password.");
                return;
            }
            if (password !== confirmPassword) {
                showError("New password and confirmation do not match.");
                return;
            }
        }

        try {
            const res = await fetch('/admin/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, currentPassword, password })
            });
            const result = await res.json();

            alertBox.classList.remove("hidden");
            if (result.success) {
                alertBox.className = "mb-4 p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200";
                alertBox.textContent = "Profile updated successfully!";
                document.getElementById("adminCurrentPassword").value = "";
                confirmPasswordInput.value = "";
                confirmPasswordWrapper.classList.add("hidden");
                lockNewPasswordField();
                currentPasswordHint.textContent = "Required to save any change to this profile.";
                currentPasswordHint.className = "text-[11px] text-slate-400 mt-1";
            } else {
                alertBox.className = "mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200";
                alertBox.textContent = result.message || "Failed to update profile.";
            }

            setTimeout(() => {
                alertBox.classList.add("hidden");
            }, 4000);

        } catch (err) {
            console.error(err);
        }
    });

    // Password Toggle Logic (New Password)
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("adminPassword");
    const eyeIcon = document.getElementById("eyeIcon");

    togglePassword.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        eyeIcon.className = isPassword ? "fa-solid fa-eye-slash text-sm" : "fa-solid fa-eye text-sm";
    });

    // Password Toggle Logic (Current Password)
    const toggleCurrentPassword = document.getElementById("toggleCurrentPassword");
    const currentPasswordInput = document.getElementById("adminCurrentPassword");
    const eyeIconCurrent = document.getElementById("eyeIconCurrent");

    toggleCurrentPassword.addEventListener("click", () => {
        const isPassword = currentPasswordInput.type === "password";
        currentPasswordInput.type = isPassword ? "text" : "password";
            eyeIconCurrent.className = isPassword ? "fa-solid fa-eye-slash text-sm" : "fa-solid fa-eye text-sm";
    });
});
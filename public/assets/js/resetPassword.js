document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("resetPasswordForm");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const messageBox = document.getElementById("message");
    const submitBtn = form?.querySelector("button[type='submit']");

    if (!form || !passwordInput || !confirmPasswordInput || !messageBox) return;

    // Helper function to handle status message display using Tailwind
    const showMessage = (text, type = "error") => {
        messageBox.textContent = text;
        
        // Reset base classes and unhide
        messageBox.className = "mt-4 px-3.5 py-3 rounded-lg text-[13px] leading-relaxed border";

        if (type === "success") {
            messageBox.classList.add("bg-emerald-50", "text-emerald-700", "border-emerald-200");
        } else {
            messageBox.classList.add("bg-red-50", "text-red-700", "border-red-200");
        }
    };

    const clearMessage = () => {
        messageBox.textContent = "";
        messageBox.className = "hidden mt-4 px-3.5 py-3 rounded-lg text-[13px] leading-relaxed";
    };

    // Get reset token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
        showMessage("This password reset link is invalid or missing.", "error");
        form.classList.add("hidden");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        clearMessage();

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

        if (!passwordRegex.test(password)) {
            showMessage("Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        // Set button loading state
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add("opacity-70", "cursor-not-allowed");
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Updating...`;
        }

        try {
            const response = await fetch("/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, password, confirmPassword })
            });

            const result = await response.text();

            if (!response.ok) {
                showMessage(result || "Failed to reset password.", "error");
                return;
            }

            showMessage("Password changed successfully. Redirecting to login...", "success");
            form.classList.add("hidden");

            setTimeout(() => {
                window.location.href = "/auth/login.html";
            }, 2000);

        } catch (error) {
            console.error("Reset Password Error:", error);
            showMessage("Unable to connect to the server. Please try again later.", "error");
        } finally {
            // Restore button state if form is still visible
            if (submitBtn && !form.classList.contains("hidden")) {
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
});
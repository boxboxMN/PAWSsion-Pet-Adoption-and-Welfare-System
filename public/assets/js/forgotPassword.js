document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgotPasswordForm");
    const emailInput = document.getElementById("email");
    const messageBox = document.getElementById("message");
    const submitBtn = form?.querySelector("button[type='submit']");

    if (!form || !emailInput || !messageBox) return;

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

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        clearMessage();

        if (!email) {
            showMessage("Please enter your email address.", "error");
            return;
        }

        // Set button loading state
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add("opacity-70", "cursor-not-allowed");
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
        }

        try {
            const response = await fetch("/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const result = await response.text();

            if (!response.ok) {
                showMessage(result || "Failed to send reset link.", "error");
                return;
            }

            showMessage(result || "A password reset link has been sent to your email.", "success");
            form.reset();

        } catch (error) {
            console.error("Forgot Password Error:", error);
            showMessage("Unable to connect to the server. Please try again later.", "error");
        } finally {
            // Restore button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
});
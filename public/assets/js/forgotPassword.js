document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgotPasswordForm");
    const emailInput = document.getElementById("email");
    const messageBox = document.getElementById("message");
    const submitBtn = document.getElementById("submitBtn") || form?.querySelector("button[type='submit']");

    if (!form || !emailInput || !messageBox) return;

  
    let messageTimer = null;


    const ICONS = {
        success: "fa-circle-check",
        error:   "fa-circle-exclamation",
        info:    "fa-circle-info"
    };

    const STYLES = {
        success: "flex bg-emerald-50 border border-emerald-200 text-emerald-700",
        error:   "flex bg-red-50 border border-red-200 text-red-700",
        info:    "flex bg-blue-50 border border-blue-200 text-blue-700"
    };

    const showMessage = (text, type = "error", autoHideMs = 5000) => {
     
        if (messageTimer) {
            clearTimeout(messageTimer);
            messageTimer = null;
        }

        const icon = ICONS[type] || ICONS.info;
        const style = STYLES[type] || STYLES.info;

        // ⭐ Mas malaking gap (gap-3 = 12px) at mas magandang alignment
        messageBox.className = `mt-4 px-4 py-3 rounded-xl text-[13px] leading-snug items-start gap-3 ${style}`;
        messageBox.innerHTML = `
            <i class="fa-solid ${icon} mt-[2px] text-[14px] flex-shrink-0"></i>
            <span class="flex-1">${text}</span>
        `;

     
        void messageBox.offsetWidth;

        // ⭐ Auto-hide after 5 seconds (default)
        if (autoHideMs > 0) {
            messageTimer = setTimeout(() => {
                clearMessage();
            }, autoHideMs);
        }
    };

    const clearMessage = () => {
        if (messageTimer) {
            clearTimeout(messageTimer);
            messageTimer = null;
        }
        messageBox.className = "hidden mt-4 px-4 py-3 rounded-xl text-[13px] leading-snug items-start gap-3";
        messageBox.innerHTML = "";
    };

    // ==========================================
    // FORM SUBMIT
    // ==========================================
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        clearMessage();

        // ---------- Email validation ----------
        if (!email) {
            showMessage("Please enter your email address.", "error");
            emailInput.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            showMessage("Please enter a valid email address.", "error");
            emailInput.focus();
            return;
        }

        // ---------- Loading state ----------
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add("opacity-60", "cursor-not-allowed");
            submitBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin text-[13px]"></i>
                <span>Sending...</span>
            `;
        }

        try {
            const response = await fetch("/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const raw = await response.text();
            console.log("[Forgot Password] raw response:", response.status, raw);

            let result = raw;
            try {
                const parsed = JSON.parse(raw);
                result = parsed.message || parsed.error || raw;
            } catch (_) { /* keep raw */ }

            if (!response.ok) {
                showMessage(result || "Failed to send reset link.", "error");
                return;
            }

          
            showMessage(
                result || "A password reset link has been sent to your email.",
                "success"
            );
            form.reset();

        } catch (error) {
            console.error("Forgot Password Error:", error);
            showMessage("Unable to connect to the server. Please try again later.", "error");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove("opacity-60", "cursor-not-allowed");
                submitBtn.innerHTML = originalBtnHTML;
            }
        }
    });

    // ==========================================
    // CLEAR MESSAGE WHEN TYPING
    // ==========================================
    emailInput.addEventListener("input", () => {
        if (messageBox.classList.contains("flex")) {
            clearMessage();
        }
    });
});
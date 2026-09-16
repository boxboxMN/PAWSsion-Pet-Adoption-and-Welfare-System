document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalText = submitBtn.textContent;

            const payload = {
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value.trim()
            };

            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            try {
                const res = await fetch("/api/contact-messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (data.success) {
                    showContactResultModal(true, "Message Sent!", data.message || "Thanks for reaching out! We'll get back to you soon.");
                    this.reset();
                } else {
                    showContactResultModal(false, "Something Went Wrong", data.message || "Please check your details and try again.");
                }
            } catch (err) {
                console.error("Contact form error:", err);
                showContactResultModal(false, "Connection Error", "Unable to connect to the server. Please try again later.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    const closeBtn = document.getElementById("contactResultCloseBtn");
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            document.getElementById("contactResultModal")?.classList.add("hidden");
        });
    }
});

// ✅ Helper Function para harangin ang HTML injection / XSS
function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showContactResultModal(isSuccess, title, message) {
            const modal = document.getElementById("contactResultModal");
            const iconWrap = document.getElementById("contactResultIconWrap");
            const icon = document.getElementById("contactResultIcon");
            const titleEl = document.getElementById("contactResultTitle");
            const messageEl = document.getElementById("contactResultMessage");

            if (!modal) return;

            if (titleEl) titleEl.textContent = title;
            if (messageEl) messageEl.textContent = message;

             if (isSuccess) {
                if (iconWrap) iconWrap.className = "mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-4 bg-emerald-50";
                if (icon) icon.className = "fa-solid fa-circle-check text-2xl text-emerald-600";
            } else {
                if (iconWrap) iconWrap.className = "mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-4 bg-rose-50";
                if (icon) icon.className = "fa-solid fa-circle-exclamation text-2xl text-rose-600";
            }

            modal.classList.remove("hidden");
}
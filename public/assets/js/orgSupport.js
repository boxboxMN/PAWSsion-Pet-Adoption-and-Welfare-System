document.addEventListener("DOMContentLoaded", async () => {
    // =============================================
    // LOAD SHARED COMPONENTS
    // =============================================
    await loadTopbar({
        title: "Support",
        subtitle: "Get help and support for your organization"
    });

    await loadSidebar("support");

    // =============================================
    // LOAD ORGANIZATION NAME
    // =============================================
    try {
        const response = await fetch("/api/organization/profile");
        if (response.ok) {
            const organization = await response.json();
            const organizationName = document.getElementById("organizationName");
            if (organizationName) {
                organizationName.textContent = organization.organization_name;
            }
        }
    } catch (error) {
        console.error("Unable to load organization:", error);
    }

    // =============================================
    // LOAD DASHBOARD STATISTICS
    // =============================================
    if (typeof loadDashboardStats === "function") {
        loadDashboardStats();
    }

    // Load dynamic user guide
    loadUserGuide();

    // Load site contact details
    loadContactInfo();

    document.querySelectorAll(".faq-btn").forEach(button => {
        button.addEventListener("click", () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector("i");
            if (content) content.classList.toggle("hidden");
            if (icon) icon.classList.toggle("rotate-180");
        });
    });

    // =============================================
    // 3. USER GUIDE MODAL CONTROLS
    // =============================================
    const userGuideModal = document.getElementById("userGuideModal");
    const openUserGuideBtn = document.getElementById("openUserGuideBtn");
    const closeUserGuideBtn = document.getElementById("closeUserGuideBtn");
    const closeUserGuideFooterBtn = document.getElementById("closeUserGuideFooterBtn");

    function toggleUserGuide(open) {
        if (!userGuideModal) return;
        const modalBox = userGuideModal.querySelector("div > div");
        if (open) {
            userGuideModal.classList.remove("opacity-0", "pointer-events-none");
            if (modalBox) {
                modalBox.classList.remove("scale-95");
                modalBox.classList.add("scale-100");
            }
        } else {
            userGuideModal.classList.add("opacity-0", "pointer-events-none");
            if (modalBox) {
                modalBox.classList.remove("scale-100");
                modalBox.classList.add("scale-95");
            }
        }
    }

    if (openUserGuideBtn) openUserGuideBtn.addEventListener("click", () => toggleUserGuide(true));
    if (closeUserGuideBtn) closeUserGuideBtn.addEventListener("click", () => toggleUserGuide(false));
    if (closeUserGuideFooterBtn) closeUserGuideFooterBtn.addEventListener("click", () => toggleUserGuide(false));

    if (userGuideModal) {
        userGuideModal.addEventListener("click", (e) => {
            if (e.target === userGuideModal) toggleUserGuide(false);
        });
    }

    // =============================================
    // 4. FEEDBACK FORM & STAR RATING
    // =============================================
    initFeedbackForm();
});

// =============================================
// HELPER & API FUNCTIONS
// =============================================
function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function renderBulletLine(line) {
    const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)$/);
    if (boldMatch) {
        return `<strong>${escapeHtml(boldMatch[1])}</strong>${escapeHtml(boldMatch[2])}`;
    }
    return escapeHtml(line);
}

async function loadUserGuide() {
    const container = document.getElementById("userGuideBody");
    if (!container) return;

    try {
        const res = await fetch("/api/guide?audience=organization");
        const data = await res.json();

        if (!data.success || !data.sections || data.sections.length === 0) {
            container.innerHTML = '<p class="text-slate-400 text-xs">No guide content available yet.</p>';
            return;
        }

        container.innerHTML = data.sections.map((section, index) => {
            const bulletsHtml = section.bullets
                .split("\n")
                .filter(line => line.trim())
                .map(line => `<li>${renderBulletLine(line.trim())}</li>`)
                .join("");

            const divider = index > 0 ? '<hr class="border-slate-100 mb-6">' : "";

            return `
                ${divider}
                <div class="space-y-2">
                    <h4 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                        <span class="w-7 h-7 rounded-lg bg-${section.badge_color}-50 text-${section.badge_color}-600 flex items-center justify-center text-xs">${index + 1}</span>
                        ${escapeHtml(section.title)}
                    </h4>
                    <ul class="list-disc list-inside space-y-1.5 pl-2 text-slate-500 text-xs md:text-sm">
                        ${bulletsHtml}
                    </ul>
                </div>
            `;
        }).join("");

    } catch (err) {
        console.error("Failed to load user guide:", err);
        container.innerHTML = '<p class="text-slate-400 text-xs">Unable to load guide content right now.</p>';
    }
}

// =============================================
// LOAD SITE CONTACT INFO
// =============================================
async function loadContactInfo() {
    try {
        const res = await fetch("/api/contact-info");
        const data = await res.json();
        if (data.success && data.contactInfo) {
            document.getElementById("contactEmail").textContent = data.contactInfo.support_email || "—";
            document.getElementById("contactPhone").textContent = data.contactInfo.support_phone || "—";
            document.getElementById("contactHoursDays").textContent = data.contactInfo.support_hours_days || "—";
            document.getElementById("contactHoursTime").textContent = data.contactInfo.support_hours_time || "";
        }
    } catch (err) {
        console.error("Failed to load contact info:", err);
        document.getElementById("contactEmail").textContent = "pawssion_admin@gmail.com";
        document.getElementById("contactPhone").textContent = "(+63) 951 450 1937";
        document.getElementById("contactHoursDays").textContent = "Monday – Friday";
        document.getElementById("contactHoursTime").textContent = "8:00 AM – 5:00 PM";
    }
};

// Feedback Form Initializer
function initFeedbackForm() {
    const form = document.getElementById("feedbackForm");
    if (!form) return;

    const messageField = document.getElementById("feedbackMessage");
    const charCount = document.getElementById("feedbackCharCount");
    const statusBox = document.getElementById("feedbackStatus");
    const submitBtn = document.getElementById("feedbackSubmitBtn");
    const ratingButtons = document.querySelectorAll(".rating-star");
    const ratingValueInput = document.getElementById("feedbackRatingValue");
    const ratingContainer = document.getElementById("feedbackRating");

    let selectedRating = 0;

    // Character counter
    if (messageField && charCount) {
        messageField.addEventListener("input", () => {
            charCount.textContent = `${messageField.value.length} / 2000`;
        });
    }

    // Star rating rendering helper
    function paintStars(rating) {
        ratingButtons.forEach(btn => {
            const starValue = Number(btn.dataset.rating);
            const icon = btn.querySelector("i");
            if (icon) {
                if (starValue <= rating) {
                    icon.classList.remove("text-slate-300");
                    icon.classList.add("text-amber-400");
                } else {
                    icon.classList.remove("text-amber-400");
                    icon.classList.add("text-slate-300");
                }
            }
        });
    }

    ratingButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const value = Number(btn.dataset.rating);
            selectedRating = (selectedRating === value) ? 0 : value;
            if (ratingValueInput) ratingValueInput.value = selectedRating || "";
            paintStars(selectedRating);
        });

        btn.addEventListener("mouseenter", () => {
            paintStars(Number(btn.dataset.rating));
        });
    });

    if (ratingContainer) {
        ratingContainer.addEventListener("mouseleave", () => {
            paintStars(selectedRating);
        });
    }

    function showStatus(type, text) {
        if (!statusBox) return;
        statusBox.classList.remove(
            "hidden", "bg-emerald-50", "text-emerald-700", "border", "border-emerald-100",
            "bg-red-50", "text-red-700", "border-red-100"
        );

        if (type === "success") {
            statusBox.classList.add("bg-emerald-50", "text-emerald-700", "border", "border-emerald-100");
        } else {
            statusBox.classList.add("bg-red-50", "text-red-700", "border", "border-red-100");
        }

        statusBox.textContent = text;
    }

    // Submit handler
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (statusBox) statusBox.classList.add("hidden");

        if (!form.checkValidity()) {
            showStatus("error", "Please fill in the required fields before submitting.");
            form.reportValidity();
            return;
        }

        const payload = {
            feedback_type: document.getElementById("feedbackType")?.value,
            subject: document.getElementById("feedbackSubject")?.value.trim(),
            message: messageField.value.trim(),
            rating: selectedRating || null
        };

        submitBtn.disabled = true;
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xs"></i><span>Sending...</span>`;

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            showStatus("success", "Thanks! Your feedback has been sent to the Pawpon team.");
            form.reset();
            selectedRating = 0;
            if (ratingValueInput) ratingValueInput.value = "";
            paintStars(0);
            if (charCount) charCount.textContent = "0 / 2000";
        } catch (error) {
            console.error("Unable to submit feedback:", error);
            showStatus("error", "Something went wrong sending your feedback. Please try again or email us directly.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}
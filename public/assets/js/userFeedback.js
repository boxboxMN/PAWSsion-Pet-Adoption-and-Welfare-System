document.addEventListener("DOMContentLoaded", async () => {
    await loadSidebar();

    requestAnimationFrame(() => {
        loadTopbar({
            title: "Contact & Feedback",
            subtitle: "Reach out to Pawpon support or share your feedback with us."
        });
        document.body.style.visibility = "visible";
    });
});

// =============================================
// SEND FEEDBACK FORM
// =============================================
(() => {
    const form = document.getElementById("feedbackForm");
    if (!form) return;

    const messageField = document.getElementById("feedbackMessage");
    const charCount = document.getElementById("feedbackCharCount");
    const submitBtn = document.getElementById("feedbackSubmitBtn");
    const ratingButtons = document.querySelectorAll(".rating-star");
    const ratingValueInput = document.getElementById("feedbackRatingValue");

    let selectedRating = 0;

    messageField.addEventListener("input", () => {
        charCount.textContent = `${messageField.value.length} / 2000`;
    });

    function paintStars(rating) {
        ratingButtons.forEach(btn => {
            const starValue = Number(btn.dataset.rating);
            const icon = btn.querySelector("i");

            if (starValue <= rating) {
                btn.classList.remove("text-gray-300");
                btn.classList.add("text-amber-400");
                if (icon) {
                    icon.classList.remove("text-gray-300");
                    icon.classList.add("text-amber-400");
                }
            } else {
                btn.classList.remove("text-amber-400");
                btn.classList.add("text-gray-300");
                if (icon) {
                    icon.classList.remove("text-amber-400");
                    icon.classList.add("text-gray-300");
                }
            }
        });
    }

    ratingButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const value = Number(btn.dataset.rating);
            // Toggle off if same star is clicked again
            selectedRating = (selectedRating === value) ? 0 : value;
            ratingValueInput.value = selectedRating || "";
            paintStars(selectedRating);
        });

        btn.addEventListener("mouseenter", () => {
            paintStars(Number(btn.dataset.rating));
        });
    });

   const ratingContainer = document.getElementById("feedbackRating");
    if (ratingContainer) {
        ratingContainer.addEventListener("mouseleave", () => {
            paintStars(selectedRating);
        });
    }

    function showFeedbackErrorModal(text) {
        const modal = document.getElementById("feedbackErrorModal");
        const box = document.getElementById("feedbackErrorBox");
        const textEl = document.getElementById("feedbackErrorText");

        textEl.textContent = text;
        modal.classList.remove("hidden");
        requestAnimationFrame(() => {
            box.classList.remove("scale-95", "opacity-0");
            box.classList.add("scale-100", "opacity-100");
        });
    }

    function closeFeedbackErrorModal() {
        const modal = document.getElementById("feedbackErrorModal");
        const box = document.getElementById("feedbackErrorBox");

        box.classList.remove("scale-100", "opacity-100");
        box.classList.add("scale-95", "opacity-0");
        setTimeout(() => modal.classList.add("hidden"), 150);
    }

    document.getElementById("feedbackErrorCloseBtn").addEventListener("click", closeFeedbackErrorModal);
    document.getElementById("feedbackErrorModal").addEventListener("click", (e) => {
        if (e.target.id === "feedbackErrorModal") closeFeedbackErrorModal();
    });

    function showFeedbackSuccessModal() {
        const modal = document.getElementById("feedbackSuccessModal");
        const box = document.getElementById("feedbackSuccessBox");

        modal.classList.remove("hidden");
        requestAnimationFrame(() => {
            box.classList.remove("scale-95", "opacity-0");
            box.classList.add("scale-100", "opacity-100");
        });
    }

    function closeFeedbackSuccessModal() {
        const modal = document.getElementById("feedbackSuccessModal");
        const box = document.getElementById("feedbackSuccessBox");

        box.classList.remove("scale-100", "opacity-100");
        box.classList.add("scale-95", "opacity-0");
        setTimeout(() => modal.classList.add("hidden"), 150);
    }

    document.getElementById("feedbackSuccessCloseBtn").addEventListener("click", closeFeedbackSuccessModal);
    document.getElementById("feedbackSuccessModal").addEventListener("click", (e) => {
        if (e.target.id === "feedbackSuccessModal") closeFeedbackSuccessModal();
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            showFeedbackErrorModal("Please fill in the required fields before submitting.");
            form.reportValidity();
            return;
        }

        const payload = {
            feedback_type: document.getElementById("feedbackType").value,
            subject: document.getElementById("feedbackSubject").value.trim(),
            message: messageField.value.trim(),
            rating: selectedRating || null
        };

        submitBtn.disabled = true;
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin text-xs"></i><span>Sending...</span>`;

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            form.reset();
            selectedRating = 0;
            ratingValueInput.value = "";
            paintStars(0);
            charCount.textContent = "0 / 2000";
            showFeedbackSuccessModal();
        } catch (error) {
            console.error("Unable to submit feedback:", error);
            showFeedbackErrorModal("Something went wrong sending your feedback. Please try again or email us directly.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
})();

// =============================================
// LOAD SITE CONTACT INFO
// =============================================
(async () => {
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
})();
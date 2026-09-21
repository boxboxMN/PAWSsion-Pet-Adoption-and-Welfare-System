// ✅ Added escapeHtml helper function to prevent XSS vulnerabilities
function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Generate 30-min interval time options, 6:00 AM – 11:30 PM
function buildTimeOptions(selectEl) {
    selectEl.innerHTML = '<option value="" disabled selected>--</option>';
    for (let hour = 6; hour <= 23; hour++) {
        for (const minute of [0, 30]) {
            const period = hour < 12 ? "AM" : "PM";
            const displayHour = (hour % 12) === 0 ? 12 : (hour % 12);
            const displayMinute = minute === 0 ? "00" : "30";
            const label = `${displayHour}:${displayMinute} ${period}`;
            const opt = document.createElement("option");
            opt.value = label;
            opt.textContent = label;
            selectEl.appendChild(opt);
        }
    }
}

function showContactAlert(box, isSuccess, message) {
    box.classList.remove("hidden");
    box.className = isSuccess
        ? "mb-4 p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200";
    box.textContent = message;
    setTimeout(() => box.classList.add("hidden"), 4000);
}

document.addEventListener("DOMContentLoaded", async () => {
    loadSidebar("settings");
    loadTopbar({ title: "Settings", subtitle: "Manage platform-wide configuration." });

    const contactForm = document.getElementById("contactInfoForm");
    const contactAlertBox = document.getElementById("contactAlertBox");
    const emailInput = document.getElementById("supportEmail");
    const phoneInput = document.getElementById("supportPhone");
    const daysSelect = document.getElementById("supportHoursDays");
    const startSelect = document.getElementById("supportTimeStart");
    const endSelect = document.getElementById("supportTimeEnd");

    buildTimeOptions(startSelect);
    buildTimeOptions(endSelect);

    // Sanitize phone input: digits only, capped at 11 chars, as the admin types
    phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 11);
    });

    try {
        const res = await fetch('/api/contact-info');
        const data = await res.json();
        if (data.success && data.contactInfo) {
            emailInput.value = data.contactInfo.support_email || "";
            phoneInput.value = (data.contactInfo.support_phone || "").replace(/\D/g, "").slice(0, 11);
            daysSelect.value = data.contactInfo.support_hours_days || "";

            const [start, end] = (data.contactInfo.support_hours_time || "").split(" – ");
            if (start) startSelect.value = start.trim();
            if (end) endSelect.value = end.trim();
        }
    } catch (err) {
        console.error("Failed to load contact info", err);
    }

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const days = daysSelect.value;
        const start = startSelect.value;
        const end = endSelect.value;

        // --- Validation ---
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showContactAlert(contactAlertBox, false, "Please enter a valid email address.");
            return;
        }

        const phPhonePattern = /^09\d{9}$/;
        if (!phPhonePattern.test(phone)) {
            showContactAlert(contactAlertBox, false, "Phone number must be 11 digits starting with 09 (PH mobile format).");
            return;
        }

        if (!days) {
            showContactAlert(contactAlertBox, false, "Please select support days.");
            return;
        }

        if (!start || !end) {
            showContactAlert(contactAlertBox, false, "Please select both a start and end support time.");
            return;
        }

        const payload = {
            support_email: email,
            support_phone: phone,
            support_hours_days: days,
            support_hours_time: `${start} – ${end}`
        };

        try {
            const res = await fetch('/admin/settings/contact-info', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            showContactAlert(contactAlertBox, result.success, result.success ? "Contact info updated successfully!" : (result.message || "Failed to update contact info."));
        } catch (err) {
            console.error(err);
            showContactAlert(contactAlertBox, false, "Something went wrong. Please try again.");
        }
    });

    // =============================================
    // ORGANIZATION USER GUIDE EDITOR
    // =============================================
    (async () => {
        const listContainer = document.getElementById("guideSectionsList");
        const alertBox = document.getElementById("guideAlertBox");
        const modal = document.getElementById("guideSectionModal");
        const form = document.getElementById("guideSectionForm");
        const modalTitle = document.getElementById("guideModalTitle");
        const idInput = document.getElementById("guideSectionId");
        const titleInput = document.getElementById("guideSectionTitle");
        const colorInput = document.getElementById("guideSectionColor");
        const bulletsInput = document.getElementById("guideSectionBullets");

        const deleteModal = document.getElementById("deleteModal");
        const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
        const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

        function showAlert(isSuccess, message) {
            alertBox.classList.remove("hidden");
            alertBox.className = isSuccess
                ? "mb-4 p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200";
            alertBox.textContent = message;
            setTimeout(() => alertBox.classList.add("hidden"), 4000);
        }

        function openModal(section) {
            if (section) {
                modalTitle.textContent = "Edit Section";
                idInput.value = section.section_id;
                titleInput.value = section.title;
                colorInput.value = section.badge_color;
                bulletsInput.value = section.bullets;
            } else {
                modalTitle.textContent = "Add Section";
                idInput.value = "";
                titleInput.value = "";
                colorInput.value = "blue";
                bulletsInput.value = "";
            }
            modal.classList.remove("hidden");
        }

        function closeModal() {
            modal.classList.add("hidden");
        }

        async function loadSections() {
            try {
                const res = await fetch("/api/guide?audience=organization");
                const data = await res.json();

                if (!data.success || !data.sections || data.sections.length === 0) {
                    listContainer.innerHTML = '<p class="text-slate-400 text-xs">No sections yet. Click "Add Section" to create one.</p>';
                    return;
                }

                listContainer.innerHTML = data.sections.map(section => `
                    <div class="section-row flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white cursor-move" draggable="true" data-id="${Number(section.section_id)}">
                        <div class="flex items-center gap-3 min-w-0">
                            <i class="fa-solid fa-grip-vertical text-slate-300"></i>
                            <div class="min-w-0">
                                <p class="text-sm font-semibold text-slate-800 truncate">${escapeHtml(section.title)}</p>
                                <p class="text-xs text-slate-400">${section.bullets ? section.bullets.split("\n").filter(l => l.trim()).length : 0} bullet point(s)</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <button type="button" class="edit-section-btn px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition" data-id="${Number(section.section_id)}">Edit</button>
                            <button type="button" class="delete-section-btn px-3 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-lg text-xs font-semibold transition" data-id="${Number(section.section_id)}">Delete</button>
                        </div>
                    </div>
                `).join("");

                setupDragAndDrop();

                    // Wire up edit buttons
                    listContainer.querySelectorAll(".edit-section-btn").forEach(btn => {
                        btn.addEventListener("click", () => {
                            const section = data.sections.find(s => String(s.section_id) === btn.dataset.id);
                            if (section) openModal(section);
                        });
                    });

                    // Wire up delete buttons]
                    let sectionToDelete = null;

                    listContainer.querySelectorAll(".delete-section-btn").forEach(btn => {
                        btn.addEventListener("click", async () => {
                            // Store the section ID
                            sectionToDelete = btn.dataset.id;

                            // Show modal
                            deleteModal.classList.remove("hidden");
                            deleteModal.classList.add("flex");
                        });
                    });

                    // Cancel delete
                    cancelDeleteBtn.addEventListener("click", () => {
                        sectionToDelete = null;

                        deleteModal.classList.add("hidden");
                        deleteModal.classList.remove("flex");
                    });

                    // Confirm delete
                    confirmDeleteBtn.addEventListener("click", async () => {
                        if (!sectionToDelete) return;

                        try {
                            const res = await fetch(
                                `/admin/guide/sections/${sectionToDelete}`,
                                {
                                    method: "DELETE"
                                }
                            );

                            const result = await res.json();

                            if (result.success) {
                                deleteModal.classList.add("hidden");
                                deleteModal.classList.remove("flex");

                                sectionToDelete = null;

                                showAlert(true, "Section deleted.");
                                loadSections();
                            } else {
                                showAlert(
                                    false,
                                    result.message || "Failed to delete section."
                                );
                            }

                        } catch (err) {
                            console.error(err);

                            deleteModal.classList.add("hidden");
                            deleteModal.classList.remove("flex");

                            sectionToDelete = null;

                            showAlert(false, "Something went wrong.");
                        }
                    });   
                    
            } catch (err) {
                console.error("Failed to load guide sections", err);
                listContainer.innerHTML = '<p class="text-slate-400 text-xs">Unable to load sections.</p>';
            }
        }

        function setupDragAndDrop() {
            let draggedRow = null;

            listContainer.querySelectorAll(".section-row").forEach(row => {
                row.addEventListener("dragstart", () => {
                    draggedRow = row;
                    row.classList.add("opacity-40");
                });

                row.addEventListener("dragend", () => {
                    row.classList.remove("opacity-40");
                    draggedRow = null;
                    saveNewOrder();
                });

                row.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    if (!draggedRow || draggedRow === row) return;

                    const rect = row.getBoundingClientRect();
                    const midpoint = rect.top + rect.height / 2;
                    const insertBefore = e.clientY < midpoint;

                    if (insertBefore) {
                        row.parentNode.insertBefore(draggedRow, row);
                    } else {
                        row.parentNode.insertBefore(draggedRow, row.nextSibling);
                    }
                });
            });
        }

        async function saveNewOrder() {
            const orderedIds = Array.from(listContainer.querySelectorAll(".section-row"))
                .map(row => Number(row.dataset.id));

            try {
                const res = await fetch("/admin/guide/sections/reorder", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderedIds })
                });
                const result = await res.json();

                if (!result.success) {
                    showAlert(false, result.message || "Failed to save new order.");
                    loadSections(); // revert to server truth on failure
                }
            } catch (err) {
                console.error("Reorder failed:", err);
                showAlert(false, "Something went wrong saving the new order.");
                loadSections();
            }
        }

            document.getElementById("addGuideSectionBtn").addEventListener("click", () => openModal(null));
            document.getElementById("guideModalCancelBtn").addEventListener("click", closeModal);

            // --- Recycle Bin ---
            const recycleBinModal = document.getElementById("recycleBinModal");
            const recycleBinList = document.getElementById("recycleBinList");

            async function loadRecycleBin() {
                recycleBinList.innerHTML = '<p class="text-slate-400 text-xs">Loading...</p>';
                try {
                    const res = await fetch("/admin/guide/sections/trash?audience=organization");
                    const data = await res.json();

                    if (!data.success || !data.sections || data.sections.length === 0) {
                        recycleBinList.innerHTML = '<p class="text-slate-400 text-xs">Recycle Bin is empty.</p>';
                        return;
                    }

                    recycleBinList.innerHTML = data.sections.map(section => {
                        const deletedDate = new Date(section.deleted_at);
                        const daysLeft = section.days_left;

                        return `
                        <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200">
                            <div class="min-w-0">
                                <p class="text-sm font-semibold text-slate-800 truncate">${escapeHtml(section.title)}</p>
                                <p class="text-xs text-slate-400">Deleted ${deletedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · Purges automatically in ${daysLeft} day${daysLeft === 1 ? "" : "s"}</p>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <button type="button" class="restore-section-btn px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-lg text-xs font-semibold transition" data-id="${Number(section.section_id)}">Restore</button>
                                <button type="button" class="permadelete-section-btn px-3 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-lg text-xs font-semibold transition" data-id="${Number(section.section_id)}">Delete Forever</button>
                            </div>
                        </div>
                        `;
                    }).join("");

                    recycleBinList.querySelectorAll(".restore-section-btn").forEach(btn => {
                        btn.addEventListener("click", async () => {
                            try {
                                const res = await fetch(`/admin/guide/sections/${btn.dataset.id}/restore`, { method: "PUT" });
                                const result = await res.json();
                                if (result.success) {
                                    showAlert(true, "Section restored.");
                                    loadRecycleBin();
                                    loadSections();
                                } else {
                                    showAlert(false, result.message || "Failed to restore section.");
                                }
                            } catch (err) {
                                console.error(err);
                                showAlert(false, "Something went wrong.");
                            }
                        });
                    });

                    recycleBinList.querySelectorAll(".permadelete-section-btn").forEach(btn => {
                        btn.addEventListener("click", async () => {
                            if (!confirm("Permanently delete this section? This cannot be undone.")) return;
                            try {
                                const res = await fetch(`/admin/guide/sections/${btn.dataset.id}/permanent`, { method: "DELETE" });
                                const result = await res.json();
                                if (result.success) {
                                    showAlert(true, "Section permanently deleted.");
                                    loadRecycleBin();
                                } else {
                                    showAlert(false, result.message || "Failed to delete section.");
                                }
                            } catch (err) {
                                console.error(err);
                                showAlert(false, "Something went wrong.");
                            }
                        });
                    });

                } catch (err) {
                    console.error("Failed to load recycle bin", err);
                    recycleBinList.innerHTML = '<p class="text-slate-400 text-xs">Unable to load Recycle Bin.</p>';
                }
            }

            document.getElementById("openRecycleBinBtn").addEventListener("click", () => {
                recycleBinModal.classList.remove("hidden");
                loadRecycleBin();
            });

            document.getElementById("closeRecycleBinBtn").addEventListener("click", () => {
                recycleBinModal.classList.add("hidden");
            });

            /// --- Form Submission ---
            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                const id = idInput.value;
                const payload = {
                    audience: "organization",
                    title: titleInput.value.trim(),
                    badge_color: colorInput.value,
                    bullets: bulletsInput.value.trim()
                };

                try {
                    const url = id ? `/admin/guide/sections/${id}` : "/admin/guide/sections";
                    const method = id ? "PUT" : "POST";

                    const res = await fetch(url, {
                        method,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    const result = await res.json();

                    if (result.success) {
                        closeModal();
                        showAlert(true, id ? "Section updated." : "Section added.");
                        loadSections();
                    } else {
                        showAlert(false, result.message || "Failed to save section.");
                    }
                } catch (err) {
                    console.error(err);
                    showAlert(false, "Something went wrong.");
                }
            });

        loadSections();
    })();
});
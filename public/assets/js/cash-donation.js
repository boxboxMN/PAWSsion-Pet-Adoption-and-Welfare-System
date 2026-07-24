  async function loadComponent(id, file) {
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error(`Cannot load ${file}`);
                }
                document.getElementById(id).innerHTML = await response.text();
            } catch (error) {
                console.error(error);
            }
        }

        Promise.all([
            loadComponent("sidebar", "/user/userSidebar.html"),
            loadComponent("header", "/user/userHeader.html")
        ])
        .then(() => {
            // Show components
            const sidebar = document.getElementById("sidebar");
            const header = document.getElementById("header");
            if (sidebar) sidebar.style.visibility = "visible";
            if (header) header.style.visibility = "visible";

            const currentPath = window.location.pathname;
            const pageTitle = document.getElementById("pageTitle");

            // Pages na wala sa sidebar
            const customTitles = {
                "/profile": "Profile",
                "/cash-donation": "Donation",
                "/inkind-donation": "Donation"
            };

            if (pageTitle && customTitles[currentPath]) {
                pageTitle.textContent = customTitles[currentPath];
            }

            const links = document.querySelectorAll("#sidebar .nav-link");

            links.forEach(link => {
                const href = link.getAttribute("href");
                const isActive = href === currentPath || (href !== "/dashboard" && currentPath.startsWith(href));

                if (isActive) {
                    link.className = "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl bg-blue-600 text-white shadow";
                    if (pageTitle && !customTitles[currentPath]) {
                        pageTitle.textContent = link.dataset.title;
                    }
                } else {
                    link.className = "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition";
                }
            });

            document.body.style.visibility = "visible";
        })
        .catch(error => console.error("Component loading error:", error));

    document.addEventListener("DOMContentLoaded", async function () {

        let organizations = [];
        let selectedOrganization = null;

        // Modal elements
        const modal = document.getElementById("orgModal");
        const closeBtn = document.getElementById("modalClose");
        const closeBtn2 = document.getElementById("modalCloseBtn");

        const orgName = document.getElementById("modalOrgName");
        const orgAddress = document.getElementById("modalOrgAddress");
        const orgPhone = document.getElementById("modalOrgPhone");
        const orgEmail = document.getElementById("modalOrgEmail");
        const orgMission = document.getElementById("modalOrgMission");

        // Form fields
        const donorNameInput = document.querySelector('input[placeholder="Name"]');
        const donorEmailInput = document.querySelector('input[placeholder="Email Address"]');
        const gcashNameInput = document.querySelector('input[placeholder="GCASH account name"]');
        const refNumInput = document.querySelector('input[placeholder="Reference Number"]');
        const amountInput = document.querySelector('input[placeholder="Enter custom amount"]');
        const privacyCheckbox = document.querySelector('input[type="checkbox"]');
        const receiptFileInput = document.querySelector('input[type="file"]');
        const submitBtn = document.getElementById("submitDonationBtn") || document.querySelector('button[type="submit"]') || document.querySelector('main button:last-of-type');

        // Auto-fill logged-in user details if available
        async function fetchUserProfile() {
            try {
                const res = await fetch("/api/user/profile");
                if (res.ok) {
                    const user = await res.json();
                    if (donorNameInput && (user.first_name || user.last_name)) {
                        donorNameInput.value = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                    }
                    if (donorEmailInput && user.email) {
                        donorEmailInput.value = user.email;
                    }
                }
            } catch (e) {
                console.log("Guest mode or user profile endpoint unavailable.");
            }
        }

        // Load organizations from API
        async function loadOrganizations() {
            try {
                const response = await fetch("/api/organizations");
                organizations = await response.json();

                const container = document.getElementById("orgContainer");
                if (!container) return;
                
                container.innerHTML = "";

                if (!organizations || organizations.length === 0) {
                    container.innerHTML = `<p class="text-gray-500 text-center col-span-3">No verified organizations available at the moment.</p>`;
                    return;
                }

                organizations.forEach(org => {
                    container.innerHTML += `
                        <div class="org-card border rounded-xl p-4 relative cursor-pointer" data-id="${org.organization_id}">
                            <div class="checkmark absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg">
                                ✓
                            </div>
                            <div class="flex justify-center mb-4">
                                <img src="${org.profile_pic}" class="w-16 h-16 rounded-full object-cover" alt="${org.organization_name}">
                            </div>
                            <h3 class="font-bold text-center text-sm">
                                ${org.organization_name}
                            </h3>
                            <p class="text-gray-500 text-xs text-center mt-2">
                                ${org.city || ''}, ${org.province || ''}
                            </p>
                            <p class="view-profile-btn text-blue-600 text-xs text-center mt-4 cursor-pointer hover:underline">
                                View Organization Profile →
                            </p>
                        </div>
                    `;
                });

                initializeCards();

            } catch (err) {
                console.error("Error loading organizations:", err);
            }
        }

        function initializeCards() {
            document.querySelectorAll(".org-card").forEach(card => {
                card.addEventListener("click", function (e) {
                    if (e.target.closest(".view-profile-btn")) return;

                    document.querySelectorAll(".org-card").forEach(c => c.classList.remove("selected"));
                    this.classList.add("selected");

                    selectedOrganization = this.dataset.id;
                    updateDonationInfo(selectedOrganization);
                });

                const viewBtn = card.querySelector(".view-profile-btn");
                if (viewBtn) {
                    viewBtn.addEventListener("click", function (e) {
                        e.stopPropagation();
                        openModal(card.dataset.id);
                    });
                }
            });
        }

       function updateDonationInfo(id) {
    const org = organizations.find(o => o.organization_id == id);
    if (!org) return;

    // 1. Target Elements
    const nameEl = document.getElementById("gcashName");
    const numEl = document.getElementById("gcashNumber");
    const qrEl = document.getElementById("qrImage");

    // 2. Update GCash Name & Number
    if (nameEl) nameEl.textContent = org.gcash_name || "N/A";
    if (numEl) numEl.textContent = org.gcash_number || "N/A";

    // 3. Update QR Code Image with Validation
    if (qrEl) {
        const isValidQr = org.qr_code && 
                          org.qr_code.trim() !== "" && 
                          org.qr_code !== "/uploads/qr" && 
                          !org.qr_code.endsWith("/uploads/");

        if (isValidQr) {
            qrEl.src = org.qr_code;
            qrEl.classList.remove("hidden");
        } else {
            // Fallback sa placeholder kapag walang valid na QR code
            qrEl.src = "https://via.placeholder.com/200x200?text=No+QR+Available";
            qrEl.classList.remove("hidden");
        }
    }
}

        function openModal(id) {
            const org = organizations.find(o => o.organization_id == id);
            if (!org || !modal) return;

            if (orgName) orgName.textContent = org.organization_name;
            if (orgAddress) orgAddress.textContent = `${org.city || ''}, ${org.province || ''}`;
            if (orgPhone) orgPhone.textContent = org.contact_number || "N/A";
            if (orgEmail) orgEmail.textContent = org.email || "N/A";
            if (orgMission) orgMission.textContent = org.description || "No description available.";

            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        if (closeBtn2) closeBtn2.addEventListener("click", closeModal);

        if (modal) {
            modal.addEventListener("click", function (e) {
                if (e.target === modal) closeModal();
            });
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeModal();
        });

        // ==========================================
        // SUBMIT CASH DONATION HANDLER
        // ==========================================
       if (submitBtn) {
    submitBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        if (!selectedOrganization) {
            showToast("Please select an organization to donate to.", "error");
            return;
        }

        // --- CHECK IF ORG HAS VALID GCASH DETAILS ---
        const org = organizations.find(o => o.organization_id == selectedOrganization);
        if (!org || !org.gcash_number || org.gcash_number.trim() === "") {
            showToast("This organization hasn't provided GCash details yet. Donation is temporarily unavailable.", "error");
            return;
        }

        if (!donorNameInput || !donorNameInput.value.trim()) {
            showToast("Please enter your full name.", "error");
            return;
        }
        if (!donorEmailInput || !donorEmailInput.value.trim()) {
            showToast("Please enter your email address.", "error");
            return;
        }
        if (!refNumInput || !refNumInput.value.trim()) {
            showToast("Please enter the GCash Reference Number.", "error");
            return;
        }
        if (!amountInput || !amountInput.value.trim() || parseFloat(amountInput.value) <= 0) {
            showToast("Please enter a valid donation amount.", "error");
            return;
        }
        if (!receiptFileInput || !receiptFileInput.files.length) {
            showToast("Please upload your GCash payment receipt.", "error");
            return;
        }
        if (privacyCheckbox && !privacyCheckbox.checked) {
            showToast("You must agree to the privacy terms before submitting.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("organization_id", selectedOrganization);
        formData.append("donor_name", donorNameInput.value.trim());
        formData.append("donor_email", donorEmailInput.value.trim());
        formData.append("gcash_account_name", gcashNameInput ? gcashNameInput.value.trim() : "");
        formData.append("reference_number", refNumInput.value.trim());
        formData.append("amount", amountInput.value.trim());
        formData.append("receipt", receiptFileInput.files[0]);

        const originalBtnText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting...";

            const res = await fetch("/api/user/donation/cash", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                showToast(data.message || "Thank you! Your donation was submitted successfully.", "success");
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showToast(data.error || data.message || "Unable to process donation.", "error");
            }
        } catch (err) {
            console.error("Submission Error:", err);
            showToast("An error occurred while connecting to the server.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}
        if (receiptFileInput) {
            receiptFileInput.addEventListener("change", function() {
                if (this.files.length > 0) {
                    const label = this.closest("label")?.querySelector("span");
                    if (label) label.textContent = `Selected: ${this.files[0].name}`;
                }
            });
        }

await fetchUserProfile();
await loadOrganizations();

if (organizations.length > 0) {
    // Hanapin ang unang org na may valid QR code, kung wala, fallback sa index 0
    const targetOrg = organizations.find(o => o.qr_code && o.qr_code.trim() !== "") || organizations[0];
    
    selectedOrganization = targetOrg.organization_id;
    updateDonationInfo(selectedOrganization);

    const targetCard = document.querySelector(`.org-card[data-id="${selectedOrganization}"]`);
    if (targetCard) {
        targetCard.classList.add("selected");
    }
}
    });
    function showToast(message, type = "error") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const isSuccess = type === "success";
    const bgColor = isSuccess ? "bg-emerald-600" : "bg-rose-600";
    const iconClass = isSuccess ? "fa-circle-check" : "fa-circle-exclamation";

    const toast = document.createElement("div");
    toast.className = `${bgColor} text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-5 opacity-0 pointer-events-auto max-w-md`;
    
    toast.innerHTML = `
        <i class="fa-solid ${iconClass} text-lg"></i>
        <span class="text-sm font-medium leading-snug">${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-auto text-white/70 hover:text-white p-1">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove("translate-y-5", "opacity-0");
    }, 10);

    setTimeout(() => {
        toast.classList.add("translate-y-5", "opacity-0");
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
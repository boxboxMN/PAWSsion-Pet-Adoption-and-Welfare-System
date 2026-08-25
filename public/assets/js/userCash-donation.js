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
    const sidebar = document.getElementById("sidebar");
    const header = document.getElementById("header");
    if (sidebar) sidebar.style.visibility = "visible";
    if (header) header.style.visibility = "visible";

    const currentPath = window.location.pathname;
    const pageTitle = document.getElementById("pageTitle");

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
    
    const modal = document.getElementById("orgModal");
    const closeBtn = document.getElementById("modalClose");
    const closeBtn2 = document.getElementById("modalCloseBtn");

    const orgName = document.getElementById("modalOrgName");
    const orgAddress = document.getElementById("modalOrgAddress");
    const orgPhone = document.getElementById("modalOrgPhone");
    const orgEmail = document.getElementById("modalOrgEmail");
    const orgMission = document.getElementById("modalOrgMission");

    const donorNameInput = document.querySelector('input[placeholder="Name"]');
    const donorEmailInput = document.querySelector('input[placeholder="Email Address"]');
    
    const paymentMethodSelect = document.getElementById("paymentMethod");
    const accountNameLabel = document.getElementById("accountNameLabel");
    const accountNumberLabel = document.getElementById("accountNumberLabel");
    
    const gcashNameInput = document.getElementById("gcashNameInput");
    const refNumInput = document.getElementById("refNumInput");
    const amountInput = document.getElementById("customAmount");
    
    if (amountInput) {
        amountInput.addEventListener("input", function() {
            if (this.value < 0) {
                this.value = Math.abs(this.value);
            }
        });
        amountInput.addEventListener("keydown", function(e) {
            if (e.key === "-" || e.key === "Subtract") {
                e.preventDefault();
            }
        });
    }

    const privacyCheckbox = document.querySelector('input[type="checkbox"]');
    const receiptFileInput = document.querySelector('input[type="file"]');
    const submitBtn = document.getElementById("submitDonationBtn");

    async function fetchUserProfile() {
        try {
            const res = await fetch("/api/user/profile");
            if (res.ok) {
                const user = await res.json();
                
                if (donorNameInput && (user.first_name || user.last_name)) {
                    donorNameInput.value = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                    donorNameInput.readOnly = true;
                    donorNameInput.classList.add("bg-gray-100", "cursor-not-allowed");
                }
                
                if (donorEmailInput && user.email) {
                    donorEmailInput.value = user.email;
                    donorEmailInput.readOnly = true;
                    donorEmailInput.classList.add("bg-gray-100", "cursor-not-allowed");
                }
            }
        } catch (e) {
            console.log("Guest mode or user profile endpoint unavailable.");
        }
    }

   async function loadOrganizations() {

    try {

        const response =
            await fetch(
                "/api/organizations"
            );

        if (!response.ok) {

            throw new Error(
                `Failed to load organizations (${response.status})`
            );
        }

        const data =
            await response.json();

        console.log(
            "USER ORGANIZATIONS:",
            data
        );


        organizations =
            Array.isArray(data)
                ? data
                : (
                    data.organizations ||
                    data.data ||
                    []
                );


        console.log(
            "USER ORGANIZATION DROP-OFF DATA:",
            organizations.map(org => ({
                organization_id:
                    org.organization_id,

                organization_name:
                    org.organization_name,

                dropoff_location_name:
                    org.dropoff_location_name,

                dropoff_address:
                    org.dropoff_address,

                dropoff_hours:
                    org.dropoff_hours,

                dropoff_notes:
                    org.dropoff_notes,

                dropoff_image:
                    org.dropoff_image
            }))
        );


        const container =
            document.getElementById(
                "orgContainer"
            );

        if (!container) return;


        container.innerHTML = "";


        if (
            !organizations ||
            organizations.length === 0
        ) {

            container.innerHTML = `
                <p class="text-gray-500 text-center col-span-3">
                    No verified organizations available at the moment.
                </p>
            `;

            return;
        }


        organizations.forEach(org => {

            const profileImg =
                getValidImageUrl(
                    org.profile_pic,
                    "https://via.placeholder.com/64"
                );


            container.innerHTML += `
                <div
                    class="org-card border rounded-xl p-4 relative cursor-pointer"
                    data-id="${org.organization_id}"
                >

                    <div
                        class="checkmark absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg"
                    >
                        ✓
                    </div>

                    <img
                        src="${profileImg}"
                        class="w-16 h-16 rounded-full object-cover mb-3"
                    >

                    <h3 class="font-semibold">
                        ${org.organization_name || "Organization"}
                    </h3>

                </div>
            `;
        });


        initializeCards();


    } catch (error) {

        console.error(
            "Error loading organizations:",
            error
        );
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
   // Helper para suriin kung valid ang QR Code image path
function isValidQrPath(path) {
    if (!path || typeof path !== "string") return false;
    const trimmed = path.trim();
    return (
        trimmed !== "" && 
        trimmed !== "/uploads/qr" && 
        !trimmed.endsWith("/uploads/") &&
        !trimmed.endsWith("/null") &&
        !trimmed.endsWith("/undefined")
    );
}function updateDonationInfo(id) {
    const org = organizations.find(o => String(o.organization_id) === String(id));

    const nameEl = document.getElementById("gcashName"); // Label/Display ng Account Name
    const numEl = document.getElementById("gcashNumber");   // Label/Display ng Account Number
    const qrEl = document.getElementById("qrImage");

    if (!org) {
        if (nameEl) nameEl.textContent = "Select an organization";
        if (numEl) numEl.textContent = "Select an organization";
        if (qrEl) qrEl.classList.add("hidden");
        return;
    }

    // Kunin ang kasalukuyang piniling payment method mula sa dropdown (GCash o Maya)
    const method = paymentMethodSelect ? paymentMethodSelect.value : "GCash";

    if (method === "Maya") {
        if (accountNameLabel) accountNameLabel.textContent = "Maya Account Name:";
        if (accountNumberLabel) accountNumberLabel.textContent = "Maya Number:";
        
        // Babasahin mula sa database columns: maya_name at maya_number
        if (nameEl) nameEl.textContent = org.maya_name ? org.maya_name : "N/A";
        if (numEl) numEl.textContent = org.maya_number ? org.maya_number : "N/A";

        if (qrEl) {
            if (org.maya_qr_code && org.maya_qr_code.trim() !== "") {
                qrEl.src = org.maya_qr_code;
                qrEl.classList.remove("hidden");
            } else {
                qrEl.src = "https://via.placeholder.com/200x200?text=No+Maya+QR";
                qrEl.classList.remove("hidden");
            }
        }
    } else {
        if (accountNameLabel) accountNameLabel.textContent = "GCASH Account Name:";
        if (accountNumberLabel) accountNumberLabel.textContent = "GCASH Number:";
        
        // Babasahin mula sa database columns: gcash_name at gcash_number
        if (nameEl) nameEl.textContent = org.gcash_name ? org.gcash_name : "N/A";
        if (numEl) numEl.textContent = org.gcash_number ? org.gcash_number : "N/A";

        if (qrEl) {
            if (org.qr_code && org.qr_code.trim() !== "") {
                qrEl.src = org.qr_code;
                qrEl.classList.remove("hidden");
            } else {
                qrEl.src = "https://via.placeholder.com/200x200?text=No+GCash+QR";
                qrEl.classList.remove("hidden");
            }
        }
    }
}

// Magdagdag ng event listener para mag-update kapag pinalitan ang Payment Method dropdown
if (paymentMethodSelect) {
    paymentMethodSelect.addEventListener("change", function() {
        if (selectedOrganization) {
            updateDonationInfo(selectedOrganization);
        }
    });
}
    async function openModal(id) {
        const org = organizations.find(o => o.organization_id == id);
        if (!org || !modal) return;

        if (orgName) orgName.textContent = org.organization_name;
        if (orgAddress) orgAddress.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${org.city || ''}, ${org.province || ''}`;
        if (orgPhone) orgPhone.textContent = org.contact_number || "N/A";
        if (orgEmail) orgEmail.textContent = org.email || "N/A";
        if (orgMission) orgMission.textContent = org.description || "No description available.";

        try {
            const response = await fetch(`/api/organizations/${id}`);
            if (response.ok) {
                const fullOrg = await response.json();
                
                if (orgName) orgName.textContent = fullOrg.organization_name || org.organization_name;
                if (orgAddress) {
                    const addressText = fullOrg.city && fullOrg.province 
                        ? `${fullOrg.city}, ${fullOrg.province}` 
                        : (fullOrg.address || `${org.city || ''}, ${org.province || ''}`);
                    orgAddress.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${addressText}`;
                }
                if (orgPhone) orgPhone.textContent = fullOrg.contact_number || fullOrg.phone || "N/A";
                if (orgEmail) orgEmail.textContent = fullOrg.email || fullOrg.org_email || "N/A";
                if (orgMission) orgMission.textContent = fullOrg.description || fullOrg.mission || "No description available.";

                const logoElement = document.getElementById("modalOrgLogo");
                const logoPath = fullOrg.logo || fullOrg.avatar || fullOrg.image || org.profile_pic || org.logo;

                if (logoElement && logoPath) {
                    const validLogoUrl = getValidImageUrl(logoPath, "");
                    logoElement.outerHTML = `<img id="modalOrgLogo" src="${validLogoUrl}" alt="Org Logo" class="w-full h-full object-cover rounded-full">`;
                } else if (logoElement) {
                    logoElement.outerHTML = `<i id="modalOrgLogo" class="fa-solid fa-building-user"></i>`;
                }
            }
        } catch (err) {
            console.error("Error fetching live organization profile:", err);
        }

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

    if (submitBtn) {
        submitBtn.addEventListener("click", async function (e) {
            e.preventDefault();

            if (!selectedOrganization) {
                showToast("Please select an organization to donate to.", "error");
                return;
            }
            
            const org = organizations.find(o => o.organization_id == selectedOrganization);
            const method = paymentMethodSelect ? paymentMethodSelect.value : "GCash";

            if (method === "Maya") {
                if (!org || !org.maya_number || org.maya_number.trim() === "") {
                    showToast("This organization hasn't provided Maya details yet.", "error");
                    return;
                }
            } else {
                if (!org || !org.gcash_number || org.gcash_number.trim() === "") {
                    showToast("This organization hasn't provided GCash details yet.", "error");
                    return;
                }
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
                showToast("Please enter the Reference Number.", "error");
                return;
            }
            if (!amountInput || !amountInput.value.trim() || parseFloat(amountInput.value) <= 0) {
                showToast("Please enter a valid donation amount greater than zero.", "error");
                return;
            }
            if (!receiptFileInput || !receiptFileInput.files.length) {
                showToast("Please upload your payment receipt.", "error");
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
            formData.append("payment_method", method);
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
                const fileNameSpan = document.getElementById("receiptFileName");
                if (fileNameSpan) {
                    fileNameSpan.textContent = `Selected: ${this.files[0].name}`;
                    fileNameSpan.classList.add("text-blue-600", "font-medium");
                }
            }
        });
    }

    await fetchUserProfile();
    await loadOrganizations();

    if (organizations.length > 0) {
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

function getValidImageUrl(imagePath, fallbackUrl) {
    if (!imagePath || imagePath.trim() === "" || imagePath === "null" || imagePath === "undefined") {
        return fallbackUrl;
    }
    if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
        return "/" + imagePath;
    }
    return imagePath;
}
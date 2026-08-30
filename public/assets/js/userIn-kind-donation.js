document.addEventListener('DOMContentLoaded', async function() {
    let organizations = [];
    let selectedOrganization = null;

    // Removed itemSelect since it's now a direct text input in the HTML[cite: 1]
    const itemNameInput = document.getElementById('itemNameInput');
    const quantityInput = document.getElementById('quantityInput');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const submitBtn = document.getElementById('submitInKindBtn');

    const dropoffTitle = document.getElementById('dropoffTitle');
    const dropoffAddress = document.getElementById('dropoffAddress');
    const dropoffHours = document.getElementById('dropoffHours');
    const dropoffNotes = document.getElementById('dropoffNotes');
    const dropoffImg = document.getElementById('dropoffImg');
    const modal = document.getElementById("orgModal");
    const closeBtn = document.getElementById("modalClose");
    const closeBtn2 = document.getElementById("modalCloseBtn");

    const orgName = document.getElementById("modalOrgName");
    const orgAddress = document.getElementById("modalOrgAddress");
    const orgPhone = document.getElementById("modalOrgPhone");
    const orgEmail = document.getElementById("modalOrgEmail");
    const orgMission = document.getElementById("modalOrgMission");

    /**
     * Loads an HTML component (e.g., sidebar or header)[cite: 2]
     */
    async function loadComponent(id, file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Cannot load ${file}`);
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
    .catch(error => console.error("Component load error:", error));

    /**
     * Returns a valid image URL.[cite: 2]
     */
    function getValidImageUrl(imagePath, fallbackUrl) {
        if (!imagePath || imagePath.trim() === "" || imagePath === "null" || imagePath === "undefined") {
            return fallbackUrl;
        }
        if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
            return "/" + imagePath;
        }
        return imagePath;
    }

    /**
     * Retrieves all verified organizations from the server[cite: 2]
     */
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
                const profileImg = getValidImageUrl(org.profile_pic, "https://via.placeholder.com/64");

                container.innerHTML += `
                    <div class="org-card border rounded-xl p-4 relative cursor-pointer flex flex-col items-center text-center justify-between bg-white" data-id="${org.organization_id}">
                        <div class="checkmark absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg">✓</div>
                        <div class="w-full flex flex-col items-center pt-2">
                            <img src="${profileImg}" 
                                 onerror="this.onerror=null; this.src='https://via.placeholder.com/64';" 
                                 class="w-16 h-16 rounded-full object-cover mb-3" 
                                 alt="${org.organization_name}">
                            <h3 class="font-semibold text-gray-800 mb-2">${org.organization_name}</h3>
                        </div>
                        <div class="w-full pt-3 border-t border-gray-100 mt-2">
                            <p class="view-profile-btn text-xs text-blue-600 hover:text-blue-800 font-medium transition inline-flex items-center gap-1 cursor-pointer">
                                View Profile →
                            </p>
                        </div>
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
                updateDropoffInfo(selectedOrganization);
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

    function updateDropoffInfo(id) {
    const org = organizations.find(o => o.organization_id == id);
    if (!org) return;

    if (dropoffTitle) {
        dropoffTitle.textContent = org.dropoff_location_name || ""; 
    }

    if (dropoffAddress) {
        dropoffAddress.textContent = org.dropoff_address || "";
    }

    if (dropoffHours) {
        dropoffHours.textContent = org.dropoff_hours || "";
    }

    if (dropoffNotes) {
        dropoffNotes.textContent = org.dropoff_notes || "";
    }

    if (dropoffImg) {
        if (org.dropoff_image) {
            const dropoffImgUrl = getValidImageUrl(org.dropoff_image, "/assets/images/cspc.png");
            dropoffImg.src = dropoffImgUrl;
            dropoffImg.style.display = "block";
        } else {
            dropoffImg.src = ""; 
            dropoffImg.style.display = "none"; 
        }
    }
}

    /**
     * Opens the organization profile modal
     * and fetches its complete details and logo dynamically.
     */
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

    // Handle In-Kind Submission
if (submitBtn) {
    submitBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        if (!selectedOrganization) {
            showToast("Please select an organization to donate to.", "error");
            return;
        }

        const org = organizations.find(o => o.organization_id == selectedOrganization);
        if (!org || !org.dropoff_address || org.dropoff_address.trim() === "") {
            showToast("This organization hasn't provided drop-off location details yet. In-kind donation is temporarily unavailable.", "error");
            return;
        }

        const finalItemName = itemNameInput ? itemNameInput.value.trim() : "";
        const quantity = quantityInput ? quantityInput.value.trim() : "";

        const gibberishPattern = /(.)\1{3,}/;
        const validItemPattern = /^[a-zA-Z0-9\sñÑ-]{3,}$/;
        const hasVowel = /[aeiouAEIOU]/.test(finalItemName);

        if (!finalItemName || finalItemName.length < 3) {
            showToast("Please enter a valid item name (at least 3 characters).", "error");
            return;
        }
        if (/^[0-9]+$/.test(finalItemName)) {
            showToast("Item name cannot consist of numbers only.", "error");
            return;
        }
        if (!hasVowel || gibberishPattern.test(finalItemName) || !validItemPattern.test(finalItemName)) {
            showToast("Invalid item name detected. Please enter a proper item description (e.g., Dry Dog Food, Canned Goods).", "error");
            return;
        }

        const strictQuantityPattern = /^\d+(\s*[a-zA-Z]+)?$/;

        if (!quantity || !strictQuantityPattern.test(quantity)) {
            showToast("Please enter a valid quantity with a number (e.g., 5, 5kg, 3 packs).", "error");
            return;
        }

        if (termsCheckbox && !termsCheckbox.checked) {
            showToast("You must agree to the in-kind donation guidelines before submitting.", "error");
            return;
        }

        const payload = {
            organization_id: selectedOrganization,
            item_name: finalItemName,
            quantity: quantity
        };

        const originalBtnText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting...";

            const res = await fetch("/api/user/donation/in-kind", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                showToast(data.message || "Thank you! Your in-kind donation offer has been submitted.", "success");
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

    // Initialization
    await loadOrganizations();
    if (organizations.length > 0) {
        selectedOrganization = organizations[0].organization_id;
        updateDropoffInfo(selectedOrganization);

        const targetCard = document.querySelector(`.org-card[data-id="${selectedOrganization}"]`);
        if (targetCard) {
            targetCard.classList.add("selected");
        }
    }
});
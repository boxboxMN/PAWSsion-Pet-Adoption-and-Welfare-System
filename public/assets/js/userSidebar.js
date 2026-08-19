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

function loadTopbar({ title = "", subtitle = "" }) {
    const titleEl = document.getElementById("pageTitle");
    const subtitleEl = document.getElementById("pageSubtitle");

    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;
}

// ==========================================
// LOGOUT MODAL
// ==========================================
function createLogoutModal() {
    // Prevent duplicate modal
    if (document.getElementById("logoutModal")) return;

    const modal = document.createElement("div");
    modal.id = "logoutModal";
    modal.className = "fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-200";

    modal.innerHTML = `
        <div id="logoutModalContent" class="bg-white rounded-2xl max-w-sm w-full mx-4 p-6 shadow-2xl scale-95 transition-transform duration-200">
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
                    <i class="fa-solid fa-right-from-bracket text-red-600 text-lg"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">Logging Out?</h3>
                <p class="text-sm text-gray-500 mt-2">Are you sure you want to leave the Pawpon User Portal?</p>
            </div>
            <div class="mt-6 flex gap-3">
                <button id="cancelLogoutBtn" class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition text-sm">
                    Cancel
                </button>
                <button id="confirmLogoutBtn" class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition shadow-sm shadow-red-200 text-sm">
                    Yes, Logout
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// ==========================================
// OPEN LOGOUT MODAL
// ==========================================
function openLogoutModal() {
    const logoutModal = document.getElementById("logoutModal");
    const logoutModalContent = document.getElementById("logoutModalContent");

    if (!logoutModal || !logoutModalContent) {
        console.error("Logout modal not found.");
        return;
    }

    logoutModal.classList.remove("opacity-0", "pointer-events-none");
    logoutModal.classList.add("opacity-100");
    logoutModalContent.classList.remove("scale-95");
    logoutModalContent.classList.add("scale-100");
}

// ==========================================
// CLOSE LOGOUT MODAL
// ==========================================
function closeLogoutModal() {
    const logoutModal = document.getElementById("logoutModal");
    const logoutModalContent = document.getElementById("logoutModalContent");

    if (!logoutModal || !logoutModalContent) return;

    logoutModal.classList.remove("opacity-100");
    logoutModal.classList.add("opacity-0", "pointer-events-none");
    logoutModalContent.classList.remove("scale-100");
    logoutModalContent.classList.add("scale-95");
}

// ==========================================
// SETUP LOGOUT
// ==========================================
function setupLogout() {
    // Prevent duplicate event listener
    if (document.body.dataset.logoutInitialized === "true") return;
    document.body.dataset.logoutInitialized = "true";

    // Create Modal
    createLogoutModal();

    // Logout Link Event Delegation
    document.addEventListener("click", (event) => {
        const logoutLink = event.target.closest("#logoutLink");
        if (!logoutLink) return;

        event.preventDefault();
        openLogoutModal();
    });

    // Cancel Logout
    document.addEventListener("click", (event) => {
        if (event.target.closest("#cancelLogoutBtn")) {
            closeLogoutModal();
        }
    });

    // Click Outside Modal
    document.addEventListener("click", (event) => {
        const logoutModal = document.getElementById("logoutModal");
        if (logoutModal && event.target === logoutModal) {
            closeLogoutModal();
        }
    });

    // Confirm Logout
    document.addEventListener("click", async (event) => {
        const confirmLogoutBtn = event.target.closest("#confirmLogoutBtn");
        if (!confirmLogoutBtn) return;

        // Prevent multiple clicks
        if (confirmLogoutBtn.disabled) return;

        confirmLogoutBtn.disabled = true;
        confirmLogoutBtn.textContent = "Logging out...";

        try {
            console.log("Sending logout request...");

            const response = await fetch("/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            console.log("Logout response status:", response.status);
            const data = await response.json();
            console.log("Logout response:", data);

            if (response.ok && data.success) {
                console.log("Logout successful.");
                window.location.replace("/auth/login.html");
                return;
            }

            // Logout failed
            console.error("Logout failed:", data);
            confirmLogoutBtn.disabled = false;
            confirmLogoutBtn.textContent = "Yes, Logout";
            alert(data.message || "Logout failed. Please try again.");

        } catch (error) {
            console.error("Logout error:", error);
            confirmLogoutBtn.disabled = false;
            confirmLogoutBtn.textContent = "Yes, Logout";
            alert("Unable to logout. Please try again.");
        }
    });

    // Escape Key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const logoutModal = document.getElementById("logoutModal");
            if (logoutModal && !logoutModal.classList.contains("pointer-events-none")) {
                closeLogoutModal();
            }
        }
    });
}

// ==========================================
// LOAD SIDEBAR + HEADER
// ==========================================
async function loadSidebar(activePage = "") {
    await Promise.all([
        loadComponent("sidebar", "/user/userSidebar.html"),
        loadComponent("header", "/user/userHeader.html")
    ]);

    document.getElementById("sidebar").style.visibility = "visible";
    document.getElementById("header").style.visibility = "visible";

    // Active Sidebar Page
    const currentPath = window.location.pathname;

    document.querySelectorAll("#sidebar .nav-link").forEach(link => {
        const href = link.getAttribute("href");
        const active = href === currentPath || (href !== "/dashboard" && currentPath.startsWith(href));

        if (active) {
            link.className = "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl bg-blue-600 text-white shadow";
        } else {
            link.className = "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition";
        }
    });

    // Setup Shared Logout
    setupLogout();

    return true;
}
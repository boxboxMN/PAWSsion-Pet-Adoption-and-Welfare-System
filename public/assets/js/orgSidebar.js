function highlightActiveLink() {

    const currentPath = window.location.pathname;

    document.querySelectorAll(".nav-link").forEach(link => {

        const href = link.getAttribute("href");

        const isActive =
            href === currentPath ||
            (href !== "/org/dashboard" && currentPath.startsWith(href));

        if (isActive) {

            link.className =
                "nav-link flex items-center gap-4 h-11 px-3 rounded-xl bg-blue-600 text-white shadow font-medium group";

            const icon = link.querySelector("i");
            if (icon) {
                icon.className = icon.className.replace(
                    /text-gray-400|group-hover:text-blue-900/g,
                    ""
                );

                icon.classList.add("text-white");
            }

        } else {

            link.className =
                "nav-link flex items-center gap-4 h-11 px-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition font-medium group";

            const icon = link.querySelector("i");
            if (icon) {
                icon.classList.remove("text-white");
                icon.classList.add(
                    "text-gray-400",
                    "group-hover:text-blue-900",
                    "transition-colors"
                );
            }
        }
    });
}
async function loadSidebar(activePage = "") {

    const container = document.getElementById("sidebarContainer");

    if (!container) return;

    try {

        const response = await fetch("/organization/sidebar.html");

        if (!response.ok) {
            throw new Error("Failed to load sidebar.");
        }

        container.innerHTML = await response.text();

        highlightActiveLink();

        initializeSidebar();

        setupLogoutControl();

    } catch (error) {
        console.error("Error loading sidebar:", error);
    }
}

function initializeSidebar() {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    const collapseBtn = document.getElementById("collapseBtn");
    const collapseIcon = document.getElementById("collapseIcon");
    const mobileToggle = document.getElementById("mobileToggle");

    // Desktop Collapse
    if (collapseBtn && sidebar) {

        collapseBtn.addEventListener("click", function () {
            const appHeader = document.getElementById("appHeader");
            const mainContent = document.getElementById("mainContent");

            const isCollapsed =
                sidebar.getAttribute("data-collapsed") === "true";

            const newState = !isCollapsed;

            sidebar.setAttribute("data-collapsed", newState);

            if (appHeader) {
                if (newState) {
                    appHeader.classList.remove("md:left-[280px]");
                    appHeader.classList.add("md:left-20");
                } else {
                    appHeader.classList.remove("md:left-20");
                    appHeader.classList.add("md:left-[280px]");
                }
            }

            if (mainContent) {
                if (newState) {
                    mainContent.classList.remove("md:ml-[280px]");
                    mainContent.classList.add("md:ml-20");
                } else {
                    mainContent.classList.remove("md:ml-20");
                    mainContent.classList.add("md:ml-[280px]");
                }
            }

            document.querySelectorAll(".sidebar-text").forEach(el => {
                el.style.display = newState ? "none" : "";
            });

            const logoContainer = document.getElementById("logoContainer");

            if (logoContainer) {
                logoContainer.style.justifyContent =
                    newState ? "center" : "between";
            }

            if (collapseIcon) {
                collapseIcon.style.transform =
                    newState ? "rotate(180deg)" : "rotate(0deg)";
            }

        });

    }

    // Mobile Drawer
    function toggleMobileMenu() {

        if (!sidebar) return;

        const isOpen =
            sidebar.getAttribute("data-mobile-open") === "true";

        const newState = !isOpen;

        sidebar.setAttribute("data-mobile-open", newState);

        if (overlay) {
            overlay.setAttribute("data-mobile-open", newState);
        }

        document.body.style.overflow =
            newState ? "hidden" : "";
    }

    if (mobileToggle) {
        mobileToggle.addEventListener("click", toggleMobileMenu);
    }

    if (overlay) {
        overlay.addEventListener("click", toggleMobileMenu);
    }

    document.addEventListener("keydown", function (e) {

        if (
            e.key === "Escape" &&
            sidebar &&
            sidebar.getAttribute("data-mobile-open") === "true"
        ) {
            toggleMobileMenu();
        }

    });

}

// NEW FUNCTION AT THE BOTTOM OF ORGSIDEBAR.JS:
function setupLogoutControl() {
    const logoutModal = document.getElementById("logoutModal");
    const openLogoutBtn = document.getElementById("logoutLink"); // Siguraduhing id="logoutLink" ang nasa HTML mo
    const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

    // Check muna kung umiiral sila sa na-load na HTML bago lagyan ng listeners
    if (openLogoutBtn && logoutModal) {
        
        // 1. Buksan ang Modal
        openLogoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logoutModal.classList.remove("pointer-events-none", "opacity-0");
            logoutModal.querySelector('div').classList.remove("scale-95");
        });

        // 2. Isara ang Modal (Cancel)
        if (cancelLogoutBtn) {
            cancelLogoutBtn.addEventListener("click", () => {
                logoutModal.classList.add("pointer-events-none", "opacity-0");
                logoutModal.querySelector('div').classList.add("scale-95");
            });
        }

        // 3. Ituloy ang Logout (Confirm)
        if (confirmLogoutBtn) {
            confirmLogoutBtn.addEventListener("click", () => {
                window.location.href = "/auth/login.html";
            });
        }
    }
}

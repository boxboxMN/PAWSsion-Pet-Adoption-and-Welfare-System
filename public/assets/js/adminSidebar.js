async function loadSidebar(activePage) {
    const container = document.getElementById("sidebar");
    if (!container) return;

    try {
        const response = await fetch("sidebar.html");
        container.innerHTML = await response.text();

        const toggle = document.getElementById("orgDropdownToggle");
        const submenu = document.getElementById("orgSubmenu");
        const arrow = document.getElementById("orgArrow");

        const isOrgPage = ["organization", "partner-request"].includes(activePage);

        // Auto open kapag nasa Organization pages
        if (isOrgPage && submenu && arrow) {
            submenu.classList.remove("hidden");
            arrow.classList.add("rotate-180", "text-sky-400");
            toggle?.classList.add("text-slate-100", "bg-slate-800/50");
        }

        // Toggle click logic
        if (toggle && submenu && arrow) {
            toggle.addEventListener("click", (e) => {
                e.preventDefault();
                submenu.classList.toggle("hidden");
                arrow.classList.toggle("rotate-180");
                arrow.classList.toggle("text-sky-400");
            });
        }

        // Active Link Highlighting
        document.querySelectorAll(".sidebar-link").forEach(link => {
            if (link.dataset.page === activePage) {
                if (link.classList.contains("text-xs")) {
                    // Submenu item active state (Left border line + Soft sky glow)
                    link.classList.remove("text-slate-400");
                    link.classList.add("text-sky-400", "font-semibold", "bg-sky-500/10", "border-l-2", "border-sky-400", "-ml-[17px]", "pl-[15px]");
                } else {
                    // Main menu item active state (Vibrant Gradient + Soft Shadow)
                    link.classList.remove("text-slate-400");
                    link.classList.add("bg-gradient-to-r", "from-blue-600", "to-sky-600", "text-white", "font-semibold", "shadow-lg", "shadow-sky-500/20");
                    
                    const icon = link.querySelector("i");
                    if (icon) {
                        icon.classList.remove("text-slate-500");
                        icon.classList.add("text-white");
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error loading sidebar:", error);
    }
}
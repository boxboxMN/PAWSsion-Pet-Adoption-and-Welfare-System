function highlightActiveLink() {

    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);

    document.querySelectorAll(".nav-link").forEach(link => {

        console.log("Checking:", link.getAttribute("href"));

        link.classList.remove(
            "bg-blue-600",
            "text-white",
            "font-semibold"
        );

        if (link.getAttribute("href") === currentPath) {

            console.log("MATCH:", link.getAttribute("href"));

            link.classList.add(
                "bg-blue-600",
                "text-white",
                "font-semibold"
            );
        }
    });
}
document.addEventListener('DOMContentLoaded', async function() {
        
        // --- STEP A: FETCH AND INJECT THE SIDEBAR AND HEADER ---
        // taking the sidebar to put the loader
        try {
            const [headerResponse, sidebarResponse] = await Promise.all([
                fetch('/organization/header.html'), 
                fetch('/organization/sidebar.html')  
            ]);

            if (headerResponse.ok) {
                document.getElementById('headerContainer').innerHTML = await headerResponse.text();
            } else {
                console.error('Failed to load header:', headerResponse.statusText);
            }

            if (sidebarResponse.ok) {
                document.getElementById('sidebarContainer').innerHTML = await sidebarResponse.text();
                
                // 🔥 ETO ANG DAGDAG: Patakbuhin ang pag-highlight pagkatapos mai-inject ang sidebar HTML
                highlightActiveLink();
            } else {
                console.error('Failed to load sidebar:', sidebarResponse.statusText);
            }
        } catch (error) {
            console.error("Critical error loading components:", error);
        }


        // --- STEP B: INITIALIZE YOUR INTERACTION LOGIC ---
        const sidebar = document.getElementById('sidebar');
        const appHeader = document.getElementById('appHeader');
        const mainContent = document.getElementById('mainContent');
        const overlay = document.getElementById('sidebarOverlay');
        
        const collapseBtn = document.getElementById('collapseBtn');
        const collapseIcon = document.getElementById('collapseIcon');
        const mobileToggle = document.getElementById('mobileToggle');
        const notifBtn = document.getElementById('notificationBtn');
        const notifPopup = document.getElementById('notificationPopup');
        const markReadBtn = document.getElementById('markReadBtn');
        // 1. DESKTOP SIDEBAR COLLAPSE
        if (collapseBtn && sidebar) {
            collapseBtn.addEventListener('click', function() {
                const isCollapsed = sidebar.getAttribute('data-collapsed') === 'true';
                const newState = !isCollapsed;
                
                sidebar.setAttribute('data-collapsed', newState);
                if (appHeader) appHeader.setAttribute('data-sidebar-collapsed', newState);
                if (mainContent) mainContent.setAttribute('data-sidebar-collapsed', newState);
                
                document.querySelectorAll('.sidebar-text').forEach(el => {
                    el.style.display = newState ? 'none' : '';
                });
                const container = document.getElementById('logoContainer');
                if (container) container.style.justifyContent = newState ? 'center' : 'between';

                if (collapseIcon) {
                    collapseIcon.style.transform = newState ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        }

        // 2. MOBILE DRAWER TOGGLE
        function toggleMobileMenu() {
            if (!sidebar) return;
            const isOpen = sidebar.getAttribute('data-mobile-open') === 'true';
            const newState = !isOpen;

            sidebar.setAttribute('data-mobile-open', newState);
            if (overlay) overlay.setAttribute('data-mobile-open', newState);
            document.body.style.overflow = newState ? 'hidden' : '';
        }

        if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
        if (overlay) overlay.addEventListener('click', toggleMobileMenu);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar && sidebar.getAttribute('data-mobile-open') === 'true') {
                toggleMobileMenu();
            }
        });

        // 3. NOTIFICATION POPUP PANEL
        if (notifBtn && notifPopup) {
            notifBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isOpen = notifPopup.getAttribute('data-open') === 'true';
                notifPopup.setAttribute('data-open', !isOpen);
            });

            document.addEventListener('click', function(e) {
                if (!notifBtn.contains(e.target) && !notifPopup.contains(e.target)) {
                    notifPopup.setAttribute('data-open', 'false');
                }
            });
        }

        // Clear Notifications Action
        if (markReadBtn && notifList) {
            markReadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const dot = document.querySelector('.notif-dot');
                if (dot) dot.style.display = 'none';
                notifList.innerHTML = `
                    <div class="text-center py-8 text-gray-400 text-sm">
                        <i class="fa-regular fa-bell-slash text-xl block mb-1.5"></i>
                        No new notifications
                    </div>
                `;
                setTimeout(() => {
                    if (notifPopup) notifPopup.setAttribute('data-open', 'false');
                }, 400);
            });
        }
    });

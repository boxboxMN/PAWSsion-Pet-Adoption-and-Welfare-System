async function loadTopbar(options = {}) {
    const container = document.getElementById("topbar");
    if (!container) return;

    // Load the HTML
    const response = await fetch("./topbar.html");
    container.innerHTML = await response.text();

    // Set page title & subtitle
    document.getElementById("topbarTitle").textContent =
        options.title || "Dashboard";

    document.getElementById("topbarSubtitle").textContent =
        options.subtitle || "";

    // Notification dropdown
    const bell = document.getElementById("notificationBellBtn");
    const dropdown = document.getElementById("notificationDropdown");

    if (!bell || !dropdown) return;

    // Open / Close
    bell.addEventListener("click", function (e) {
        e.stopPropagation();
        const isHidden = dropdown.classList.contains("hidden");
        dropdown.classList.toggle("hidden");
        if (isHidden) loadAdminNotifications();
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
        if (
            !dropdown.contains(e.target) &&
            !bell.contains(e.target)
        ) {
            dropdown.classList.add("hidden");
        }
    });
    const markAllBtn = document.getElementById("adminMarkAllReadBtn");
    if (markAllBtn) {
        markAllBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            await fetch("/api/notifications/read-all", { method: "PUT" });
            await loadAdminNotifications();
        });
    }

    loadAdminNotifications();
    if (!window.__adminNotifPolling) {
        window.__adminNotifPolling = true;
        setInterval(loadAdminNotifications, 30000);
    }
}

function adminNotifIcon(type) {
    const icons = {
        org_pending: "fa-building",
        feedback_new: "fa-comment-dots"
    };
    return icons[type] || "fa-bell";
}

async function loadAdminNotifications() {
    const list = document.getElementById("adminNotifList");
    const pulseWrapper = document.querySelector("#notificationBellBtn .absolute");
    if (!list) return;

    try {
        const res = await fetch("/api/notifications");
        const data = await res.json();

        if (pulseWrapper) {
            pulseWrapper.style.display = data.unreadCount > 0 ? "" : "none";
        }

        if (!data.success || !data.notifications || data.notifications.length === 0) {
            list.innerHTML = '<p class="px-5 py-6 text-center text-xs text-slate-400">No notifications yet.</p>';
            return;
        }

        list.innerHTML = data.notifications.map(n => {
            const timeAgo = new Date(n.created_at).toLocaleString("en-US", {
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
            });
            return `
                <div data-id="${n.notification_id}" data-link="${n.link || ''}" class="admin-notif-item px-5 py-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors duration-150 group ${n.is_read ? 'opacity-50' : ''}">
                    <div class="flex items-start gap-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-xs">
                            <i class="fa-solid ${adminNotifIcon(n.type)} text-xs"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">${n.title}</p>
                            <p class="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">${n.message}</p>
                            <p class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
                                <i class="fa-regular fa-clock text-[10px]"></i> ${timeAgo}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        list.querySelectorAll(".admin-notif-item").forEach(item => {
            item.addEventListener("click", async () => {
                await fetch(`/api/notifications/${item.dataset.id}/read`, { method: "PUT" });
                if (item.dataset.link) window.location.href = item.dataset.link;
            });
        });

    } catch (err) {
        console.error("Failed to load notifications:", err);
    }
}
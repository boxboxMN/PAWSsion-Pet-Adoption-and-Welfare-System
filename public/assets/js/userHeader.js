async function loadTopbar(options = {}) {
    const headerContainer = document.getElementById("header");
    if (!headerContainer) return;

    // 1. I-load ang userHeader.html
    const response = await fetch("/header"); // o kung ano ang route ng userHeader.html
    const html = await response.text();
    headerContainer.innerHTML = html;

    // 2. I-set ang Title at Subtitle kung mayroon
    if (options.title) {
        const titleEl = document.getElementById("pageTitle");
        if (titleEl) titleEl.textContent = options.title;
    }
    if (options.subtitle) {
        const subEl = document.getElementById("pageSubtitle");
        if (subEl) subEl.textContent = options.subtitle;
    }

    // 3. I-LOAD ANG PROFILE PICTURE MULA SA API
    try {
        const userRes = await fetch("/api/current-user");
        const userData = await userRes.json();
        
        const avatarContainer = document.getElementById("topbarAvatarContainer");
        if (avatarContainer && userData.profile_picture) {
            avatarContainer.innerHTML = `
                <img src="${userData.profile_picture}" 
                     alt="Profile" 
                     class="w-full h-full object-cover rounded-full" 
                     onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fas fa-user-circle text-2xl text-gray-500\\'></i>';" />
            `;
        }
    } catch (err) {
        console.error("Error setting topbar avatar:", err);
    }

     // 4. NOTIFICATIONS
     initUserNotifications();
}

function userNotifIcon(type) {
    const icons = {
        application_status: "📋",
        interview_scheduled: "📅",
        interview_rescheduled: "📅",
        donation_status: "💰",
        kamustahan_due: "🐾"
    };
    return icons[type] || "🔔";
}

async function loadUserNotifications() {
    const list = document.getElementById("userNotifList");
    const dot = document.querySelector("#notificationBtn .bg-red-500");
    if (!list) return;

    try {
        const res = await fetch("/api/notifications");
        const data = await res.json();

        if (dot) {
            dot.style.display = data.unreadCount > 0 ? "" : "none";
        }

        if (!data.success || !data.notifications || data.notifications.length === 0) {
            list.innerHTML = '<li class="text-gray-400 text-xs text-center py-4">No notifications yet.</li>';
            return;
        }

        // Mga notification type na pang-impormasyon lang, hindi dapat i-click/i-navigate
        const NON_CLICKABLE_TYPES = ["feedback_resolved", "feedback_reopened"];

        list.innerHTML = data.notifications.map(n => {
            const isInfoOnly = NON_CLICKABLE_TYPES.includes(n.type);
            const clickableClass = isInfoOnly ? "" : "cursor-pointer";
            return `
            <li data-id="${n.notification_id}" data-link="${n.link || ''}" data-info-only="${isInfoOnly}" class="user-notif-item flex items-start justify-between gap-2 border-b pb-2 ${n.is_read ? 'opacity-50' : ''}">
                <div class="user-notif-content flex-1 min-w-0 ${clickableClass}">
                    ${userNotifIcon(n.type)} <span class="font-medium">${n.title}</span><br>
                    <span class="text-xs text-gray-500">${n.message}</span>
                </div>
                <button class="user-notif-delete-btn text-gray-300 hover:text-red-500 transition shrink-0 px-1" title="Delete">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </li>
        `}).join("");

        list.querySelectorAll(".user-notif-item").forEach(item => {
            if (item.dataset.infoOnly !== "true") {
                item.querySelector(".user-notif-content").addEventListener("click", async () => {
                    await fetch(`/api/notifications/${item.dataset.id}/read`, { method: "PUT" });
                    if (item.dataset.link) window.location.href = item.dataset.link;
                });
            }
        });

        list.querySelectorAll(".user-notif-delete-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const row = btn.closest(".user-notif-item");
                const id = row.dataset.id;
                try {
                    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
                    row.remove();
                    if (!list.querySelector(".user-notif-item")) {
                        loadUserNotifications();
                    }
                } catch (err) {
                    console.error("Failed to delete notification:", err);
                }
            });
        });

    } catch (err) {
        console.error("Failed to load notifications:", err);
    }
}

function initUserNotifications() {
    const btn = document.getElementById("notificationBtn");
    const popup = document.getElementById("notificationPopup");
    const markAllBtn = document.getElementById("userMarkAllReadBtn");

    if (btn && popup) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = popup.classList.contains("hidden");
            popup.classList.toggle("hidden");
            if (isHidden) loadUserNotifications();
        });

        document.addEventListener("click", (e) => {
            if (!btn.contains(e.target) && !popup.contains(e.target)) {
                popup.classList.add("hidden");
            }
        });
    }

    if (markAllBtn) {
        markAllBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            await fetch("/api/notifications/read-all", { method: "PUT" });
            await loadUserNotifications();
        });
    }

    loadUserNotifications();
    if (!window.__userNotifPolling) {
        window.__userNotifPolling = true;
        setInterval(loadUserNotifications, 30000);
    }
}
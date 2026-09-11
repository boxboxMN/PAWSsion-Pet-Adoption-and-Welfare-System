async function loadTopbar({ title = "", subtitle = "" }) {

    console.log("Subtitle received:", subtitle);

    const container = document.getElementById("headerContainer");

    const response = await fetch("/organization/header.html");
    container.innerHTML = await response.text();

    const titleEl = document.getElementById("pageTitle");
    const subtitleEl = document.getElementById("pageSubtitle");

    console.log(titleEl);
    console.log(subtitleEl);

    if (titleEl) {
        titleEl.textContent = title;
    }

    if (subtitleEl) {
        subtitleEl.textContent = subtitle;
    }

    console.log("Subtitle after setting:", subtitleEl.textContent);

    // IDAGDAG ITO: Tawagin ang function para i-sync ang profile pic mula sa server session
    await updateTopbarProfilePic();
    
    initializeTopbar();
}

function initializeTopbar() {

    const notifBtn = document.getElementById("notificationBtn");
    const notifPopup = document.getElementById("notificationPopup");
    const markReadBtn = document.getElementById("markReadBtn");
    const notifList = document.getElementById("notifList");

    if (notifBtn && notifPopup) {
        notifBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            const isOpen =
                notifPopup.getAttribute("data-open") === "true";

            notifPopup.setAttribute("data-open", !isOpen);

            if (!isOpen) {
                loadNotifications();
            }
        });

        document.addEventListener("click", (e) => {
            if (
                !notifBtn.contains(e.target) &&
                !notifPopup.contains(e.target)
            ) {
                notifPopup.setAttribute("data-open", "false");
            }
        });
    }

    if (markReadBtn) {
        markReadBtn.addEventListener("click", async (e) => {
            e.stopPropagation();

            try {
                await fetch("/api/notifications/read-all", { method: "PUT" });
                await loadNotifications();
            } catch (err) {
                console.error("Failed to mark all as read:", err);
            }
        });
    }

    loadNotifications();
    setInterval(loadNotifications, 30000);
}

function renderNotifIcon(type) {
    const icons = {
        application_submitted: "🐾",
        donation_submitted: "💰",
        feedback_resolved: "💬",
        feedback_reopened: "💬",
        kamustahan_submitted: "🐶",
        application_status: "📋",
        interview_scheduled: "📅",
        donation_status: "💵",
        org_pending: "🏢",
        feedback_new: "💬",
        account_suspended: "🚫",
        account_banned: "⛔",
        account_disabled: "🔒",
    };
    return icons[type] || "🔔";
}

// Mga notification type na pang-impormasyon lang, hindi dapat i-click/i-navigate
const NON_CLICKABLE_NOTIF_TYPES = ["feedback_resolved", "feedback_reopened"];

async function loadNotifications() {
    const notifList = document.getElementById("notifList");
    const dot = document.querySelector(".notif-dot");
    if (!notifList) return;

    try {
        const res = await fetch("/api/notifications");
        const data = await res.json();

        if (dot) {
            dot.style.display = data.unreadCount > 0 ? "" : "none";
        }

        if (!data.success || !data.notifications || data.notifications.length === 0) {
            notifList.innerHTML = `
                <div class="text-center py-8 text-gray-400 text-sm">
                    <i class="fa-regular fa-bell-slash text-xl block mb-1.5"></i>
                    No new notifications
                </div>
            `;
            return;
        }

        notifList.innerHTML = data.notifications.map(n => {
            const isInfoOnly = NON_CLICKABLE_NOTIF_TYPES.includes(n.type);
            const interactiveClass = isInfoOnly ? "" : "hover:bg-gray-50/80 cursor-pointer";

            return `
                <div data-id="${n.notification_id}" data-info-only="${isInfoOnly}" data-link="${n.link || ''}" class="notif-item flex gap-3.5 p-4 border-b border-gray-50 transition-colors items-start ${n.is_read ? 'opacity-60' : ''}">
                    <div class="notif-content flex gap-3.5 flex-1 min-w-0 ${interactiveClass}">
                        <span class="text-xl flex-shrink-0">${renderNotifIcon(n.type)}</span>
                        <div class="min-w-0">
                            <p class="font-medium text-gray-900 text-sm">${n.title}</p>
                            <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">${n.message}</p>
                        </div>
                    </div>
                    <button class="notif-delete-btn text-gray-300 hover:text-red-500 transition shrink-0 p-1" title="Delete">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
        }).join("");

        notifList.querySelectorAll(".notif-item").forEach(item => {
            if (item.dataset.infoOnly !== "true") {
                item.querySelector(".notif-content").addEventListener("click", async () => {
                    await fetch(`/api/notifications/${item.dataset.id}/read`, { method: "PUT" });
                    if (item.dataset.link) window.location.href = item.dataset.link;
                });
            }
        });

        notifList.querySelectorAll(".notif-delete-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const row = btn.closest(".notif-item");
                const id = row.dataset.id;
                try {
                    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
                    row.remove();
                    if (!notifList.querySelector(".notif-item")) {
                        loadNotifications();
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

async function updateTopbarProfilePic() {
    const imgTag = document.getElementById('headerProfilePic');
    const iconTag = document.getElementById('headerProfileIcon');

    if (!imgTag || !iconTag) return;

    try {
        const response = await fetch("/api/organization/profile");
        if (response.ok) {
            const data = await response.json();
            if (data && data.profile_pic) {
                imgTag.src = data.profile_pic;
                imgTag.classList.remove('hidden'); // Ipakita ang larawan
                iconTag.classList.add('hidden');    // Itago ang default icon
            } else {
                imgTag.classList.add('hidden');
                iconTag.classList.remove('hidden'); // Ipakita ang default icon kung walang photo
            }
        }
    } catch (err) {
        console.error("Error loading topbar profile picture:", err);
    }
}
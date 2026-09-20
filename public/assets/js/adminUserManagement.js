document.addEventListener("DOMContentLoaded", () => {
    loadSidebar("user-management");

    loadTopbar({
        title: "User Management",
        subtitle: "Manage all users across the platform. View, assign roles, and manage account status."
    });

    loadUsers();

    // Search filter
    document.getElementById("searchInput").addEventListener("input", function() {
        filterUsers(this.value.trim().toLowerCase());
    });

    // Role filter
    document.getElementById("roleFilter").addEventListener("change", function() {
        currentRoleFilter = this.value;
        const currentQuery = document.getElementById("searchInput").value.trim().toLowerCase();
        filterUsers(currentQuery);
    });

    // Panel close
    document.getElementById("panelClose").addEventListener("click", closePanel);
    document.getElementById("panelOverlay").addEventListener("click", closePanel);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePanel();
    });
});

// ─── Data ──────────────────────────────────────────────
let allUsers = [];
let currentRoleFilter = "all";
let selectedUserId = null;

// ─── Load users ────────────────────────────────────────
async function loadUsers() {
    try {
        const res = await fetch("/admin/users");
        allUsers = await res.json();

        if (!allUsers || allUsers.length === 0) {
            document.getElementById("userRowsContainer").innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No users found</p>
                </div>
            `;
            document.getElementById("userCount").textContent = "0 Active Users";
            return;
        }

        renderUsers(allUsers);

    } catch (err) {
        console.error("Failed to load users:", err);
        document.getElementById("userRowsContainer").innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle" style="color:#f59e0b;"></i>
                <p>Unable to load users. Please try again.</p>
            </div>
        `;
    }
}

// ─── Render ────────────────────────────────────────────
function renderUsers(users) {
    const container = document.getElementById("userRowsContainer");
    container.innerHTML = "";

    if (!users || users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No users match your search</p>
            </div>
        `;
        document.getElementById("userCount").textContent = "0 Active Users";
        return;
    }

    users.forEach((user, index) => {
        const card = buildUserCard(user, index);
        container.appendChild(card);
    });

    const activeCount = users.filter(u => (u.status || "active").toLowerCase() === "active").length;
    document.getElementById("userCount").textContent = `${activeCount} Active User${activeCount > 1 ? 's' : ''}`;
}

// ─── Build card ────────────────────────────────────────
function buildUserCard(user, index) {
    const userId = user.account_id || user.id || `user-${index}`;
    const name = user.name || "Unknown";
    const role = user.role || "User";
    const phone = user.phone || "—";
    const email = user.email || "—";

    const status = (user.status || "active").toLowerCase();
    let statusClass = "active";
    let statusLabel = "Active";

    if (status === "suspended") {
        statusClass = "suspended";
        statusLabel = "Suspended";
    } else if (status === "banned") {
        statusClass = "status-banned";
        statusLabel = "Banned";
    } else if (status === "disabled" || status === "inactive") {
        statusClass = "inactive";
        statusLabel = "Inactive";
    }

    let timeStr = "Today 10:30 A.M";
    if (user.created_at) {
        const d = new Date(user.created_at);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        const hours = d.getHours();
        const mins = String(d.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "P.M" : "A.M";
        const hour12 = hours % 12 || 12;
        const dateStr = isToday ? "Today" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        timeStr = `${dateStr} ${hour12}:${mins} ${ampm}`;
    }

    const avatarUrl = user.profile_picture || user.profile || "";

    const card = document.createElement("div");
    card.className = `user-card fadeIn ${selectedUserId === userId ? 'selected' : ''}`;
    card.style.animationDelay = `${index * 30}ms`;
    card.dataset.userId = userId;

    card.innerHTML = `
        <div class="flex gap-3 items-start">
            ${avatarUrl ? `
                <img src="${avatarUrl}" alt="${name}" class="avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div class="avatar-placeholder" style="display: none; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                    ${name.charAt(0).toUpperCase()}
                </div>
            ` : `
                <div class="avatar-placeholder" style="display: flex; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                    ${name.charAt(0).toUpperCase()}
                </div>
            `}
            <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-slate-800 text-sm leading-tight truncate">${name}</h3>
                <p class="text-blue-600 text-xs capitalize font-medium">${role}</p>
                <p class="text-xs text-slate-400 mt-0.5">${timeStr}</p>
            </div>
        </div>

        <div class="mt-3 space-y-1.5 text-xs">
            <p class="text-slate-600 flex items-center gap-1.5 truncate">
                <i class="fa-solid fa-phone text-slate-400 w-3.5 text-[10px]"></i>
                ${phone}
            </p>
            <p class="text-slate-600 flex items-center gap-1.5 truncate">
                <i class="fa-regular fa-envelope text-slate-400 w-3.5 text-[10px]"></i>
                ${email}
            </p>
            <span class="status-badge ${statusClass} mt-1">
                <span class="dot"></span>
                ${statusLabel}
            </span>
        </div>
    `;

    card.addEventListener("click", () => {
        selectUser(userId);
    });

    return card;
}

// ─── Select ────────────────────────────────────────────
function selectUser(userId) {
    selectedUserId = userId;
    const user = allUsers.find(u => (u.account_id || u.id) === userId);
    if (user) openPanel(user);
    const currentQuery = document.getElementById("searchInput").value.trim().toLowerCase();
    const filtered = getFilteredUsers(currentQuery);
    renderUsers(filtered);
}

function getFilteredUsers(query) {
    let result = allUsers;

    if (currentRoleFilter !== "all") {
        result = result.filter(user => (user.role || "").toLowerCase() === currentRoleFilter);
    }

    if (!query) return result;

    return result.filter(user => {
        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const phone = (user.phone || "").toLowerCase();
        const role = (user.role || "").toLowerCase();
        return name.includes(query) ||
            email.includes(query) ||
            phone.includes(query) ||
            role.includes(query);
    });
}

// ─── Panel ─────────────────────────────────────────────
function openPanel(user) {
    const panel = document.getElementById("detailPanel");
    const overlay = document.getElementById("panelOverlay");
    const body = document.getElementById("panelBody");

    const name = user.name || "Unknown";
    const initial = name.charAt(0).toUpperCase();
    const role = user.role || "User";
    const phone = user.phone || "—";
    const email = user.email || "—";

    const status = (user.status || "active").toLowerCase();
    const isActive = status === "active";
    const isSuspended = status === "suspended";
    const isBanned = status === "banned";

    let statusLabel = "Active";
    let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    let statusDot = "bg-emerald-500";

    if (status === "suspended") {
        statusColor = "bg-amber-50 text-amber-700 border-amber-200";
        statusDot = "bg-amber-500";
        statusLabel = "Suspended";
    } else if (status === "banned") {
        statusColor = "bg-red-50 text-red-700 border-red-200";
        statusDot = "bg-red-500";
        statusLabel = "Banned";
    } else if (status === "disabled" || status === "inactive") {
        statusColor = "bg-slate-100 text-slate-600 border-slate-200";
        statusDot = "bg-slate-400";
        statusLabel = "Inactive";
    }

    const registered = user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    }) : "—";

    const lastLogin = user.last_login ? new Date(user.last_login).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true
    }) : "—";

    const avatarUrl = user.profile_picture || user.profile || "";
    const uid = user.account_id || user.id;

    body.innerHTML = `
        <!-- Compact Profile Header -->
        <div class="flex items-start gap-3">
            ${avatarUrl ? `
                <img src="${avatarUrl}" alt="${name}"
                     class="w-14 h-14 rounded-full object-cover border border-slate-200 flex-shrink-0"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div class="w-14 h-14 rounded-full items-center justify-center text-white font-bold text-lg flex-shrink-0"
                     style="display:none; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                    ${initial}
                </div>
            ` : `
                <div class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                     style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                    ${initial}
                </div>
            `}
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                    <h2 class="font-semibold text-slate-800 text-sm truncate">${name}</h2>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor}">
                        <span class="w-1.5 h-1.5 rounded-full ${statusDot}"></span>
                        ${statusLabel}
                    </span>
                </div>
                <p class="text-xs text-indigo-600 font-medium capitalize leading-tight">${role}</p>
                <p class="text-xs text-slate-400 truncate leading-tight">${email}</p>
            </div>
        </div>

        <!-- Compact Info List -->
        <div class="mt-4 divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div class="flex items-center justify-between px-3 py-2 text-xs">
                <span class="text-slate-500 flex items-center gap-2">
                    <i class="fa-solid fa-phone text-slate-400 w-3.5 text-[10px]"></i>Phone
                </span>
                <span class="font-medium text-slate-700">${phone}</span>
            </div>
            <div class="flex items-center justify-between px-3 py-2 text-xs">
                <span class="text-slate-500 flex items-center gap-2">
                    <i class="fa-regular fa-calendar text-slate-400 w-3.5 text-[10px]"></i>Registered
                </span>
                <span class="font-medium text-slate-700">${registered}</span>
            </div>
            <div class="flex items-center justify-between px-3 py-2 text-xs">
                <span class="text-slate-500 flex items-center gap-2">
                    <i class="fa-regular fa-clock text-slate-400 w-3.5 text-[10px]"></i>Last Login
                </span>
                <span class="font-medium text-slate-700 text-right">${lastLogin}</span>
            </div>
        </div>

        <!-- Compact Actions -->
        <div class="mt-5">
            <h3 class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Account Actions</h3>
            <div class="space-y-2">
                <button data-action="toggle" data-id="${uid}"
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60 text-slate-700 text-xs font-semibold transition text-left">
                    <i class="fa-solid fa-arrows-rotate text-indigo-500 w-4 text-center"></i>
                    ${isActive ? 'Deactivate Account' : 'Activate Account'}
                </button>

                <button data-action="${isSuspended ? 'unsuspend' : 'suspend'}" data-id="${uid}"
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/60 text-slate-700 text-xs font-semibold transition text-left">
                    <i class="fa-solid ${isSuspended ? 'fa-user-check text-emerald-500' : 'fa-user-slash text-amber-500'} w-4 text-center"></i>
                    ${isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                </button>

                <button data-action="${isBanned ? 'unban' : 'ban'}" data-id="${uid}"
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50/60 text-red-600 text-xs font-semibold transition text-left">
                    <i class="fa-solid ${isBanned ? 'fa-user-check' : 'fa-ban'} w-4 text-center"></i>
                    ${isBanned ? 'Lift Ban' : 'Permanent Ban'}
                </button>
            </div>
        </div>
    `;

    body.querySelectorAll("[data-action]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            handleAction(btn.dataset.action, btn.dataset.id, user);
        });
    });

    panel.classList.remove("translate-x-full");
    overlay.classList.remove("opacity-0", "pointer-events-none");
    document.body.style.overflow = "hidden";
}

function closePanel() {
    document.getElementById("detailPanel").classList.add("translate-x-full");
    document.getElementById("panelOverlay").classList.add("opacity-0", "pointer-events-none");
    document.body.style.overflow = "";
    selectedUserId = null;
    const currentQuery = document.getElementById("searchInput").value.trim().toLowerCase();
    const filtered = getFilteredUsers(currentQuery);
    renderUsers(filtered);
}

// ─── Filter ────────────────────────────────────────────
function filterUsers(query) {
    const filtered = getFilteredUsers(query);
    renderUsers(filtered);
    if (selectedUserId) {
        const stillVisible = filtered.some(u => (u.account_id || u.id) === selectedUserId);
        if (!stillVisible) closePanel();
    }
}

// ─── Toast ─────────────────────────────────────────────
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) {
        alert(message);
        return;
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon = type === "success"
        ? '<i class="fa-solid fa-circle-check"></i>'
        : '<i class="fa-solid fa-circle-exclamation"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ─── Confirm Modal ─────────────────────────────────────
function showConfirmModal(title, description, confirmButtonText = "Confirm", isDanger = false) {
    return new Promise((resolve) => {
        const modal = document.getElementById("customConfirmModal");
        const titleEl = document.getElementById("modalTitle");
        const descEl = document.getElementById("modalDesc");
        const confirmBtn = document.getElementById("modalConfirmBtn");
        const cancelBtn = document.getElementById("modalCancelBtn");
        const iconContainer = document.getElementById("modalIconContainer");

        titleEl.textContent = title;
        descEl.textContent = description;
        confirmBtn.textContent = confirmButtonText;

        if (isDanger) {
            confirmBtn.className = "px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm";
            iconContainer.className = "w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600";
            iconContainer.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-lg"></i>';
        } else {
            confirmBtn.className = "px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm";
            iconContainer.className = "w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 text-amber-600";
            iconContainer.innerHTML = '<i class="fa-solid fa-circle-question text-lg"></i>';
        }

        modal.classList.remove("hidden");

        const newConfirmBtn = confirmBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        newConfirmBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
            resolve(true);
        });

        newCancelBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
            resolve(false);
        });
    });
}

// ─── Actions ───────────────────────────────────────────
async function handleAction(action, id, user) {
    try {
        let url = "";
        let options = { method: "PUT" };
        let actionTitle = "";
        let actionDesc = "";
        let isDanger = false;

        switch (action) {
            case "toggle":
                url = `/admin/users/${id}/status`;
                const newStatus = (user.status || "active").toLowerCase() === "active" ? "disabled" : "active";
                options.headers = { "Content-Type": "application/json" };
                options.body = JSON.stringify({ status: newStatus });
                actionTitle = "Toggle Account Status";
                actionDesc = `Are you sure you want to change this account's status to ${newStatus}?`;
                break;
            case "suspend":
                url = `/admin/users/${id}/suspend`;
                actionTitle = "Suspend Account";
                actionDesc = "Are you sure you want to suspend this user? They will temporarily lose access.";
                isDanger = true;
                break;
            case "ban":
                url = `/admin/users/${id}/ban`;
                actionTitle = "Permanent Ban";
                actionDesc = "Are you sure you want to permanently ban this user? This action has major implications.";
                isDanger = true;
                break;
            case "unsuspend":
                url = `/admin/users/${id}/status`;
                options.headers = { "Content-Type": "application/json" };
                options.body = JSON.stringify({ status: "active" });
                actionTitle = "Unsuspend Account";
                actionDesc = "Are you sure you want to lift the suspension? The user will regain access immediately.";
                break;
            case "unban":
                url = `/admin/users/${id}/status`;
                options.headers = { "Content-Type": "application/json" };
                options.body = JSON.stringify({ status: "active" });
                actionTitle = "Lift Permanent Ban";
                actionDesc = "Are you sure you want to lift this ban? This reverses a major enforcement action.";
                break;
            default:
                return;
        }

        const confirmed = await showConfirmModal(actionTitle, actionDesc, "Yes, Proceed", isDanger);
        if (!confirmed) return;

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        closePanel();
        showToast("Action completed successfully.", "success");
        await loadUsers();

    } catch (err) {
        console.error(err);
        showToast(err.message, "error");
    }
}
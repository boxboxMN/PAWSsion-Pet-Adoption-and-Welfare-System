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

            // Panel close
            document.getElementById("panelClose").addEventListener("click", closePanel);
            document.getElementById("panelOverlay").addEventListener("click", closePanel);

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") closePanel();
            });

        });

        // ─── Data ──────────────────────────────────────────────
        let allUsers = [];
        let selectedUserId = null;

        // ─── Avatar images ────────────────────────────────────
        const avatarImages = [
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
        ];

        function getAvatarUrl(index) {
            return avatarImages[index % avatarImages.length];
        }

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
                    document.getElementById("userCount").textContent = "0 users";
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
                document.getElementById("userCount").textContent = "0 users";
                return;
            }

            users.forEach((user, index) => {
                const card = buildUserCard(user, index);
                container.appendChild(card);
            });

            document.getElementById("userCount").textContent = `${users.length} user${users.length > 1 ? 's' : ''}`;
        }

        // ─── Build card (Compact) ─────────────────────────────
        function buildUserCard(user, index) {
            const userId = user.account_id || user.id || `user-${index}`;
            const name = user.name || "Unknown";
            const role = user.role || "User";
            const phone = user.phone || "—";
            const email = user.email || "—";

            const status = user.status || "active";
            const isActive = status === "active" || status === "Active";
            const isSuspended = status === "suspended" || status === "Suspended";
            let statusClass = "active";
            let statusLabel = "Active";
            if (isSuspended) {
                statusClass = "suspended";
                statusLabel = "Suspended";
            } else if (!isActive) {
                statusClass = "inactive";
                statusLabel = "Inactive";
            }

            // Format time
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

            const avatarUrl =
                    user.profile
                        ? user.profile
                        : getAvatarUrl(index);

            const card = document.createElement("div");
            card.className = `user-card fadeIn ${selectedUserId === userId ? 'selected' : ''}`;
            card.style.animationDelay = `${index * 30}ms`;
            card.dataset.userId = userId;

            card.innerHTML = `
                <!-- Header: Avatar + Name -->
                <div class="flex gap-3 items-start">
                    <img
                        src="${avatarUrl}"
                        alt="${name}"
                        class="avatar-img"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                    />
                    <div class="avatar-placeholder" style="display:none; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                        ${name.charAt(0)}
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-slate-800 text-sm leading-tight truncate">${name}</h3>
                        <p class="text-blue-600 text-xs capitalize font-medium">${role}</p>
                        <p class="text-xs text-slate-400 mt-0.5">${timeStr}</p>
                    </div>
                </div>

                <!-- Contact Info -->
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

            // Click card → open detail
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
            if (!query) return allUsers;
            return allUsers.filter(user => {
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
            const status = user.status || "active";
            const isActive = status === "active" || status === "Active";
            const isSuspended = status === "suspended" || status === "Suspended";

            let statusLabel = "Active";
            let statusClass = "status-active";
            if (isSuspended) {
                statusLabel = "Suspended";
                statusClass = "status-suspended";
            } else if (!isActive) {
                statusLabel = "Inactive";
                statusClass = "status-inactive";
            }

            const registered = user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }) : "—";

            const lastLogin = user.last_login ? new Date(user.last_login).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }) : "—";

            const avatarUrl =
                user.profile
                    ? user.profile
                    : getAvatarUrl(allUsers.indexOf(user));

            body.innerHTML = `
                <img
                    src="${avatarUrl}"
                    alt="${name}"
                    class="profile-avatar"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                />
                <div class="profile-avatar-placeholder" style="display:none; background: linear-gradient(135deg, #6366f1, #8b5cf6); margin: 0 auto 12px;">
                    ${initial}
                </div>

                <div class="profile-name">${name}</div>
                <div class="profile-role">${role}</div>
                <div class="profile-email">${email}</div>

                <div class="detail-grid">
                    <div class="detail-row">
                        <span class="label">Phone</span>
                        <span class="value">${phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Registered</span>
                        <span class="value">${registered}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Last Login</span>
                        <span class="value">${lastLogin}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Status</span>
                        <span class="value ${statusClass}">${statusLabel}</span>
                    </div>
                </div>

                <h3 class="text-sm font-bold text-slate-800 mb-3">Account Actions</h3>

                <div class="action-buttons">
                    <button class="action-btn" data-action="toggle" data-id="${user.account_id || user.id}">
                        <i class="fa-solid fa-arrows-rotate"></i>
                        ${isActive ? 'Deactivate' : 'Activate'} Account
                    </button>
                    <button class="action-btn" data-action="suspend" data-id="${user.account_id || user.id}">
                        <i class="fa-solid fa-user-slash"></i>
                        Suspend Account
                    </button>
                    <button class="action-btn danger" data-action="ban" data-id="${user.account_id || user.id}">
                        <i class="fa-solid fa-ban"></i>
                        Permanent Ban
                    </button>
                </div>
            `;

            body.querySelectorAll(".action-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    const id = btn.dataset.id;
                    handleAction(action, id, user);
                });
            });

            panel.classList.add("open");
            overlay.classList.add("show");
            document.body.style.overflow = "hidden";
        }

        function closePanel() {
            document.getElementById("detailPanel").classList.remove("open");
            document.getElementById("panelOverlay").classList.remove("show");
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

       async function handleAction(action, id, user) {

    try {

        let url = "";

        switch (action) {

            case "toggle":
                url = `/admin/users/${id}/status`;
                break;

            case "suspend":
                url = `/admin/users/${id}/suspend`;
                break;

            case "ban":
                url = `/admin/users/${id}/ban`;
                break;

            default:
                return;
        }

        const confirmed = confirm(`Are you sure you want to ${action} this account?`);

        if (!confirmed) return;

        const response = await fetch(url, {
            method: "PUT"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        alert("Action completed successfully.");

        closePanel();

        await loadUsers();

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

}
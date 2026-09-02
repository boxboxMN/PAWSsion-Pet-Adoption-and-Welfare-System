document.addEventListener("DOMContentLoaded", () => {
            loadSidebar("feedback");
            loadTopbar({
                title: "Feedback Management",
                subtitle: "View, review, and handle feedback submitted by users."
            });

            loadFeedback();

            document.getElementById("searchInput").addEventListener("input", function() {
                filterFeedback(this.value.trim().toLowerCase());
            });

            document.getElementById("tabActive").addEventListener("click", () => setViewFilter("active"));
            document.getElementById("tabArchived").addEventListener("click", () => setViewFilter("archived"))

            document.getElementById("panelClose").addEventListener("click", closePanel);
            document.getElementById("panelOverlay").addEventListener("click", closePanel);

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") closePanel();
            });
        });

        let allFeedback = [];
        let selectedFeedbackId = null;
        let currentViewFilter = "active"; // "active" (everything not archived) or "archived"

        function getAvatarUrl(item) {
            if (item.sender_profile_picture) {
                return item.sender_profile_picture;
            }
        
            // Fallback: generated initials avatar when no profile picture is on file
            const name = encodeURIComponent(item.sender_name || "Unknown");
            return `https://ui-avatars.com/api/?name=${name}&background=e0e7ff&color=3730a3&bold=true`;
        }

        async function loadFeedback() {
            try {
                const res = await fetch("/admin/feedback/list");
        
                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }
        
                allFeedback = await res.json();
        
                if (!allFeedback || allFeedback.length === 0) {
                    renderEmptyState("No feedback available.");
                    return;
                }
        
                renderFeedback(getFilteredFeedback(""));
            } catch (err) {
                console.error("Failed to load feedback:", err);
                renderEmptyState("Unable to load feedback. Please try refreshing the page.");
            }
        }

        function renderFeedback(feedback) {
            const tbody = document.getElementById("feedbackTableBody");
            tbody.innerHTML = "";

            if (!feedback || feedback.length === 0) {
                renderEmptyState("No results found matching your query.");
                return;
            }

            feedback.forEach((item, index) => {
                tbody.appendChild(buildFeedbackRow(item, index));
            });

            document.getElementById("feedbackCount").textContent = `${feedback.length} Feedbacks`;
        }

        function setViewFilter(view) {
            currentViewFilter = view;
        
            const activeClasses = "view-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-sm transition";
            const inactiveClasses = "view-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition";
        
            document.getElementById("tabActive").className = (view === "active") ? activeClasses : inactiveClasses;
            document.getElementById("tabArchived").className = (view === "archived") ? activeClasses : inactiveClasses;
        
            const currentQuery = document.getElementById("searchInput").value.trim().toLowerCase();
            filterFeedback(currentQuery);
        }
        
        function getFilteredFeedback(query) {
            let result = allFeedback;
        
            result = result.filter(item => {
                const status = (item.status || "").toLowerCase();
                return currentViewFilter === "archived" ? status === "archived" : status !== "archived";
            });
        
            if (!query) return result;
        
            return result.filter(item => {
                return (item.sender_name || "").toLowerCase().includes(query) ||
                       (item.sender_email || "").toLowerCase().includes(query) ||
                       (item.message || "").toLowerCase().includes(query);
            });
        }

        function renderEmptyState(message) {
            const tbody = document.getElementById("feedbackTableBody");
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-12 text-center text-slate-400">
                        <i class="fa-regular fa-folder-open text-4xl mb-3 block text-slate-300"></i>
                        <p class="text-sm font-medium">${message}</p>
                    </td>
                </tr>
            `;
            document.getElementById("feedbackCount").textContent = "0 Feedbacks";
        }

        function buildFeedbackRow(item, index) {
            const id = item.id || `feedback-${index}`;
            const name = item.sender_name || "Unknown";
            const role = item.sender_role || "User";
            const message = item.message || "No message content";
            const status = (item.status || "pending").toLowerCase();

            let badgeUI = '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending</span>';
            if (status === "resolved") {
                badgeUI = '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Resolved</span>';
            } else if (status === "archived") {
                badgeUI = '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Archived</span>';
            }

            let dateStr = "Today";
            if (item.date) {
                const d = new Date(item.date);
                dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
            }

            const avatarUrl = getAvatarUrl(item);
            const tr = document.createElement("tr");
            tr.className = `hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedFeedbackId === id ? 'bg-brand-50/50' : ''}`;

            tr.innerHTML = `
                <td class="py-3.5 px-5">
                    <div class="flex items-center gap-3">
                        <img src="${avatarUrl}" alt="${name}" class="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm" />
                        <div>
                            <div class="font-semibold text-slate-900 text-sm leading-tight">${name}</div>
                            <div class="text-xs text-slate-500">${role}</div>
                        </div>
                    </div>
                </td>
                <td class="py-3.5 px-5">
                    <p class="text-slate-600 text-xs sm:text-sm line-clamp-1 max-w-xs" title="${message}">${message}</p>
                </td>
                <td class="py-3.5 px-5 hidden md:table-cell text-xs text-slate-500 font-medium">
                    ${dateStr}
                </td>
                <td class="py-3.5 px-5">
                    ${badgeUI}
                </td>
                <td class="py-3.5 px-5 text-center">
                    <button class="action-btn px-3 py-1.5 bg-slate-100 hover:bg-brand-600 hover:text-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition">
                        Review
                    </button>
                </td>
            `;

            tr.addEventListener("click", () => selectFeedback(id));
            return tr;
        }

        function selectFeedback(id) {
            selectedFeedbackId = id;
            const item = allFeedback.find(f => (f.id || `feedback-${allFeedback.indexOf(f)}`) === id);
            if (item) openPanel(item);
        }

        function openPanel(item) {
            const panel = document.getElementById("detailPanel");
            const overlay = document.getElementById("panelOverlay");
            const body = document.getElementById("panelBody");

            const name = item.sender_name || "Unknown";
            const role = item.sender_role || "User";
            const email = item.sender_email || "N/A";
            const message = item.message || "No content provided.";
            const status = (item.status || "pending").toLowerCase();
            const avatarUrl = getAvatarUrl(item);

            const d = item.date ? new Date(item.date) : new Date();
            const fullDate = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) + " at " + d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

            body.innerHTML = `
                <div class="flex flex-col items-center text-center pb-4 border-b border-slate-100">
                    <img src="${avatarUrl}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md mb-3" />
                    <h4 class="font-bold text-slate-900 text-base">${name}</h4>
                    <span class="inline-block mt-1 px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">${role}</span>
                    <p class="text-xs text-slate-500 mt-1">${email}</p>
                </div>

                <div class="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs">
                    <div class="flex justify-between items-center">
                        <span class="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Date Submitted</span>
                        <span class="font-semibold text-slate-700">${fullDate}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Status</span>
                        <span class="text-right">
                            <span class="capitalize font-bold text-slate-800 block">${status}</span>
                            ${status === "archived" && item.previous_status ? `<span class="text-slate-400 text-[10px] capitalize">(was ${item.previous_status})</span>` : ""}
                        </span>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Message</label>
                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">${message}</div>
                </div>

                <div class="pt-2">
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Actions</label>
                    <div class="flex gap-2">
                        ${status !== "archived" ? `
                        ${status === "resolved" ? `
                        <button onclick="handleAction('unresolve', ${item.id})" class="flex-1 py-2.5 px-4 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm">
                            <i class="fa-regular fa-circle-xmark"></i> Unresolve
                        </button>
                        ` : `
                        <button onclick="handleAction('resolve', ${item.id})" class="flex-1 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm">
                            <i class="fa-regular fa-circle-check"></i> Resolve
                        </button>
                        `}
                        <button onclick="handleAction('archive', ${item.id})" class="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-700 text-slate-700 hover:text-white border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm">
                            <i class="fa-regular fa-box-archive"></i> Archive
                        </button>
                        ` : `
                        <button onclick="handleAction('unarchive', ${item.id})" class="flex-1 py-2.5 px-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm">
                            <i class="fa-solid fa-box-open"></i> Unarchive
                        </button>
                        `}
                    </div>
                </div>
            `;

            panel.classList.remove("translate-x-full");
            overlay.classList.remove("opacity-0", "pointer-events-none");
        }

        function closePanel() {
            document.getElementById("detailPanel").classList.add("translate-x-full");
            document.getElementById("panelOverlay").classList.add("opacity-0", "pointer-events-none");
            selectedFeedbackId = null;
        }

        function filterFeedback(query) {
            renderFeedback(getFilteredFeedback(query));
        }

        async function handleAction(action, id) {
            const validActions = ["resolve", "unresolve", "archive", "unarchive"];
            if (!validActions.includes(action)) {
                console.error("Unknown feedback action:", action);
                return;
            }

            try {
                const res = await fetch(`/admin/feedback/${id}/status`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action })
                });
        
                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }
        
                const data = await res.json();
        
                // Update local state so the table/panel reflect the change immediately
                const item = allFeedback.find(f => f.id === id);
                if (item) {
                    item.status = data.status;
                    item.previous_status = data.previous_status;
                }
        
                const currentQuery = document.getElementById("searchInput").value.trim().toLowerCase();
                renderFeedback(getFilteredFeedback(currentQuery));
                closePanel();
        
            } catch (err) {
                console.error("Failed to update feedback status:", err);
                alert("Unable to update feedback status. Please try again.");
            }
        }
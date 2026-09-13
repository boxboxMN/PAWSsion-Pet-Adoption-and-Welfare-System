document.addEventListener("DOMContentLoaded", () => {
    loadSidebar("contact-messages");
    loadTopbar({
        title: "Contact Messages",
        subtitle: "View and respond to messages submitted through the public Contact Us form."
    });

    loadFeedback();

    document.getElementById("searchInput").addEventListener("input", function() {
        filterFeedback(this.value.trim().toLowerCase());
    });

    document.getElementById("tabActive").addEventListener("click", () => setViewFilter("active"));
    document.getElementById("tabArchived").addEventListener("click", () => setViewFilter("archived"));

    document.getElementById("statusFilter").addEventListener("change", function() {
        currentStatusFilter = this.value;
        filterFeedback(document.getElementById("searchInput").value.trim().toLowerCase());
    });

    document.getElementById("subjectFilter").addEventListener("change", function() {
        currentSubjectFilter = this.value;
        filterFeedback(document.getElementById("searchInput").value.trim().toLowerCase());
    });

    document.getElementById("modalCancelBtn").addEventListener("click", closeConfirmModal);
    document.getElementById("modalConfirmBtn").addEventListener("click", async () => {
        if (!pendingFeedbackAction || !pendingFeedbackId) return;
        const action = pendingFeedbackAction;
        const id = pendingFeedbackId;
        closeConfirmModal();
        await performAction(action, id);
    });

    document.getElementById("panelClose").addEventListener("click", closePanel);
    document.getElementById("panelOverlay").addEventListener("click", closePanel);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePanel();
    });
});

let allFeedback = [];
let selectedFeedbackId = null;
let currentViewFilter = "active";
let currentStatusFilter = "all";
let currentSubjectFilter = "all";

function getAvatarUrl(item) {
    const name = encodeURIComponent(item.sender_name || "Unknown");
    return `https://ui-avatars.com/api/?name=${name}&background=e0e7ff&color=3730a3&bold=true`;
}

function getSubjectBadge(subject) {
    const map = {
        adoption: { label: "Adoption Inquiry", icon: "fa-solid fa-paw", classes: "bg-emerald-50 text-emerald-600 border-emerald-200" },
        donation: { label: "Donation Inquiry", icon: "fa-solid fa-hand-holding-dollar", classes: "bg-amber-50 text-amber-600 border-amber-200" },
        account: { label: "Account Concern", icon: "fa-solid fa-user-gear", classes: "bg-sky-50 text-sky-600 border-sky-200" },
        technical: { label: "Technical Concern", icon: "fa-solid fa-screwdriver-wrench", classes: "bg-rose-50 text-rose-600 border-rose-200" },
        feedback: { label: "Feedback / Suggestion", icon: "fa-solid fa-comment-dots", classes: "bg-indigo-50 text-indigo-600 border-indigo-200" },
        other: { label: "Other", icon: "fa-solid fa-ellipsis", classes: "bg-purple-50 text-purple-600 border-purple-200" }
    };
    const entry = map[subject] || map["other"];
    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${entry.classes}"><i class="${entry.icon} text-[9px]"></i>${entry.label}</span>`;
}

async function loadFeedback() {
    try {
        const res = await fetch("/admin/contact-messages/list");
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

        allFeedback = await res.json();

        if (!allFeedback || allFeedback.length === 0) {
            renderEmptyState("No contact messages available.");
            return;
        }

        messagesFullList = getFilteredFeedback("");
        renderMessagesPage(1);
    } catch (err) {
        console.error("Failed to load contact messages:", err);
        renderEmptyState("Unable to load messages. Please try refreshing the page.");
    }
}

const MESSAGES_PAGE_SIZE = 10;
let messagesCurrentPage = 1;
let messagesFullList = [];

function renderMessagesPage(page) {
    const totalPages = Math.max(1, Math.ceil(messagesFullList.length / MESSAGES_PAGE_SIZE));
    messagesCurrentPage = Math.min(Math.max(1, page), totalPages);

    const start = (messagesCurrentPage - 1) * MESSAGES_PAGE_SIZE;
    const pageItems = messagesFullList.slice(start, start + MESSAGES_PAGE_SIZE);

    renderFeedback(pageItems);

    const paginationBox = document.getElementById("messagesPagination");
    const paginationText = document.getElementById("messagesPaginationText");
    const paginationButtons = document.getElementById("messagesPaginationButtons");

    if (messagesFullList.length === 0) {
        paginationBox.classList.add("hidden");
        return;
    }

    paginationBox.classList.remove("hidden");
    paginationText.textContent = `Showing ${start + 1}-${Math.min(start + MESSAGES_PAGE_SIZE, messagesFullList.length)} of ${messagesFullList.length} results`;

    const btnBase = "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition";
    const disabledBtn = `${btnBase} text-slate-300 cursor-not-allowed`;
    const enabledBtn = `${btnBase} text-slate-500 hover:bg-slate-100`;
    const activeBtn = `${btnBase} bg-indigo-600 text-white`;

    let buttonsHtml = `<button type="button" data-page="${messagesCurrentPage - 1}" class="messages-page-btn ${messagesCurrentPage === 1 ? disabledBtn : enabledBtn}" ${messagesCurrentPage === 1 ? "disabled" : ""}><i class="fa-solid fa-chevron-left text-[10px]"></i></button>`;

    for (let i = 1; i <= totalPages; i++) {
        buttonsHtml += `<button type="button" data-page="${i}" class="messages-page-btn ${i === messagesCurrentPage ? activeBtn : enabledBtn}">${i}</button>`;
    }

    buttonsHtml += `<button type="button" data-page="${messagesCurrentPage + 1}" class="messages-page-btn ${messagesCurrentPage === totalPages ? disabledBtn : enabledBtn}" ${messagesCurrentPage === totalPages ? "disabled" : ""}><i class="fa-solid fa-chevron-right text-[10px]"></i></button>`;

    paginationButtons.innerHTML = buttonsHtml;

    paginationButtons.querySelectorAll(".messages-page-btn:not(:disabled)").forEach(btn => {
        btn.addEventListener("click", () => renderMessagesPage(Number(btn.dataset.page)));
    });
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

    document.getElementById("feedbackCount").textContent = `${feedback.length} Messages`;
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

    if (currentStatusFilter !== "all" && currentViewFilter !== "archived") {
        result = result.filter(item => (item.status || "").toLowerCase() === currentStatusFilter);
    }

    if (currentSubjectFilter !== "all") {
        result = result.filter(item => (item.subject_category || "").toLowerCase() === currentSubjectFilter);
    }

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
    document.getElementById("feedbackCount").textContent = "0 Messages";
}

function buildFeedbackRow(item, index) {
    const id = item.id || `message-${index}`;
    const name = item.sender_name || "Unknown";
    const role = item.sender_role || "Website Visitor";
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
            ${getSubjectBadge(item.subject_category)}
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
    const item = allFeedback.find(f => (f.id || `message-${allFeedback.indexOf(f)}`) === id);
    if (item) openPanel(item);
}

function openPanel(item) {
    const panel = document.getElementById("detailPanel");
    const overlay = document.getElementById("panelOverlay");
    const body = document.getElementById("panelBody");

    const name = item.sender_name || "Unknown";
    const role = item.sender_role || "Website Visitor";
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
            ${getSubjectBadge(item.subject_category)}
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
                <button onclick="confirmAction('unresolve', ${item.id})" class="flex-1 py-2.5 px-4 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm">
                    <i class="fa-regular fa-circle-xmark"></i> Unresolve
                </button>
                ` : `
                <button onclick="confirmAction('resolve', ${item.id})" class="flex-1 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm">
                    <i class="fa-regular fa-circle-check"></i> Resolve
                </button>
                `}
                <button onclick="confirmAction('archive', ${item.id})" class="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-700 text-slate-700 hover:text-white border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm">
                    <i class="fa-regular fa-box-archive"></i> Archive
                </button>
                ` : `
                <button onclick="confirmAction('unarchive', ${item.id})" class="flex-1 py-2.5 px-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm">
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
    messagesFullList = getFilteredFeedback(query);
    renderMessagesPage(1);
}

async function performAction(action, id) {
    const validActions = ["resolve", "unresolve", "archive", "unarchive"];
    if (!validActions.includes(action)) {
        console.error("Unknown action:", action);
        return;
    }

    try {
        const res = await fetch(`/admin/contact-messages/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action })
        });

        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

        const data = await res.json();

        const item = allFeedback.find(f => f.id === id);
        if (item) {
            item.status = data.status;
            item.previous_status = data.previous_status;
        }

        const currentQuery = document.getElementById("searchInput").value.trim().toLowerCase();
        messagesFullList = getFilteredFeedback(currentQuery);
        renderMessagesPage(messagesCurrentPage);
        closePanel();

    } catch (err) {
        console.error("Failed to update message status:", err);
        alert("Unable to update message status. Please try again.");
    }
}

const feedbackActionConfig = {
    resolve: {
        title: "Resolve Message?",
        desc: "This will mark the message as resolved.",
        icon: "fa-regular fa-circle-check",
        iconClasses: "bg-emerald-100 text-emerald-600",
        confirmClasses: "bg-emerald-600 hover:bg-emerald-700",
        confirmLabel: "Resolve"
    },
    unresolve: {
        title: "Unresolve Message?",
        desc: "This will mark the message as pending again.",
        icon: "fa-regular fa-circle-xmark",
        iconClasses: "bg-amber-100 text-amber-600",
        confirmClasses: "bg-amber-600 hover:bg-amber-700",
        confirmLabel: "Unresolve"
    },
    archive: {
        title: "Archive Message?",
        desc: "This will move the message to the Archived tab.",
        icon: "fa-regular fa-box-archive",
        iconClasses: "bg-slate-200 text-slate-700",
        confirmClasses: "bg-slate-700 hover:bg-slate-800",
        confirmLabel: "Archive"
    },
    unarchive: {
        title: "Unarchive Message?",
        desc: "This will restore the message to its previous status.",
        icon: "fa-solid fa-box-open",
        iconClasses: "bg-indigo-100 text-indigo-600",
        confirmClasses: "bg-indigo-600 hover:bg-indigo-700",
        confirmLabel: "Unarchive"
    }
};

let pendingFeedbackAction = null;
let pendingFeedbackId = null;

function confirmAction(action, id) {
    const config = feedbackActionConfig[action];
    if (!config) return;

    pendingFeedbackAction = action;
    pendingFeedbackId = id;

    document.getElementById("modalIconContainer").className =
        `w-10 h-10 rounded-full flex items-center justify-center ${config.iconClasses}`;
    document.getElementById("modalIcon").className = `${config.icon} text-lg`;
    document.getElementById("modalTitle").textContent = config.title;
    document.getElementById("modalDesc").textContent = config.desc;

    const confirmBtn = document.getElementById("modalConfirmBtn");
    confirmBtn.textContent = config.confirmLabel;
    confirmBtn.className = `px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm ${config.confirmClasses}`;

    openConfirmModal();
}

function openConfirmModal() {
    const modal = document.getElementById("customConfirmModal");
    const box = document.getElementById("modalContentBox");
    modal.classList.remove("hidden");
    requestAnimationFrame(() => {
        box.classList.remove("scale-95", "opacity-0");
        box.classList.add("scale-100", "opacity-100");
    });
}

function closeConfirmModal() {
    const modal = document.getElementById("customConfirmModal");
    const box = document.getElementById("modalContentBox");
    box.classList.remove("scale-100", "opacity-100");
    box.classList.add("scale-95", "opacity-0");
    setTimeout(() => modal.classList.add("hidden"), 150);
    pendingFeedbackAction = null;
    pendingFeedbackId = null;
}
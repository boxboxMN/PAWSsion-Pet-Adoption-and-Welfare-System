let loadedOrganizations = [];

document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadSidebar === 'function') loadSidebar("partner-request");
    if (typeof loadTopbar === 'function') {
        loadTopbar({
            title: "Partner Requests",
            subtitle: "Review pending organizations requesting partnership."
        });
    }
    loadRequests();
});

const modal = document.getElementById("detailsModal");

async function viewDetailsById(orgId) {
    try {
        const res = await fetch(`/admin/organization/${orgId}`);
        if (!res.ok) throw new Error("Unable to load organization.");
        const data = await res.json();

        const setText = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val || "N/A";
        };

        setText("modalName", data.organization_name);
        setText("modalType", data.organization_type);
        setText("modalType2", data.organization_type);
        setText("modalContactPerson", data.contact_person);
        setText("modalEmail", data.email);
        setText("modalPhone", data.contact_number);
        setText("modalDescription", data.description || "No description provided.");

        const addressEl = document.getElementById("modalAddress");
        if (addressEl) {
            addressEl.innerHTML = `
                <div class="font-semibold text-slate-800">${data.address || "No address provided"}</div>
                <span class="text-slate-500 font-normal text-xs mt-0.5 block">${data.city || ""} ${data.province || ""}</span>
            `;
        }

        const status = (data.verification_status || "Pending").trim();
        const statusClass = status.toLowerCase();

        const modalStatus = document.getElementById("modalStatus");
        if (modalStatus) {
            modalStatus.textContent = status;
            modalStatus.className = `status-badge ${statusClass}`;
        }

        const headerModalStatus = document.getElementById("headerModalStatus");
        if (headerModalStatus) {
            headerModalStatus.textContent = status;
            headerModalStatus.className = `status-badge ${statusClass}`;
        }

        setText("modalCreated", data.created_at
            ? new Date(data.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
            : "N/A"
        );

        const docsContainer = document.getElementById("modalDocuments");
        if (docsContainer) {
            docsContainer.innerHTML = "";
            if (!data.documents || data.documents.length === 0) {
                docsContainer.innerHTML = `
                    <div class="col-span-full py-6 text-center bg-white rounded-lg border border-dashed border-slate-200">
                        <i class="fa-regular fa-folder-open text-xl text-slate-300 mb-1"></i>
                        <p class="text-xs text-slate-400 italic">No uploaded documents.</p>
                    </div>
                `;
            } else {
                data.documents.forEach(doc => {
                    const docEl = document.createElement("div");
                    docEl.className = "flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5 hover:border-slate-300 transition text-xs";
                    docEl.innerHTML = `
                        <div class="flex items-center gap-2.5 min-w-0 pr-2">
                            <div class="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                                <i class="fa-solid fa-file-pdf text-xs"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="font-semibold text-slate-800 truncate">${doc.document_name}</p>
                                <p class="text-[10px] text-slate-400 mt-0.5">Uploaded ${new Date(doc.uploaded_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 shrink-0">
                            <a href="/admin/document/view/${doc.document_id}" target="_blank" title="View Document" class="w-7 h-7 rounded border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition">
                                <i class="fa-solid fa-eye text-[10px]"></i>
                            </a>
                            <a href="/admin/document/download/${doc.document_id}" title="Download Document" class="w-7 h-7 rounded bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center transition">
                                <i class="fa-solid fa-download text-[10px]"></i>
                            </a>
                        </div>
                    `;
                    docsContainer.appendChild(docEl);
                });
            }
        }

        const approveBtn = document.getElementById("approveBtn");
        if (approveBtn) {
            approveBtn.onclick = async () => {
                if (!confirm("Approve this organization?")) return;
                await fetch(`/admin/approve/${data.organization_id}`, { method: "PUT" });
                closeModal();
                loadRequests();
            };
        }

        const rejectBtn = document.getElementById("rejectBtn");
        if (rejectBtn) {
            rejectBtn.onclick = async () => {
                if (!confirm("Reject this organization?")) return;
                await fetch(`/admin/reject/${data.organization_id}`, { method: "PUT" });
                closeModal();
                loadRequests();
            };
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");

    } catch (err) {
        console.error(err);
        alert("Unable to load organization.");
    }
}

function viewDetails(org) {
    const orgId = org?.organization_id || org?.id;
    if (orgId) {
        viewDetailsById(orgId);
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
    }
}

if (modal) {
    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });
}

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
});

async function loadRequests() {
    try {
        const res = await fetch("/admin/partner-requests");
        if (!res.ok) throw new Error("Failed to load requests.");
        const organizations = await res.json();
        loadedOrganizations = organizations; 
        const grid = document.getElementById("partnerGrid");

        if (!grid) return;

        if (!organizations || !organizations.length) {
            grid.innerHTML = `
                <div class="col-span-full">
                    <div class="bg-white border border-slate-200 rounded-xl p-12 text-center">
                        <i class="fa-regular fa-circle-check text-4xl text-emerald-600"></i>
                        <h2 class="text-lg font-bold mt-3 text-slate-800">No Pending Requests</h2>
                        <p class="text-slate-500 text-xs mt-1">All organization applications have been reviewed.</p>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = "";
        organizations.forEach(org => {
            const orgId = org.organization_id || org.id;
            const card = document.createElement("div");
            card.className = "partner-card fade-in fade-d2";
            card.innerHTML = `
                <div>
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-base shrink-0 border border-slate-200">
                                <i class="fa-solid fa-building"></i>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-slate-900 text-sm leading-tight truncate">${org.organization_name || 'N/A'}</h3>
                                <p class="text-slate-500 font-medium text-xs mt-0.5 truncate">${org.organization_type || 'N/A'}</p>
                            </div>
                        </div>
                        <span class="status-badge pending">Pending</span>
                    </div>

                    <div class="mt-4 space-y-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div class="flex items-center gap-2 text-slate-600">
                            <i class="fa-regular fa-envelope w-3.5 text-slate-400 shrink-0"></i>
                            <span class="truncate">${org.email || 'N/A'}</span>
                        </div>
                        <div class="flex items-center gap-2 text-slate-600">
                            <i class="fa-regular fa-phone w-3.5 text-slate-400 shrink-0"></i>
                            <span>${org.contact_number || 'N/A'}</span>
                        </div>
                        <div class="flex items-start gap-2 text-slate-600">
                            <i class="fa-regular fa-location-dot w-3.5 text-slate-400 mt-0.5 shrink-0"></i>
                            <span class="line-clamp-2">${org.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <p class="text-[10px] uppercase text-slate-400 font-bold">Submitted</p>
                        <p class="font-medium text-slate-700 text-xs">${org.created_at ? new Date(org.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <button onclick="viewDetailsById(${orgId})" class="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs">
                        <i class="fa-regular fa-eye text-[11px]"></i> Review
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        const grid = document.getElementById("partnerGrid");
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full">
                    <div class="bg-white border border-slate-200 rounded-xl p-12 text-center">
                        <i class="fa-regular fa-triangle-exclamation text-4xl text-rose-500"></i>
                        <h2 class="text-lg font-bold mt-3 text-slate-800">Unable to Load Requests</h2>
                        <p class="text-slate-500 text-xs mt-1">Please try again later.</p>
                    </div>
                </div>
            `;
        }
    }
}
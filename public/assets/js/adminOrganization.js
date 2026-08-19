let selectedOrganizationId = null;
let organizations = [];

// ============================================
// INITIALIZE
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    loadSidebar("organization-masterlist");
    loadTopbar({
        title: "Organization Masterlist",
        subtitle: "View and manage all approved organizations."
    });
    loadOrganizations();
});

// ============================================
// LOAD ORGANIZATIONS
// ============================================
async function loadOrganizations() {
    try {
        const response = await fetch("/admin/organizations");
        if (!response.ok) {
            throw new Error("Unable to load organizations.");
        }

        organizations = await response.json();
        renderOrganizations(organizations);
    } catch (err) {
        console.error(err);
        document.getElementById("organizationGrid").innerHTML = `
            <div class="col-span-full">
                <div class="glass rounded-3xl p-16 text-center">
                    <i class="fa-solid fa-triangle-exclamation text-6xl text-red-500"></i>
                    <h2 class="text-2xl font-bold mt-6">Failed to Load Organizations</h2>
                    <p class="text-slate-500 mt-2">Please try again later.</p>
                </div>
            </div>
        `;
    }
}

// ============================================
// RENDER ORGANIZATION CARDS
// ============================================
function renderOrganizations(data) {
    const grid = document.getElementById("organizationGrid");

    if (!data || data.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full">
                <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                    <div class="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center mb-4">
                        <i class="fa-solid fa-building text-2xl"></i>
                    </div>
                    <h2 class="text-lg font-bold text-slate-800">No Organizations Found</h2>
                    <p class="text-slate-500 text-sm mt-1">There are no records matching your criteria.</p>
                </div>
            </div>
        `;
        return;
    }

    grid.innerHTML = data.map(org => `
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            <div>
                <!-- Top Accent Header -->
                <div class="h-20 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 relative p-4 flex justify-between items-start">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/10 text-sky-200 backdrop-blur-md border border-white/10">
                        ${org.organization_type || 'NGO'}
                    </span>
                </div>

                <!-- Avatar & Body Content -->
                <div class="px-5 pb-5 -mt-10">
                    <div class="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center text-sky-600 text-2xl group-hover:scale-105 transition-transform duration-200 shrink-0">
                        <i class="fa-solid fa-building"></i>
                    </div>

                    <h2 class="text-base font-bold text-slate-900 mt-3 line-clamp-1">${org.organization_name}</h2>
                    <p class="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">${org.description || "No description provided."}</p>

                    <!-- Contact Details -->
                    <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                        <div class="flex items-center gap-2.5 truncate">
                            <i class="fa-regular fa-envelope text-slate-400 w-4 text-center"></i>
                            <span class="truncate">${org.email || '—'}</span>
                        </div>
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-phone text-slate-400 w-4 text-center"></i>
                            <span>${org.contact_number || '—'}</span>
                        </div>
                        <div class="flex items-center gap-2.5 truncate">
                            <i class="fa-solid fa-location-dot text-slate-400 w-4 text-center"></i>
                            <span class="truncate">${org.address || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Action Button -->
            <div class="px-5 pb-5 pt-2">
                <button onclick="openDetails(${org.organization_id})"
                    class="w-full bg-slate-900 hover:bg-sky-600 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-colors duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-sky-500/20 active:scale-98">
                    <span>View Details</span>
                    <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// SEARCH
// ============================================
document.addEventListener("input", function(e) {
    if (e.target.id !== "searchOrganization") return;

    const keyword = e.target.value.toLowerCase();
    const filtered = organizations.filter(org => {
        return (
            org.organization_name.toLowerCase().includes(keyword) ||
            org.organization_type.toLowerCase().includes(keyword) ||
            org.email.toLowerCase().includes(keyword) ||
            org.contact_number.toLowerCase().includes(keyword) ||
            org.address.toLowerCase().includes(keyword)
        );
    });

    renderOrganizations(filtered);
});

// ============================================
// OPEN DETAILS (CENTER MODAL)
// ============================================
async function openDetails(id) {
    try {
        selectedOrganizationId = id; // Store selected ID for actions
        const response = await fetch(`/admin/organization/${id}`);
        if (!response.ok) {
            throw new Error("Unable to load organization.");
        }

        const data = await response.json();

        // PROFILE
        document.getElementById("detailName").textContent = data.organization_name || "N/A";
        document.getElementById("detailType").textContent = data.organization_type || "N/A";
        document.getElementById("modalContactPerson").textContent = data.contact_person || "N/A";
        document.getElementById("detailEmail").textContent = data.email || "N/A";
        document.getElementById("detailEmailProfile").textContent = data.email || "N/A";
        document.getElementById("profileContact").textContent = data.contact_person || "N/A";
        document.getElementById("profilePhone").textContent = data.contact_number || "N/A";
        document.getElementById("profileRegistered").textContent = data.created_at
            ? new Date(data.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : "N/A";

        document.getElementById("detailPhone").textContent = data.contact_number || "N/A";
        document.getElementById("detailAddress").innerHTML = `
            ${data.address || ""}<br>
            <span class="text-slate-500">
                ${data.city || ""}, ${data.province || ""}
            </span>
        `;
        document.getElementById("detailDescription").textContent = data.description || "No description provided.";

        // STATUS BADGE
        const badge = document.getElementById("detailStatus");
        badge.textContent = data.verification_status || "Pending";
        badge.className = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";

        switch (data.verification_status) {
            case "Approved":
                badge.classList.add("bg-emerald-50", "text-emerald-700", "border", "border-emerald-200");
                break;
            case "Rejected":
                badge.classList.add("bg-rose-50", "text-rose-700", "border", "border-rose-200");
                break;
            case "Suspended":
                badge.classList.add("bg-orange-50", "text-orange-700", "border", "border-orange-200");
                break;
            default:
                badge.classList.add("bg-amber-50", "text-amber-700", "border", "border-amber-200");
        }

        // ACCOUNT
        document.getElementById("detailVerification").textContent = data.verification_status || "Pending";
        document.getElementById("detailAccountStatus").textContent = data.status || "Active";
        document.getElementById("detailCreated").textContent = data.created_at
            ? new Date(data.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "N/A";

        // PLATFORM METRICS
        document.getElementById("detailAnimals").textContent = data.total_animals ?? 0;
        document.getElementById("detailAdoptions").textContent = data.total_adoptions ?? 0;
        document.getElementById("detailDonations").textContent = "₱" + Number(data.total_donations ?? 0).toLocaleString();
        document.getElementById("detailLastLogin").textContent = data.last_login
            ? new Date(data.last_login).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            })
            : "Never";

        // DOCUMENTS
        loadDocuments(data);

        // OPEN MODAL WITH FADE & SCALE
        const modal = document.getElementById("detailsModal");
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        
        requestAnimationFrame(() => {
            modal.classList.remove("opacity-0");
            modal.classList.add("opacity-100");
        });

    } catch (error) {
        console.error(error);
        alert("Unable to load organization details.");
    }
}

// ============================================
// LOAD DOCUMENTS
// ============================================
function loadDocuments(data) {
    const container = document.getElementById("documentsContainer");
    container.innerHTML = "";

    if (!data.documents || data.documents.length === 0) {
        container.innerHTML = `
            <div class="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50">
                <div class="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <i class="fa-regular fa-folder-open text-xl"></i>
                </div>
                <h4 class="font-semibold text-xs text-slate-700 mt-3">No Uploaded Documents</h4>
                <p class="text-slate-400 text-[11px] mt-1">This organization hasn't uploaded any verification documents.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = data.documents.map(doc => `
        <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/85 bg-white hover:border-sky-300 hover:shadow-sm transition-all duration-200 group">
            <div class="flex items-center gap-3 truncate pr-2">
                <div class="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                    <i class="fa-solid fa-file-pdf text-base"></i>
                </div>
                <div class="truncate">
                    <p class="font-semibold text-xs text-slate-800 truncate">${doc.document_name || 'Verification Document'}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">
                        Uploaded ${doc.uploaded_at
                            ? new Date(doc.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Unknown Date"}
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
                <!-- View Document Link -->
                <a href="/admin/document/view/${doc.document_id}" target="_blank" rel="noopener noreferrer"
                    title="View Document"
                    class="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center text-xs transition">
                    <i class="fa-solid fa-eye"></i>
                </a>
                <!-- Download Document Link -->
                <a href="/admin/document/download/${doc.document_id}" target="_blank" rel="noopener noreferrer"
                    title="Download Document"
                    class="w-8 h-8 rounded-lg bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center text-xs transition shadow-sm">
                    <i class="fa-solid fa-download"></i>
                </a>
            </div>
        </div>
    `).join("");
}

// ============================================
// CLOSE MODAL
// ============================================
function closeDetailsModal(event) {
    if (!event || event.target.id === "detailsModal") {
        const modal = document.getElementById("detailsModal");
        modal.classList.remove("opacity-100");
        modal.classList.add("opacity-0");

        setTimeout(() => {
            modal.classList.remove("flex");
            modal.classList.add("hidden");
        }, 200);
    }
}
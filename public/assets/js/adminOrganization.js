let selectedOrganizationId = null;
  // ============================================
// INITIALIZE
// ============================================
let organizations = [];

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

    if (data.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full">
                <div class="glass rounded-3xl p-16 text-center">
                    <i class="fa-solid fa-building text-6xl text-blue-500"></i>
                    <h2 class="text-2xl font-bold mt-5">No Organizations Found</h2>
                </div>
            </div>
        `;
        return;
    }
    // Map and join for better DOM performance than appending innerHTML in a loop
    grid.innerHTML = data.map(org => `
        <div class="glass rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div class="h-28 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div class="p-6 -mt-12">
                <div class="w-24 h-24 rounded-full bg-white border-4 border-white shadow flex items-center justify-center text-blue-600 text-4xl">
                    <i class="fa-solid fa-building"></i>
                </div>
                <h2 class="text-2xl font-bold mt-5">${org.organization_name}</h2>
                <p class="text-blue-600 mt-1">${org.organization_type}</p>
                <p class="text-slate-600 mt-5 line-clamp-3">${org.description || "No description provided."}</p>
                <div class="mt-6 space-y-2 text-sm">
                    <p><i class="fa-solid fa-envelope text-blue-600 mr-2"></i>${org.email}</p>
                    <p><i class="fa-solid fa-phone text-blue-600 mr-2"></i>${org.contact_number}</p>
                    <p><i class="fa-solid fa-location-dot text-blue-600 mr-2"></i>${org.address}</p>
                </div>
                <button onclick="openDetails(${org.organization_id})"
                    class="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition">
                    View Details
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
// DETAILS DRAWER
// ============================================
// ============================================
// OPEN DETAILS
// ============================================

async function openDetails(id) {

    try {

        const response = await fetch(`/admin/organization/${id}`);

        if (!response.ok) {
            throw new Error("Unable to load organization.");
        }

        const data = await response.json();

        // =====================================
        // PROFILE
        // =====================================

        document.getElementById("detailName").textContent =
            data.organization_name || "N/A";

        document.getElementById("detailType").textContent =
            data.organization_type || "N/A";

        document.getElementById("modalContactPerson").textContent =
            data.contact_person || "N/A";

        document.getElementById("detailEmail").textContent =
            data.email || "N/A";
        document.getElementById("detailEmailProfile").textContent =
            data.email || "N/A";

        document.getElementById("profileContact").textContent =
            data.contact_person || "N/A";

        document.getElementById("profilePhone").textContent =
            data.contact_number || "N/A";

        document.getElementById("profileRegistered").textContent =
            data.created_at
                ? new Date(data.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                })
                : "N/A";

        document.getElementById("detailPhone").textContent =
            data.contact_number || "N/A";

        document.getElementById("detailAddress").innerHTML = `
            ${data.address || ""}<br>
            <span class="text-slate-500">
                ${data.city || ""}, ${data.province || ""}
            </span>
        `;

        document.getElementById("detailDescription").textContent =
            data.description || "No description provided.";

        // =====================================
        // STATUS BADGE
        // =====================================

        const badge = document.getElementById("detailStatus");

        badge.textContent =
            data.verification_status || "Pending";

        badge.className =
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";

        switch (data.verification_status) {

            case "Approved":

                badge.classList.add(
                    "bg-green-100",
                    "text-green-700"
                );

                break;

            case "Rejected":

                badge.classList.add(
                    "bg-red-100",
                    "text-red-700"
                );

                break;

            case "Suspended":

                badge.classList.add(
                    "bg-orange-100",
                    "text-orange-700"
                );

                break;

            default:

                badge.classList.add(
                    "bg-yellow-100",
                    "text-yellow-700"
                );

        }

        // =====================================
        // ACCOUNT
        // =====================================

        document.getElementById("detailVerification").textContent =
            data.verification_status || "Pending";

        document.getElementById("detailAccountStatus").textContent =
            data.status || "Active";

        document.getElementById("detailCreated").textContent =
            data.created_at
                ? new Date(data.created_at).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                )
                : "N/A";

        // =====================================
        // PLATFORM METRICS
        // =====================================

        document.getElementById("detailAnimals").textContent =
            data.total_animals ?? 0;

        document.getElementById("detailAdoptions").textContent =
            data.total_adoptions ?? 0;

        document.getElementById("detailDonations").textContent =
            "₱" + Number(data.total_donations ?? 0).toLocaleString();

        document.getElementById("detailLastLogin").textContent =
            data.last_login
                ? new Date(data.last_login).toLocaleString()
                : "Never";

        // =====================================
        // DOCUMENTS
        // =====================================

        loadDocuments(data);

        // =====================================
        // OPEN MODAL
        // =====================================

        const modal =
            document.getElementById("detailsModal");

        modal.classList.remove("hidden");
        modal.classList.add("flex");

    }

    catch (error) {

        console.error(error);

        alert("Unable to load organization details.");

    }

}
// ============================================
// DOCUMENTS
// ============================================
function loadDocuments(data) {

    const container =
        document.getElementById("documentsContainer");

    container.innerHTML = "";

    // ==========================================
    // NO DOCUMENTS
    // ==========================================

    if (!data.documents || data.documents.length === 0) {

        container.innerHTML = `

            <div class="border-2 border-dashed rounded-2xl p-10 text-center">

                <div class="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center">

                    <i class="fa-regular fa-file text-2xl text-slate-400"></i>

                </div>

                <h4 class="font-semibold mt-5">
                    No Uploaded Documents
                </h4>

                <p class="text-slate-500 text-sm mt-2">
                    This organization hasn't uploaded any verification documents.
                </p>

            </div>

        `;

        return;
    }

    // ==========================================
    // DOCUMENT LIST
    // ==========================================

    container.innerHTML = data.documents.map(doc => `

        <div
           class="flex justify-between items-center rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-blue-300 transition-all duration-300">

            <div class="flex items-center gap-4">

                <div
                    class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                    <div class="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>

                </div>

                <div>

                    <p class="font-semibold">

                        ${doc.document_name}

                    </p>

                    <p class="text-xs text-slate-500 mt-1">

                        Uploaded
                        ${
                            doc.uploaded_at
                            ? new Date(doc.uploaded_at).toLocaleDateString(
                                "en-US",
                                {
                                    month:"long",
                                    day:"numeric",
                                    year:"numeric"
                                }
                              )
                            : "Unknown Date"
                        }

                    </p>

                </div>

            </div>

            <div class="flex gap-2">
                <a
                    href="/admin/document/view/${doc.document_id}"
                    target="_blank"
                    class="w-10 h-10 rounded-xl border border-slate-300 hover:bg-slate-100 flex items-center justify-center transition">

                    <i class="fa-solid fa-eye"></i>

                </a>

                <a
                    href="/admin/document/download/${doc.document_id}"
                    class="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition">
                    <i class="fa-solid fa-download"></i>
                </a>
            </div>
        </div>
    `).join("");
}
// ============================================
// CLOSE DRAWER
// ============================================
function closeDetailsModal(event) {
    // Closes if triggered programmatically (no event passed) or if the backdrop wrapper is clicked
    if (!event || event.target.id === "detailsModal") {
        const modal = document.getElementById("detailsModal");
        modal.classList.remove("flex");
        modal.classList.add("hidden");
    }
}

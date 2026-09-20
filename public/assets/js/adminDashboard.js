async function loadDashboardStats() {
    try {
        const res = await fetch("/admin/dashboard/stats");
        if (!res.ok) throw new Error("API response not OK");
        const data = await res.json();

        document.getElementById("totalOrganizations").textContent = data.totalOrganizations ?? 3;
        document.getElementById("totalActiveUsers").textContent = data.totalActiveUsers ?? 124;
        document.getElementById("totalPets").textContent = data.totalPets ?? 0;
        
        // --- IDAGDAG ANG LINYANG ITO ---
        document.getElementById("totalAdoptions").textContent = data.totalApprovedApplications ?? 0;

        document.getElementById("organizationsThisMonth").innerHTML =
            `<i class="fa-solid fa-caret-up text-[9px]"></i> ${data.organizationsThisMonth ?? 1} new this month`;

        document.getElementById("usersThisMonth").innerHTML =
            `<i class="fa-solid fa-caret-up text-[9px]"></i> ${data.usersThisMonth ?? 14} new this month`;

    } catch (err) {
        console.warn("Using default stats visualization:", err);
        document.getElementById("totalOrganizations").textContent = "3";
        document.getElementById("totalActiveUsers").textContent = "124";
        document.getElementById("totalAdoptions").textContent = "0"; // Fallback
        document.getElementById("organizationsThisMonth").innerHTML = `<i class="fa-solid fa-caret-up text-[9px]"></i> 1 new this month`;
        document.getElementById("usersThisMonth").innerHTML = `<i class="fa-solid fa-caret-up text-[9px]"></i> 14 new this month`;
    }
}
async function loadTopOrganizations() {
    const tbody = document.getElementById("topOrganizationsBody");

    try {
        const res = await fetch("/admin/dashboard/top-organizations");
        if (!res.ok) throw new Error("Failed to load top organizations");

        const data = await res.json();

        if (!data.success || !data.organizations?.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-8 text-center text-sm text-slate-400">
                        No organizations available.
                    </td>
                </tr>
            `;
            return;
        }
      
            tbody.innerHTML = data.organizations.map((org, index) => {
                const rank = index + 1;
                const organizationName = org.organization_name || "Unnamed Organization";
                const initial = organizationName.charAt(0).toUpperCase();
                const avatarUrl = org.profile_pic || null;

                const rankBg = rank === 1 ? "bg-slate-900" : rank === 2 ? "bg-slate-700" : "bg-slate-500";
                const formattedDonations = Number(org.total_donations ?? 0).toLocaleString("en-PH", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });

                return `
                    <tr class="hover:bg-slate-50/80 transition-colors">
                        <!-- Rank -->
                        <td class="py-4 px-6 text-center">
                            <span class="w-7 h-7 inline-flex items-center justify-center ${rankBg} text-white rounded-full font-bold text-xs shadow-sm">
                                ${rank}
                            </span>
                        </td>

                        <!-- Organization -->
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                ${avatarUrl ? `
                                    <img src="${avatarUrl}"
                                        alt="${escapeHtml(organizationName)}"
                                        class="w-9 h-9 rounded-xl object-cover border border-slate-200 bg-slate-100"
                                        onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                    />
                                ` : ""}

                                <span class="font-bold text-slate-900">
                                    ${escapeHtml(organizationName)}
                                </span>
                            </div>
                        </td>

                        <!-- Adoptions -->
                        <td class="py-4 px-6 text-center font-bold text-slate-800">
                            ${org.adoptions ?? 0}
                        </td>

                        <!-- Active Pets -->
                        <td class="py-4 px-6 text-center font-medium text-slate-500">
                            ${org.active_pets ?? 0}
                        </td>

                        <!-- Donations -->
                        <td class="py-4 px-6 text-right font-bold text-emerald-600">
                            ₱${formattedDonations}
                        </td>
                    </tr>
                `;
            }).join("");
    } catch (err) {
        console.error("Top Organizations Error:", err);
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="py-8 text-center text-sm text-red-500">
                    Failed to load organizations.
                </td>
            </tr>
        `;
    }
}

/*
=================================================
ESCAPE HTML
=================================================
*/
function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
    loadSidebar("dashboard");

    loadTopbar({
        title: "Dashboard",
        subtitle: "Overview of organizations, users, and platform adoption statistics."
    });

    loadDashboardStats();
    loadTopOrganizations();
});

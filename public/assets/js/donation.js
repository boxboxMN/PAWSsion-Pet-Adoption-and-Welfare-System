 let rawDonationsData = [];
    let currentActiveReceiptPath = "";

    async function fetchUserDonations() {
        try {
            const response = await fetch('/api/user/donations');
            const result = await response.json();

            if (result.success) {
                rawDonationsData = result.donations;
                renderDonations(rawDonationsData);
                calculateStats(rawDonationsData);
            } else {
                showEmptyTable("Failed to load donations.");
            }
        } catch (error) {
            console.error("Error loading donations:", error);
            showEmptyTable("No donations found or error connecting to server.");
        }
    }

    // 2. Render Donations Table
    function renderDonations(data) {
        const tbody = document.getElementById("donationTableBody");
        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            showEmptyTable("No donation records found.");
            return;
        }

        data.forEach(item => {
            const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const isCash = item.type === "Cash";
            const iconClass = isCash ? "fa-money-bill-wave" : "fa-box-open";
            
            // Details column content
            let detailsHtml = `<h3 class="font-medium text-gray-800">${item.organization || 'Animal Shelter'}</h3>`;
            if (isCash && item.reference_number) {
                detailsHtml += `<p class="text-xs text-gray-400 mt-0.5">Ref No: ${item.reference_number}</p>`;
            }

            // Amount / items content
            const amountOrItems = isCash 
                ? `₱ ${parseFloat(item.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}`
                : (item.items || 'In-Kind Items');

            // Badge Color Status
            let statusBadge = '';
            const statusStr = (item.status || 'Pending').toLowerCase();

            if (statusStr === 'approved' || statusStr === 'verified' || statusStr === 'received') {
                statusBadge = `
                    <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Verified
                    </div>`;
            } else if (statusStr === 'rejected') {
                statusBadge = `
                    <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-full">
                        <span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                        Rejected
                    </div>`;
            } else {
                statusBadge = `
                    <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full">
                        <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Pending
                    </div>`;
            }

            const tr = document.createElement("tr");
            tr.className = "border-b border-gray-100 table-row-hover transition";
            tr.innerHTML = `
                <td class="p-4 text-xs font-medium text-gray-700">${formattedDate}</td>
                <td class="p-4">
                    <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-sm">
                        <i class="fas ${iconClass}"></i>
                    </div>
                </td>
                <td class="p-4">${detailsHtml}</td>
                <td class="p-4 text-xs font-bold text-gray-800">${amountOrItems}</td>
                <td class="p-4">${statusBadge}</td>
                <td class="p-4 text-center">
                    <button onclick="viewDetails('${item.type}', ${item.id})" class="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition" title="View Details">
                        <i class="fas fa-eye text-base"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 3. Compute Card Stats Dynamic Total
    function calculateStats(data) {
        let totalCash = 0;
        let totalInKindCount = 0;

        data.forEach(item => {
            const statusStr = (item.status || '').toLowerCase();
            if (statusStr === 'approved' || statusStr === 'verified' || statusStr === 'received') {
                if (item.type === 'Cash') {
                    totalCash += parseFloat(item.amount || 0);
                } else if (item.type === 'In-Kind') {
                    totalInKindCount += 1;
                }
            }
        });

        document.getElementById("totalCash").textContent = `₱ ${totalCash.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        document.getElementById("totalInKind").textContent = `${totalInKindCount} Donation${totalInKindCount === 1 ? '' : 's'}`;
    }

    // 4. Filter Function
    function filterDonations() {
        const filterValue = document.getElementById("typeFilter").value;
        if (filterValue === "All") {
            renderDonations(rawDonationsData);
        } else {
            const filtered = rawDonationsData.filter(d => d.type === filterValue);
            renderDonations(filtered);
        }
    }

    function showEmptyTable(message) {
        document.getElementById("donationTableBody").innerHTML = `
            <tr>
                <td colspan="6" class="text-center p-8 text-gray-400 text-sm">${message}</td>
            </tr>`;
    }

    // 5. VIEW DETAILS MODAL LOGIC
    function viewDetails(type, id) {
        const donation = rawDonationsData.find(d => d.id == id && d.type === type);
        if (!donation) return;

        document.getElementById("modalOrgName").textContent = donation.organization || 'Animal Shelter';
        
        const dateObj = new Date(donation.date);
        document.getElementById("modalDate").textContent = `${dateObj.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })} at ${dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}`;
        
        document.getElementById("modalType").textContent = donation.type;

        // Render Amount / Items & Reference Number
        if (type === 'Cash') {
            document.getElementById("modalAmountContainer").classList.remove("hidden");
            document.getElementById("modalRefContainer").classList.remove("hidden");
            document.getElementById("modalAmount").textContent = `₱ ${parseFloat(donation.amount || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            document.getElementById("modalRefNo").textContent = donation.reference_number || 'N/A';
        } else {
            document.getElementById("modalAmountContainer").classList.remove("hidden");
            document.getElementById("modalRefContainer").classList.add("hidden");
            document.getElementById("modalAmount").textContent = donation.items || 'In-Kind Resource Item';
        }

        // Receipt Handling
        const proofSection = document.getElementById("modalProofSection");
        if (donation.receipt_path) {
            proofSection.classList.remove("hidden");
            let fullPath = donation.receipt_path.startsWith('/') 
                ? donation.receipt_path 
                : `/uploads/receipts/${donation.receipt_path}`;
            
            currentActiveReceiptPath = fullPath;
            document.getElementById("modalReceiptPreview").src = fullPath;
        } else {
            proofSection.classList.add("hidden");
            currentActiveReceiptPath = "";
        }

        // Status Banner Rendering
        const statusBanner = document.getElementById("modalStatusBanner");
        const statusStr = (donation.status || 'Pending').toLowerCase();

        if (statusStr === 'approved' || statusStr === 'verified' || statusStr === 'received') {
            statusBanner.className = "mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs font-semibold";
            statusBanner.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                    <span>This donation has been verified and confirmed.</span>
                </div>
                <span class="px-2.5 py-0.5 bg-emerald-200/60 text-emerald-800 rounded-full text-[11px]">Verified</span>
            `;
            statusBanner.classList.remove("hidden");
        } else if (statusStr === 'rejected') {
            const reasonText = donation.rejection_reason || 'No specific reason provided.';

            statusBanner.className = "mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold space-y-1.5";
            statusBanner.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-xmark text-rose-600 text-base"></i>
                        <span>This donation entry was rejected.</span>
                    </div>
                    <span class="px-2.5 py-0.5 bg-rose-200/60 text-rose-800 rounded-full text-[11px]">Rejected</span>
                </div>
                ${donation.rejection_reason ? `<p class="text-[11px] font-normal text-rose-700 pl-6 border-l-2 border-rose-300 ml-1">Reason: ${donation.rejection_reason}</p>` : ''}
            `;
            statusBanner.classList.remove("hidden");
        } else {
            statusBanner.className = "mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-800 text-xs font-semibold";
            statusBanner.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-clock text-amber-600 text-base"></i>
                    <span>This donation is currently pending review by the organization.</span>
                </div>
                <span class="px-2.5 py-0.5 bg-amber-200/60 text-amber-800 rounded-full text-[11px]">Pending</span>
            `;
            statusBanner.classList.remove("hidden");
        }

        const modal = document.getElementById("detailsModal");
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.remove("scale-95");
    }

    function closeDetailsModal() {
        const modal = document.getElementById("detailsModal");
        modal.classList.add("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.add("scale-95");
    }

    // 6. RECEIPT LIGHTBOX LOGIC
    function viewReceiptDirect(receiptPathRaw) {
        let fullPath = "https://via.placeholder.com/400x600?text=No+Receipt+Uploaded";
        if (receiptPathRaw) {
            fullPath = receiptPathRaw.startsWith('/') 
                ? receiptPathRaw 
                : `/uploads/receipts/${receiptPathRaw}`;
        }

        const modalImg = document.getElementById("modalReceiptImg");
        const downloadBtn = document.getElementById("downloadReceiptBtn");
        const openBtn = document.getElementById("openReceiptExternal");

        modalImg.src = fullPath;
        downloadBtn.href = fullPath;
        openBtn.href = fullPath;

        const modal = document.getElementById("receiptModal");
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.remove("scale-95");
    }

    function closeReceiptModal() {
        const modal = document.getElementById("receiptModal");
        modal.classList.add("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.add("scale-95");
    }

    function triggerZoomReceipt() {
        if (currentActiveReceiptPath) {
            viewReceiptDirect(currentActiveReceiptPath);
        }
    }

    // Sidebar/Header Component Load Script
    async function loadComponent(id, file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Cannot load ${file}`);
            document.getElementById(id).innerHTML = await response.text();
        } catch (error) {
            console.error(error);
        }
    }

    Promise.all([
        loadComponent("sidebar", "/user/userSidebar.html"),
        loadComponent("header", "/user/userHeader.html")
    ])
    .then(() => {
        document.getElementById("sidebar").style.visibility = "visible";
        document.getElementById("header").style.visibility = "visible";

        const currentPath = window.location.pathname;
        const pageTitle = document.getElementById("pageTitle");
        const customTitles = {
            "/profile": "Profile",
            "/cash-donation": "Donation",
            "/inkind-donation": "Donation"
        };

        if (pageTitle && customTitles[currentPath]) {
            pageTitle.textContent = customTitles[currentPath];
        }

        const links = document.querySelectorAll("#sidebar .nav-link");
        links.forEach(link => {
            const href = link.getAttribute("href");
            const isActive = href === currentPath || (href !== "/dashboard" && currentPath.startsWith(href));

            if (isActive) {
                link.className = "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl bg-blue-600 text-white shadow";
                if (pageTitle && !customTitles[currentPath]) {
                    pageTitle.textContent = link.dataset.title;
                }
            } else {
                link.className = "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition";
            }
        });

        fetchUserDonations();
        document.body.style.visibility = "visible";
    })
    .catch(error => console.error(error));
    // Global state
    let activeTab = 'cash'; // 'cash' or 'inkind'
    let allDonations = [];
    let allInKindDonations = [];
    let selectedDonationId = null;
    let selectedInKindId = null;

    document.addEventListener("DOMContentLoaded", async () => {
        // Load Shared Layout Components
        await loadTopbar({
            title: "Donations Overview",
            subtitle: "Track funds and in-kind resources submitted by sponsors"
        });
        await loadSidebar("donation");

        // Close dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.action-dropdown-btn') && !e.target.closest('.action-dropdown-menu')) {
                document.querySelectorAll('.action-dropdown-menu').forEach(m => m.classList.add('hidden'));
            }
        });

        // Load Initial Data
        fetchPaymentDetails();
        fetchDonations();
        fetchInKindDonations();
    });

    // ==========================================
    // MAIN TAB SWITCHING LOGIC
    // ==========================================
    function switchDonationTab(tab) {
        activeTab = tab;
        const tabCash = document.getElementById("tabCash");
        const tabInKind = document.getElementById("tabInKind");
        const cashTable = document.getElementById("cashTableContainer");
        const inkindTable = document.getElementById("inkindTableContainer");

        if (tab === 'cash') {
            tabCash.className = "flex-1 py-3 px-6 text-sm font-bold rounded-lg border-b-2 border-indigo-600 text-indigo-600 flex items-center justify-center gap-2 transition-all";
            tabInKind.className = "flex-1 py-3 px-6 text-sm font-bold rounded-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 transition-all";
            cashTable.classList.remove("hidden");
            inkindTable.classList.add("hidden");
        } else {
            tabInKind.className = "flex-1 py-3 px-6 text-sm font-bold rounded-lg border-b-2 border-indigo-600 text-indigo-600 flex items-center justify-center gap-2 transition-all";
            tabCash.className = "flex-1 py-3 px-6 text-sm font-bold rounded-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 transition-all";
            inkindTable.classList.remove("hidden");
            cashTable.classList.add("hidden");
        }
        filterDonations();
    }

    // ==========================================
    // MODAL SUB-TAB SWITCHING
    // ==========================================
    function switchModalConfigTab(type) {
        const modalTabCash = document.getElementById("modalTabCash");
        const modalTabInKind = document.getElementById("modalTabInKind");
        const modalCashSection = document.getElementById("modalCashSection");
        const modalInKindSection = document.getElementById("modalInKindSection");

        if (type === 'cash') {
            modalTabCash.className = "flex-1 py-2 text-xs font-bold rounded-lg text-indigo-600 bg-white shadow-sm transition-all";
            modalTabInKind.className = "flex-1 py-2 text-xs font-bold rounded-lg text-gray-500 transition-all";
            modalCashSection.classList.remove("hidden");
            modalInKindSection.classList.add("hidden");
        } else {
            modalTabInKind.className = "flex-1 py-2 text-xs font-bold rounded-lg text-indigo-600 bg-white shadow-sm transition-all";
            modalTabCash.className = "flex-1 py-2 text-xs font-bold rounded-lg text-gray-500 transition-all";
            modalInKindSection.classList.remove("hidden");
            modalCashSection.classList.add("hidden");
        }
    }

    // ==========================================
    // FETCH PAYMENT & IN-KIND LOCATION DETAILS
    // ==========================================
    async function fetchPaymentDetails() {
    try {
        const res = await fetch("/org/payment-info");
        const result = await res.json();

        if (result.success && result.data) {
            const data = result.data;
            
            // Cash Fields
            document.getElementById('displayAccountName').textContent = data.gcash_name || data.organization_name || "N/A";
            document.getElementById('displayAccountNum').textContent = data.gcash_number ? `${data.gcash_number} (GCash)` : "No account set";
            document.getElementById('inputAccountName').value = data.gcash_name || "";
            document.getElementById('inputAccountNum').value = data.gcash_number || "";
            document.getElementById('inputPhone').value = data.contact_number || "";

            if (data.qr_code) {
                document.getElementById('qrPreview').src = data.qr_code;
            }

            // In-Kind Location Fields (Nilagyan ng tamang field names mula sa DB)
            document.getElementById('inputLocationName').value = data.organization_name || "";
            document.getElementById('inputLocationAddress').value = data.dropoff_address || "";
            document.getElementById('inputOperatingHours').value = data.dropoff_hours || "";
            document.getElementById('inputImportantNotes').value = data.dropoff_notes || "";

            if (data.dropoff_image) {
                document.getElementById('locationPreview').src = data.dropoff_image;
            }
        }
    } catch (error) {
        console.error("Error fetching payment/in-kind details:", error);
    }
}

    // ==========================================
    // FETCH & RENDER CASH DONATIONS
    // ==========================================
    async function fetchDonations() {
        try {
            const res = await fetch("/org/donations");
            const result = await res.json();

            if (result.success) {
                allDonations = result.donations || [];

                const totalAmount = parseFloat(result.totalDonations || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                const totalDisplay = document.getElementById("displayTotalDonation");
                if (totalDisplay) {
                    totalDisplay.textContent = `₱${totalAmount}`;
                }

                renderDonationsTable(allDonations);
            }
        } catch (error) {
            console.error("Error fetching donations:", error);
            const tbody = document.getElementById("donationsTableBody");
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-rose-500">Failed to load cash donations.</td></tr>`;
            }
        }
    }

    function renderDonationsTable(donations) {
        const tbody = document.getElementById("donationsTableBody");
        if (!tbody) return;

        if (!donations || donations.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-400">No cash donations recorded yet.</td></tr>`;
            updatePaginationInfo(0);
            return;
        }

        tbody.innerHTML = donations.map((d) => {
            const dateObj = new Date(d.created_at);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            let statusBadge = '';
            const status = (d.status || 'Pending').toLowerCase();

            if (status === 'approved' || status === 'verified') {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-emerald-100/70 text-emerald-600 rounded-full"><span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Verified</span>`;
            } else if (status === 'rejected') {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-rose-100/70 text-rose-600 rounded-full"><span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>Rejected</span>`;
            } else {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-amber-100/70 text-amber-600 rounded-full"><span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>Pending</span>`;
            }

            const formattedAmount = parseFloat(d.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
            const donationId = d.cash_donation_id || d.id;

            return `
                <tr class="hover:bg-gray-50/30 transition-colors">
                    <td class="py-4 px-6">
                        <span class="font-semibold text-gray-900 block">${dateStr}</span>
                        <span class="text-xs text-gray-400 block mt-0.5">${timeStr}</span>
                    </td>
                    <td class="py-4 px-6 font-medium text-gray-900">
                        ${d.donor_name}
                        <span class="text-xs text-gray-400 block">${d.donor_email || 'No Email Provided'}</span>
                    </td>
                    <td class="py-4 px-6 font-semibold text-gray-900">₱ ${formattedAmount}</td>
                    <td class="py-4 px-6">
                        <span class="font-semibold text-gray-900 block">GCASH</span>
                        <span class="text-xs text-gray-400 block mt-0.5">ref no: ${d.reference_number || 'N/A'}</span>
                    </td>
                    <td class="py-4 px-6">${statusBadge}</td>
                    <td class="py-4 px-6 text-center relative">
                        <button onclick="toggleActionDropdown(event, ${donationId})" class="action-dropdown-btn text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition">
                            <i class="fa-solid fa-ellipsis-vertical text-lg"></i>
                        </button>
                        <div id="actionMenu-${donationId}" class="action-dropdown-menu hidden absolute right-6 top-12 z-50 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 text-left text-xs font-medium">
                            <button onclick="openReviewModal(${donationId})" class="w-full px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                <i class="fa-regular fa-eye text-indigo-600"></i> Review Details
                            </button>
                            ${d.receipt_path ? `<button onclick="viewReceiptDirect('${d.receipt_path}')" class="w-full px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"><i class="fa-solid fa-receipt text-emerald-600"></i> View Receipt</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        updatePaginationInfo(donations.length);
    }

    // ==========================================
    // FETCH & RENDER IN-KIND DONATIONS
    // ==========================================
  
async function fetchInKindDonations() {
    try {
        const res = await fetch("/org/donations/in-kind");
        const result = await res.json();

        if (result.success) {
            allInKindDonations = result.donations || [];
            
            // Gamitin ang totalInKind galing sa backend response (Approved lamang)
            const displayTotal = document.getElementById("displayInKindTotal");
            if (displayTotal) {
                displayTotal.textContent = result.totalInKind || 0; 
            }

            renderInKindTable(allInKindDonations);
        }
    } catch (error) {
        console.error("Error fetching in-kind donations:", error);
        const tbody = document.getElementById("inkindTableBody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-rose-500">Failed to load in-kind donations.</td></tr>`;
        }
    }
}

    function renderInKindTable(donations) {
        const tbody = document.getElementById("inkindTableBody");
        if (!tbody) return;

        if (!donations || donations.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-400">No in-kind donations submitted yet.</td></tr>`;
            document.getElementById("inkindPaginationInfo").textContent = "Showing 0 results";
            return;
        }

        tbody.innerHTML = donations.map((d) => {
            const dateObj = new Date(d.created_at || Date.now());
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            let statusBadge = '';
            const status = (d.status || 'Pending').toLowerCase();

            if (status === 'approved' || status === 'verified') {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-emerald-100/70 text-emerald-600 rounded-full"><span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Approved</span>`;
            } else if (status === 'rejected') {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-rose-100/70 text-rose-600 rounded-full"><span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>Rejected</span>`;
            } else {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-amber-100/70 text-amber-600 rounded-full"><span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>Pending</span>`;
            }

            const inkindId = d.inkind_donation_id || d.id;

            return `
                <tr class="hover:bg-gray-50/30 transition-colors">
                    <td class="py-4 px-6 font-semibold text-gray-900">${dateStr}</td>
                    <td class="py-4 px-6 font-medium text-gray-900">${d.donor_name || 'Anonymous'}</td>
                    <td class="py-4 px-6 font-semibold text-gray-800">${d.item_name}</td>
                    <td class="py-4 px-6 text-gray-600">${d.quantity}</td>
                    <td class="py-4 px-6">${statusBadge}</td>
                    <td class="py-4 px-6 text-center">
                        <button onclick="openInKindModal(${inkindId})" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 mx-auto">
                            <i class="fa-regular fa-eye"></i> Review
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        document.getElementById("inkindPaginationInfo").textContent = `Showing 1 to ${donations.length} of ${donations.length} results`;
    }

    // ==========================================
    // IN-KIND MODAL CONTROL FUNCTIONS
    // ==========================================
    function openInKindModal(id) {
        selectedInKindId = id;
        const donation = allInKindDonations.find(item => (item.inkind_donation_id || item.id) == id);
        if (!donation) return;

        hideInKindRejectionFlow();

        document.getElementById("inkindDonorName").value = donation.donor_name || "N/A";
        document.getElementById("inkindItemName").value = donation.item_name || "N/A";
        document.getElementById("inkindQuantity").value = donation.quantity || "N/A";

        const banner = document.getElementById("inkindStatusBanner");
        const approveBtn = document.getElementById("inkindApproveBtn");
        const rejectBtn = document.getElementById("inkindRejectBtn");
        const status = (donation.status || 'Pending').toLowerCase();

        if (status === 'approved' || status === 'verified') {
            banner.className = "mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs font-semibold";
            banner.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                    <span>This in-kind donation has been approved & received.</span>
                </div>
                <span class="px-2.5 py-0.5 bg-emerald-200/60 text-emerald-800 rounded-full text-[11px]">Approved</span>
            `;
            banner.classList.remove("hidden");
            approveBtn.disabled = true;
            approveBtn.className = "px-4 py-2 bg-gray-300 text-gray-500 text-xs font-semibold rounded-lg cursor-not-allowed";
            rejectBtn.classList.add("hidden");
        } else if (status === 'rejected') {
            banner.className = "mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold space-y-1";
            banner.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-xmark text-rose-600 text-base"></i>
                        <span>This in-kind donation was rejected.</span>
                    </div>
                    <span class="px-2.5 py-0.5 bg-rose-200/60 text-rose-800 rounded-full text-[11px]">Rejected</span>
                </div>
                ${donation.rejection_reason ? `<p class="text-[11px] font-normal text-rose-700 pl-6">Reason: ${donation.rejection_reason}</p>` : ''}
            `;
            banner.classList.remove("hidden");
            approveBtn.disabled = false;
            approveBtn.className = "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition";
            approveBtn.textContent = "Re-approve & Receive";
            rejectBtn.classList.add("hidden");
        } else {
            banner.classList.add("hidden");
            approveBtn.disabled = false;
            approveBtn.className = "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition";
            approveBtn.textContent = "Approve / Received";
            rejectBtn.classList.remove("hidden");
        }

        const modal = document.getElementById("reviewInKindModal");
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.remove("scale-95");
    }

    function closeInKindModal() {
        const modal = document.getElementById("reviewInKindModal");
        modal.classList.add("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.add("scale-95");
        selectedInKindId = null;
    }

    function showInKindRejectionFlow() {
        document.getElementById("inkindRejectionSection").classList.remove("hidden");
        document.getElementById("inkindInitialActionButtons").classList.add("hidden");
        document.getElementById("inkindRejectionActionButtons").classList.remove("hidden");
        updateInKindRejectionText();
    }

    function hideInKindRejectionFlow() {
        document.getElementById("inkindRejectionSection").classList.add("hidden");
        document.getElementById("inkindInitialActionButtons").classList.remove("hidden");
        document.getElementById("inkindRejectionActionButtons").classList.add("hidden");
    }

    function updateInKindRejectionText() {
        const selectedRadio = document.querySelector('input[name="inkindRejectReason"]:checked');
        const reasonBox = document.getElementById("inkindRejectionReasonText");
        
        if (selectedRadio) {
            const val = selectedRadio.value;
            if (val === "Damaged or Unusable Condition") {
                reasonBox.textContent = "Verification failed. The donated items are damaged or unusable upon physical inspection.";
            } else if (val === "Inappropriate / Unaccepted Item Category") {
                reasonBox.textContent = "Verification failed. The donated items fall under categories not currently accepted or needed by the shelter.";
            } else if (val === "Item Not Received at Drop-off") {
                reasonBox.textContent = "Verification failed. The items were not delivered or dropped off within the designated period.";
            } else {
                reasonBox.textContent = "Verification failed. This in-kind donation appears to be a duplicate entry.";
            }
        }
    }

    async function submitInKindRejection() {
        const reasonText = document.getElementById("inkindRejectionReasonText").textContent;
        await updateInKindStatus('Rejected', reasonText);
    }

    async function updateInKindStatus(newStatus, reason = null) {
    if (!selectedInKindId) return;

    try {
        const payload = { status: newStatus };
        if (reason) payload.reason = reason;

        const res = await fetch(`/org/donations/in-kind/${selectedInKindId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (result.success) {
            showToast(`In-kind donation marked as ${newStatus}!`, 'success'); 
            closeInKindModal();
            fetchInKindDonations();
        } else {
            showToast("Failed: " + result.message, 'error'); 
        }
    } catch (err) {
        showToast("An error occurred while updating status.", 'error'); 
    }
}
    // ==========================================
    // SEARCH & FILTER FUNCTION
    // ==========================================
    function filterDonations() {
        const searchInput = document.getElementById("searchInput");
        const statusSelect = document.getElementById("statusFilter");

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
        const statusFilter = statusSelect ? statusSelect.value : "ALL";

        if (activeTab === 'cash') {
            const filtered = allDonations.filter(d => {
                const matchesSearch = 
                    (d.donor_name && d.donor_name.toLowerCase().includes(searchTerm)) ||
                    (d.reference_number && d.reference_number.toLowerCase().includes(searchTerm)) ||
                    (d.amount && d.amount.toString().includes(searchTerm));

                const matchesStatus = 
                    statusFilter === 'ALL' || 
                    (statusFilter === 'Approved' && (d.status === 'Approved' || d.status === 'Verified')) ||
                    (d.status === statusFilter);

                return matchesSearch && matchesStatus;
            });
            renderDonationsTable(filtered);
        } else {
            const filtered = allInKindDonations.filter(d => {
                const matchesSearch = 
                    (d.donor_name && d.donor_name.toLowerCase().includes(searchTerm)) ||
                    (d.item_name && d.item_name.toLowerCase().includes(searchTerm));

                const matchesStatus = 
                    statusFilter === 'ALL' || 
                    (statusFilter === 'Approved' && (d.status === 'Approved' || d.status === 'Verified')) ||
                    (d.status === statusFilter);

                return matchesSearch && matchesStatus;
            });
            renderInKindTable(filtered);
        }
    }

    function toggleActionDropdown(e, id) {
        e.stopPropagation();
        document.querySelectorAll('.action-dropdown-menu').forEach(menu => {
            if (menu.id !== `actionMenu-${id}`) menu.classList.add('hidden');
        });
        const targetMenu = document.getElementById(`actionMenu-${id}`);
        if (targetMenu) targetMenu.classList.toggle('hidden');
    }

    function updatePaginationInfo(count) {
        const pagInfo = document.getElementById("paginationInfo");
        if (pagInfo) {
            pagInfo.textContent = `Showing 1 to ${count} of ${count} results`;
        }
    }

// ==========================================
    // RECEIPT LIGHTBOX MODAL
    // ==========================================
    // Variable para sa kasalukuyang binubuksan na resibo
    let currentReceiptPath = null;

    function viewReceiptDirect(receiptPathRaw) {
        let fullPath = "https://via.placeholder.com/400x600?text=No+Receipt+Uploaded";
        
        if (receiptPathRaw) {
            // Siguraduhing maayos ang path (handling absolute vs relative paths)
            fullPath = (receiptPathRaw.startsWith('/') || receiptPathRaw.startsWith('http')) 
                ? receiptPathRaw 
                : `/uploads/receipts/${receiptPathRaw}`;
        }

        const modalImg = document.getElementById("modalReceiptImg");
        const downloadBtn = document.getElementById("downloadReceiptBtn");
        const openBtn = document.getElementById("openReceiptExternal");

        if (modalImg) {
            modalImg.src = fullPath;
            // Siguraduhing malinaw at hindi distorted sa modal lightbox
            modalImg.classList.add("max-h-[85vh]", "w-auto", "object-contain", "mx-auto");
        }

        if (downloadBtn) downloadBtn.href = fullPath;
        if (openBtn) openBtn.href = fullPath;

        const modal = document.getElementById("receiptModal");
        if (modal) {
            modal.classList.remove("opacity-0", "pointer-events-none");
            modal.querySelector("div")?.classList.remove("scale-95");
        }
    }

    function closeReceiptModal() {
        const modal = document.getElementById("receiptModal");
        if (modal) {
            modal.classList.add("opacity-0", "pointer-events-none");
            modal.querySelector("div")?.classList.add("scale-95");
        }
    }

    function triggerViewReceiptFromReview() {
        // Kunin ang nakaguhit na raw path sa data attribute o sa variable imbes na sa rendered src
        const img = document.getElementById("reviewReceiptImg");
        const rawPath = img?.getAttribute("data-raw-path") || currentReceiptPath || img?.src;

        if (rawPath) {
            viewReceiptDirect(rawPath);
        }
    }

    // ==========================================
    // REVIEW & VERIFICATION MONETARY MODAL
    // ==========================================
    function openReviewModal(id) {
        selectedDonationId = id;
        const donation = allDonations.find(item => (item.cash_donation_id || item.id) == id);
        if (!donation) return;

        hideRejectionFlow();

        document.getElementById("reviewDonorName").value = donation.donor_name || "N/A";
        document.getElementById("reviewAmount").value = parseFloat(donation.amount || 0).toFixed(2);
        document.getElementById("reviewRefNo").value = donation.reference_number || "N/A";
        
        let receiptPath = "";
        if (donation.receipt_path) {
            receiptPath = donation.receipt_path.startsWith('/') 
                ? donation.receipt_path 
                : `/uploads/receipts/${donation.receipt_path}`;
        } else {
            receiptPath = "https://via.placeholder.com/400x600?text=No+Receipt+Uploaded";
        }

        // I-save ang eksaktong path sa global variable at data attribute ng img element
        currentReceiptPath = receiptPath;
        const reviewImg = document.getElementById("reviewReceiptImg");
        if (reviewImg) {
            reviewImg.src = receiptPath;
            reviewImg.setAttribute("data-raw-path", receiptPath);
        }

        const bannerContainer = document.getElementById("statusVerificationBanner");
        const confirmBtn = document.getElementById("confirmVerifyBtn");
        const rejectBtn = document.getElementById("rejectBtnInModal");

        const status = (donation.status || 'Pending').toLowerCase();

        if (status === 'approved' || status === 'verified') {
            bannerContainer.className = "mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs font-semibold";
            bannerContainer.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                    <span>This donation has been verified and approved.</span>
                </div>
                <span class="px-2.5 py-0.5 bg-emerald-200/60 text-emerald-800 rounded-full text-[11px]">Verified</span>
            `;
            bannerContainer.classList.remove("hidden");
            confirmBtn.disabled = true;
            confirmBtn.className = "px-4 py-2 bg-gray-300 text-gray-500 text-xs font-semibold rounded-lg cursor-not-allowed";
            rejectBtn.classList.add("hidden");
        } else if (status === 'rejected') {
            bannerContainer.className = "mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold space-y-1";
            bannerContainer.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-xmark text-rose-600 text-base"></i>
                        <span>This donation was rejected.</span>
                    </div>
                    <span class="px-2.5 py-0.5 bg-rose-200/60 text-rose-800 rounded-full text-[11px]">Rejected</span>
                </div>
                ${donation.rejection_reason ? `<p class="text-[11px] font-normal text-rose-700 pl-6">Reason: ${donation.rejection_reason}</p>` : ''}
            `;
            bannerContainer.classList.remove("hidden");
            confirmBtn.disabled = false;
            confirmBtn.className = "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition";
            confirmBtn.textContent = "Re-verify & Approve";
            rejectBtn.classList.add("hidden");
        } else {
            bannerContainer.classList.add("hidden");
            confirmBtn.disabled = false;
            confirmBtn.className = "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition";
            confirmBtn.textContent = "Confirm & Verify";
            rejectBtn.classList.remove("hidden");
        }

        const modal = document.getElementById("reviewDonationModal");
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.remove("scale-95");
    }

    function closeReviewModal() {
        const modal = document.getElementById("reviewDonationModal");
        modal.classList.add("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.add("scale-95");
        selectedDonationId = null;
        currentReceiptPath = null;
    }

    function showRejectionFlow() {
        document.getElementById("rejectionSection").classList.remove("hidden");
        document.getElementById("initialActionButtons").classList.add("hidden");
        document.getElementById("rejectionActionButtons").classList.remove("hidden");
        updateRejectionText();
    }

    function hideRejectionFlow() {
        document.getElementById("rejectionSection").classList.add("hidden");
        document.getElementById("initialActionButtons").classList.remove("hidden");
        document.getElementById("rejectionActionButtons").classList.add("hidden");
    }

    function updateRejectionText() {
        const selectedRadio = document.querySelector('input[name="rejectReason"]:checked');
        const reasonBox = document.getElementById("rejectionReasonText");
        
        if (selectedRadio) {
            const val = selectedRadio.value;
            if (val === "Amount Mismatch") {
                reasonBox.textContent = "Verification failed. There is a mismatch in the reference numbers and a significant discrepancy in the total; the declared amount does not match the amount shown on the receipt.";
            } else if (val === "Blurry/Unreadable Screenshot") {
                reasonBox.textContent = "Verification failed. The uploaded proof of payment image is blurry or unreadable. Please upload a clear screenshot.";
            } else if (val === "Transaction not found in GCash Records.") {
                reasonBox.textContent = "Verification failed. No matching transaction was found in the official GCash account records for the provided reference number.";
            } else {
                reasonBox.textContent = "Verification failed. This transaction appears to be a duplicate submission.";
            }
        }
    }

    async function approveDonation() {
        if (!selectedDonationId) return;
        
        try {
            const res = await fetch(`/org/donations/${selectedDonationId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Approved" })
            });
            const result = await res.json();

            if (result.success) {
                showToast("Donation successfully verified and approved!", 'success'); 
                closeReviewModal();
                fetchDonations();
            } else {
                showToast("Failed: " + result.message, 'error'); 
            }
        } catch (err) {
            showToast("An error occurred while approving the donation.", 'error');
        }
    }
    
    async function rejectDonation() {
        if (!selectedDonationId) return;
        const reasonText = document.getElementById("rejectionReasonText").textContent;

        try {
            const res = await fetch(`/org/donations/${selectedDonationId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Rejected", reason: reasonText })
            });
            const result = await res.json();

            if (result.success) {
                showToast("Donation rejected.", 'success'); 
                closeReviewModal();
                fetchDonations();
            } else {
                showToast("Failed: " + result.message, 'error');
            }
        } catch (err) {
            showToast("An error occurred while rejecting the donation.", 'error'); 
        }
    }

    // ==========================================
    // CONFIG / SETTINGS MODAL CONTROL FUNCTIONS
    // ==========================================
    function openConfigModal() {
        const modal = document.getElementById('paymentConfigModal');
        if (modal) {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.querySelector('div').classList.remove('scale-95');
        }
    }

    function closeConfigModal() {
        const modal = document.getElementById('paymentConfigModal');
        if (modal) {
            modal.classList.add('opacity-0', 'pointer-events-none');
            modal.querySelector('div').classList.add('scale-95');
        }
    }

    function previewImage(event, targetImgId) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById(targetImgId).src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    async function savePaymentDetails(e) {
        e.preventDefault();

        const saveBtn = document.getElementById("saveBtn");
        const originalBtnText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Saving...`;

        try {
            const form = document.getElementById("paymentConfigForm");
            const formData = new FormData(form);

            const response = await fetch("/org/payment-info", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showToast("Donation settings and In-Kind drop-off details saved successfully!", 'success'); 
                closeConfigModal();
                await fetchPaymentDetails();
            } else {
                showToast("Error: " + result.message, 'error'); 
            }
        } catch (error) {
            showToast("An unexpected error occurred while saving.", 'error'); 
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
        }
    }
  
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        const isSuccess = type === 'success';

        toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold transition-all duration-300 transform translate-y-5 opacity-0 ${
            isSuccess 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
        }`;

        toast.innerHTML = `
            <i class="fa-solid ${isSuccess ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark text-rose-600'} text-base"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-y-5', 'opacity-0');
        }, 10);

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
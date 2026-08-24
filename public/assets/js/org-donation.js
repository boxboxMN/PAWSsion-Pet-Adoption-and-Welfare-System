/**
 * org-donation.js
 * Handles interactivity for the organization donation dashboard
 */

// Global state
let activeTab = 'cash'; // 'cash' or 'inkind'
let allDonations = [];
let allInKindDonations = [];
let selectedDonationId = null;
let selectedInKindId = null;
let currentReceiptPath = null;

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

    // Add event listener for active payment method dropdown change
    const methodSelect = document.getElementById('inputPaymentMethod');
    if (methodSelect) {
        methodSelect.addEventListener('change', togglePaymentMethodFields);
        togglePaymentMethodFields(); // trigger initially
    }

    // Load Initial Data
    fetchPaymentDetails();
    fetchDonations();
    fetchInKindDonations();
});

// Toggle visibility of GCash vs Maya configuration inputs inside the modal
function togglePaymentMethodFields() {
    const methodSelect = document.getElementById('inputPaymentMethod');
    const gcashGroup = document.getElementById('gcashFieldsGroup');
    const mayaGroup = document.getElementById('mayaFieldsGroup');

    if (!methodSelect || !gcashGroup || !mayaGroup) {
        return;
    }

    const selectedMethod = (methodSelect.value || 'gcash').toLowerCase();

    if (selectedMethod === 'maya') {
        mayaGroup.classList.remove('hidden');
        gcashGroup.classList.add('hidden');
    } else {
        gcashGroup.classList.remove('hidden');
        mayaGroup.classList.add('hidden');
    }
}

/**
 * Switches between the Cash Donations and In-Kind Donations tabs.
 */
/**
 * Switches between the Cash Donations and In-Kind Donations main tables.
 */
function switchDonationTab(tab) {
    activeTab = tab;
    
    const cashTab = document.getElementById("tabCash");
    const inkindTab = document.getElementById("tabInKind");
    const cashContainer = document.getElementById("cashTableContainer");
    const inkindContainer = document.getElementById("inkindTableContainer");

    if (tab === 'cash') {
        cashTab.className = "flex-1 py-3 px-6 text-sm font-bold rounded-lg border-b-2 border-indigo-600 text-indigo-600 flex items-center justify-center gap-2 transition-all";
        inkindTab.className = "flex-1 py-3 px-6 text-sm font-bold rounded-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 transition-all";
        
        cashContainer.classList.remove("hidden");
        inkindContainer.classList.add("hidden");
    } else {
        inkindTab.className = "flex-1 py-3 px-6 text-sm font-bold rounded-lg border-b-2 border-indigo-600 text-indigo-600 flex items-center justify-center gap-2 transition-all";
        cashTab.className = "flex-1 py-3 px-6 text-sm font-bold rounded-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 transition-all";
        
        inkindContainer.classList.remove("hidden");
        cashContainer.classList.add("hidden");
    }

    // Optional: i-clear o i-retrigger ang filter para sumakto sa napiling tab
    filterDonations();
}

/**
 * Switches between the Cash and In-Kind configuration
 * sections inside the settings modal.
 */
/**
 * Switches between the Cash and In-Kind configuration
 * sections inside the settings modal.
 */
function switchModalConfigTab(type) {
    const modalTabCash = document.getElementById("modalTabCash");
    const modalTabInKind = document.getElementById("modalTabInKind");
    const modalCashSection = document.getElementById("modalCashSection");
    const modalInKindSection = document.getElementById("modalInKindSection");
    const sectionInput = document.getElementById("settingsSection");

    if (type === 'cash') {
        modalTabCash.className = "flex-1 py-2 text-xs font-bold rounded-lg text-indigo-600 bg-white shadow-sm transition-all";
        modalTabInKind.className = "flex-1 py-2 text-xs font-bold rounded-lg text-gray-500 transition-all";
        modalCashSection.classList.remove("hidden");
        modalInKindSection.classList.add("hidden");
        if (sectionInput) sectionInput.value = "cash";
    } else {
        modalTabInKind.className = "flex-1 py-2 text-xs font-bold rounded-lg text-indigo-600 bg-white shadow-sm transition-all";
        modalTabCash.className = "flex-1 py-2 text-xs font-bold rounded-lg text-gray-500 transition-all";
        modalInKindSection.classList.remove("hidden");
        modalCashSection.classList.add("hidden");
        if (sectionInput) sectionInput.value = "inkind";
    }
}

/**
 * Retrieves the organization's payment information
 * and in-kind drop-off details from the server[cite: 5].
 */
/**
 * Retrieves the organization's payment information
 * and in-kind drop-off details from the server.
 *
 * Loads BOTH GCash and Maya information from the database.
 * The active payment method determines what is shown
 * in the account summary.
 */
async function fetchPaymentDetails() {
    try {

        const res = await fetch("/org/payment-info");
        const result = await res.json();

        if (!result.success || !result.data) {
            console.error(
                "Unable to fetch payment details:",
                result.message
            );
            return;
        }

        const data = result.data;

        // =====================================================
        // PAYMENT METHOD
        // =====================================================

        const paymentMethod =
            String(data.payment_method || "gcash")
                .toLowerCase()
                .trim();

        // =====================================================
        // PAYMENT METHOD SELECT
        // =====================================================

        const paymentMethodInput =
            document.getElementById("inputPaymentMethod");

        if (paymentMethodInput) {
            paymentMethodInput.value = paymentMethod;
        }

        // =====================================================
        // SHOW / HIDE PAYMENT FIELDS
        // =====================================================

        if (typeof togglePaymentMethodFields === "function") {
            togglePaymentMethodFields();
        }

        // =====================================================
        // GCASH DATA
        // =====================================================

        const gcashNameInput =
            document.getElementById("inputAccountName");

        const gcashNumberInput =
            document.getElementById("inputAccountNum");

        if (gcashNameInput) {
            gcashNameInput.value =
                data.gcash_name || "";
        }

        if (gcashNumberInput) {
            gcashNumberInput.value =
                data.gcash_number || "";
        }

        // =====================================================
        // MAYA DATA
        // =====================================================

        const mayaNameInput =
            document.getElementById("inputMayaName");

        const mayaNumberInput =
            document.getElementById("inputMayaNum");

        if (mayaNameInput) {
            mayaNameInput.value =
                data.maya_name || "";
        }

        if (mayaNumberInput) {
            mayaNumberInput.value =
                data.maya_number || "";
        }

        // =====================================================
        // CONTACT NUMBER
        // =====================================================

        const phoneInput =
            document.getElementById("inputPhone");

        if (phoneInput) {
            phoneInput.value =
                data.contact_number || "";
        }

        // =====================================================
        // DISPLAY ACTIVE PAYMENT ACCOUNT
        // =====================================================

        const displayAccountName =
            document.getElementById(
                "displayAccountName"
            );

        const displayAccountNum =
            document.getElementById(
                "displayAccountNum"
            );

        if (
            displayAccountName &&
            displayAccountNum
        ) {

            if (paymentMethod === "maya") {

                // ---------------------------------------------
                // MAYA
                // ---------------------------------------------

                displayAccountName.textContent =
                    data.maya_name ||
                    "N/A";

                displayAccountNum.textContent =
                    data.maya_number
                        ? `${data.maya_number} (Maya)`
                        : "No Maya account set";

            } else {

                // ---------------------------------------------
                // GCASH
                // ---------------------------------------------

                displayAccountName.textContent =
                    data.gcash_name ||
                    "N/A";

                displayAccountNum.textContent =
                    data.gcash_number
                        ? `${data.gcash_number} (GCash)`
                        : "No GCash account set";
            }
        }

        // =====================================================
        // GCASH QR
        // =====================================================

        const qrPreview =
            document.getElementById("qrPreview");

        if (qrPreview) {

            if (data.qr_code) {

                qrPreview.src =
                    data.qr_code;

                qrPreview.classList.remove(
                    "hidden"
                );

            } else {

                qrPreview.removeAttribute("src");

                qrPreview.classList.add(
                    "hidden"
                );
            }
        }

        // =====================================================
        // MAYA QR
        // =====================================================

        const mayaQrPreview =
            document.getElementById(
                "mayaQrPreview"
            );

        if (mayaQrPreview) {

            if (data.maya_qr_code) {

                mayaQrPreview.src =
                    data.maya_qr_code;

                mayaQrPreview.classList.remove(
                    "hidden"
                );

            } else {

                mayaQrPreview.removeAttribute(
                    "src"
                );

                mayaQrPreview.classList.add(
                    "hidden"
                );
            }
        }

        // =====================================================
        // IN-KIND INFORMATION
        // =====================================================

        const locationName =
            document.getElementById(
                "inputLocationName"
            );

        const locationAddress =
            document.getElementById(
                "inputLocationAddress"
            );

        const operatingHours =
            document.getElementById(
                "inputOperatingHours"
            );

        const importantNotes =
            document.getElementById(
                "inputImportantNotes"
            );

        if (locationName) {
            locationName.value =
                data.organization_name || "";
        }

        if (locationAddress) {
            locationAddress.value =
                data.dropoff_address || "";
        }

        if (operatingHours) {
            operatingHours.value =
                data.dropoff_hours || "";
        }

        if (importantNotes) {
            importantNotes.value =
                data.dropoff_notes || "";
        }

        // =====================================================
        // SAVE INITIAL STATE
        // =====================================================
        // IMPORTANT:
        // Used by savePaymentDetails() to determine which
        // section was actually changed.
        // =====================================================

        initialPaymentFormState = {

            payment_method:
                paymentMethod,

            gcash_name:
                data.gcash_name || "",

            gcash_number:
                data.gcash_number || "",

            maya_name:
                data.maya_name || "",

            maya_number:
                data.maya_number || "",

            contact_number:
                data.contact_number || "",

            dropoff_address:
                data.dropoff_address || "",

            dropoff_hours:
                data.dropoff_hours || "",

            dropoff_notes:
                data.dropoff_notes || ""
        };

        // =====================================================
        // DEBUG
        // =====================================================

        console.log(
            "Payment details loaded:",
            {
                payment_method:
                    paymentMethod,

                gcash_name:
                    data.gcash_name,

                gcash_number:
                    data.gcash_number,

                maya_name:
                    data.maya_name,

                maya_number:
                    data.maya_number,

                maya_qr_code:
                    data.maya_qr_code,

                dropoff_address:
                    data.dropoff_address
            }
        );

    } catch (error) {

        console.error(
            "fetchPaymentDetails error:",
            error
        );
    }
}
/**
 * Retrieves all cash donations and displays
 * them in the donations table[cite: 5].
 */
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

/**
 * Displays the cash donations in the table
 * with their corresponding details and status[cite: 5].
 */
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
        
        // Dynamic detection para sa Maya at GCash
        const rawMethod = (d.payment_method || d.gateway || d.type || 'gcash').toLowerCase();
        let methodLabel = 'GCASH';
        if (rawMethod.includes('maya') || rawMethod.includes('paymaya')) {
            methodLabel = 'MAYA';
        } else if (rawMethod.includes('gcash')) {
            methodLabel = 'GCASH';
        } else {
            methodLabel = rawMethod.toUpperCase();
        }

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
                    <span class="font-semibold text-gray-900 block">${methodLabel}</span>
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
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    updatePaginationInfo(donations.length);
}

// ==========================
// LOGOUT MODAL LOGIC
// ==========================
const logoutModal = document.getElementById("logoutModal");
const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

function openLogoutModal() {
    if (logoutModal) {
        logoutModal.classList.remove("opacity-0", "pointer-events-none");
        logoutModal.querySelector("div > div").classList.remove("scale-95");
        logoutModal.querySelector("div > div").classList.add("scale-100");
    }
}

function closeLogoutModal() {
    if (logoutModal) {
        logoutModal.classList.add("opacity-0", "pointer-events-none");
        logoutModal.querySelector("div > div").classList.remove("scale-100");
        logoutModal.querySelector("div > div").classList.add("scale-95");
    }
}

if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener("click", closeLogoutModal);
}

if (logoutModal) {
    logoutModal.addEventListener("click", (e) => {
        if (e.target === logoutModal) {
            closeLogoutModal();
        }
    });
}

if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", () => {
        window.location.href = "/logout"; 
    });
}

/**
 * Retrieves all in-kind donations from the server
 * and updates the donation summary[cite: 5].
 */
async function fetchInKindDonations() {
    try {
        const res = await fetch("/org/donations/in-kind");
        const result = await res.json();

        if (result.success) {
            allInKindDonations = result.donations || [];
            
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

/**
 * Displays the list of in-kind donations
 * in the donations table[cite: 5].
 */
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

/**
 * Opens the in-kind donation review modal
 * and displays the selected donation details[cite: 5].
 */
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

/**
 * Closes the in-kind donation review modal[cite: 5].
 */
function closeInKindModal() {
    const modal = document.getElementById("reviewInKindModal");
    modal.classList.add("opacity-0", "pointer-events-none");
    modal.querySelector("div").classList.add("scale-95");
    selectedInKindId = null;
}

/**
 * Displays the rejection section
 * for an in-kind donation[cite: 5].
 */
function showInKindRejectionFlow() {
    document.getElementById("inkindRejectionSection").classList.remove("hidden");
    document.getElementById("inkindInitialActionButtons").classList.add("hidden");
    document.getElementById("inkindRejectionActionButtons").classList.remove("hidden");
    updateInKindRejectionText();
}

/**
 * Hides the in-kind rejection section
 * and restores the default action buttons[cite: 5].
 */
function hideInKindRejectionFlow() {
    document.getElementById("inkindRejectionSection").classList.add("hidden");
    document.getElementById("inkindInitialActionButtons").classList.remove("hidden");
    document.getElementById("inkindRejectionActionButtons").classList.add("hidden");
}

/**
 * Updates the rejection reason message
 * based on the selected rejection option[cite: 5].
 */
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

/**
 * Submits the rejection reason
 * for an in-kind donation[cite: 5].
 */
async function submitInKindRejection() {
    const reasonText = document.getElementById("inkindRejectionReasonText").textContent;
    await updateInKindStatus('Rejected', reasonText);
}

/**
 * Updates the status of the selected
 * in-kind donation[cite: 5].
 */
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

/**
 * Filters cash and in-kind donations
 * based on the search keyword and status[cite: 5].
 */
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

/**
 * Shows or hides the action dropdown menu
 * for the selected cash donation[cite: 5].
 */
function toggleActionDropdown(e, id) {
    e.stopPropagation();
    document.querySelectorAll('.action-dropdown-menu').forEach(menu => {
        if (menu.id !== `actionMenu-${id}`) menu.classList.add('hidden');
    });
    const targetMenu = document.getElementById(`actionMenu-${id}`);
    if (targetMenu) targetMenu.classList.toggle('hidden');
}

/**
 * Updates the pagination information
 * displayed below the donations table[cite: 5].
 */
function updatePaginationInfo(count) {
    const pagInfo = document.getElementById("paginationInfo");
    if (pagInfo) {
        pagInfo.textContent = `Showing 1 to ${count} of ${count} results`;
    }
}

/**
 * Opens the receipt image
 * in a lightbox modal[cite: 5].
 */
function viewReceiptDirect(receiptPathRaw) {
    let fullPath = "https://via.placeholder.com/400x600?text=No+Receipt+Uploaded";
    
    if (receiptPathRaw) {
        fullPath = (receiptPathRaw.startsWith('/') || receiptPathRaw.startsWith('http')) 
            ? receiptPathRaw 
            : `/uploads/receipts/${receiptPathRaw}`;
    }

    const modalImg = document.getElementById("modalReceiptImg");
    const downloadBtn = document.getElementById("downloadReceiptBtn");
    const openBtn = document.getElementById("openReceiptExternal");

    if (modalImg) {
        modalImg.src = fullPath;
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

/**
 * Closes the receipt preview modal[cite: 5].
 */
function closeReceiptModal() {
    const modal = document.getElementById("receiptModal");
    if (modal) {
        modal.classList.add("opacity-0", "pointer-events-none");
        modal.querySelector("div")?.classList.add("scale-95");
    }
}

/**
 * Opens the receipt lightbox
 * from the review modal[cite: 5].
 */
function triggerViewReceiptFromReview() {
    const img = document.getElementById("reviewReceiptImg");
    const rawPath = img?.getAttribute("data-raw-path") || currentReceiptPath || img?.src;

    if (rawPath) {
        viewReceiptDirect(rawPath);
    }
}

/**
 * Opens the cash donation review modal
 * and displays the selected donation details[cite: 5].
 */
function openReviewModal(id) {
    selectedDonationId = id; 
    const donation = allDonations.find(item => (item.cash_donation_id || item.id) == id);
    if (!donation) return;

    closeInKindModal();

    document.getElementById("reviewDonorName").value = donation.donor_name || "N/A";
    document.getElementById("reviewAmount").value = parseFloat(donation.amount || 0).toFixed(2);
    document.getElementById("reviewRefNo").value = donation.reference_number || donation.reference_no || "N/A";
    document.getElementById("reviewMethod").value = (donation.payment_method || 'GCASH').toUpperCase();
    
    let receiptPath = "";
    if (donation.receipt_path) {
        receiptPath = donation.receipt_path.startsWith('/') 
            ? donation.receipt_path 
            : `/uploads/receipts/${donation.receipt_path}`;
    } else {
        receiptPath = "https://via.placeholder.com/400x600?text=No+Receipt+Uploaded";
    }

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
    if (modal) {
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.remove("scale-95");
    }
}

/**
 * Closes the cash donation review modal[cite: 5].
 */
function closeReviewModal() {
    const modal = document.getElementById("reviewDonationModal");
    if (modal) {
        modal.classList.add("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.add("scale-95");
    }
    selectedDonationId = null;
    currentReceiptPath = null;
}

/**
 * Displays the rejection form
 * for a cash donation[cite: 5].
 */
function showRejectionFlow() {
    document.getElementById("rejectionSection").classList.remove("hidden");
    document.getElementById("initialActionButtons").classList.add("hidden");
    document.getElementById("rejectionActionButtons").classList.remove("hidden");
    updateRejectionText();
}

/**
 * Hides the rejection form
 * and restores the default action buttons[cite: 5].
 */
function hideRejectionFlow() {
    document.getElementById("rejectionSection").classList.add("hidden");
    document.getElementById("initialActionButtons").classList.remove("hidden");
    document.getElementById("rejectionActionButtons").classList.add("hidden");
}

/**
 * Updates the rejection message
 * based on the selected reason[cite: 5].
 */
function updateRejectionText() {
    const selectedRadio = document.querySelector('input[name="rejectReason"]:checked');
    const reasonBox = document.getElementById("rejectionReasonText");
    
    if (selectedRadio) {
        const val = selectedRadio.value;
        if (val === "Amount Mismatch") {
            reasonBox.textContent = "Verification failed. There is a mismatch in the reference numbers and a significant discrepancy in the total; the declared amount does not match the amount shown on the receipt.";
        } else if (val === "Blurry/Unreadable Screenshot") {
            reasonBox.textContent = "Verification failed. The uploaded proof of payment image is blurry or unreadable. Please upload a clear screenshot.";
        } else if (val === "Transaction not found in Records.") {
            reasonBox.textContent = "Verification failed. No matching transaction was found in the official account records for the provided reference number.";
        } else {
            reasonBox.textContent = "Verification failed. This transaction appears to be a duplicate submission.";
        }
    }
}

/**
 * Approves and verifies
 * the selected cash donation[cite: 5].
 */
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

/**
 * Rejects the selected cash donation
 * and records the rejection reason[cite: 5].
 */
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

/**
 * Opens the donation settings
 * configuration modal[cite: 5].
 */
function openConfigModal() {
    const modal = document.getElementById('paymentConfigModal');
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.querySelector('div').classList.remove('scale-95');
    }
}

/**
 * Closes the donation settings
 * configuration modal[cite: 5].
 */
function closeConfigModal() {
    const modal = document.getElementById('paymentConfigModal');
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.querySelector('div').classList.add('scale-95');
    }
}

/**
 * Displays a preview of the selected
 * image before uploading[cite: 5].
 */
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

/**
 * Saves the organization's payment
 * information and in-kind drop-off settings[cite: 5].
 */

async function savePaymentDetails(e) {
    e.preventDefault();

    const saveBtn =
        document.getElementById("saveBtn");

    const originalBtnText =
        saveBtn.innerHTML;

    saveBtn.disabled = true;

    saveBtn.innerHTML =
        `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Saving...`;

    try {

        const getValue = (id) =>
            document.getElementById(id)
                ?.value
                ?.trim() || "";

        const current = {

            payment_method:
                getValue(
                    "inputPaymentMethod"
                ),

            gcash_name:
                getValue(
                    "inputAccountName"
                ),

            gcash_number:
                getValue(
                    "inputAccountNum"
                ),

            maya_name:
                getValue(
                    "inputMayaName"
                ),

            maya_number:
                getValue(
                    "inputMayaNum"
                ),

            contact_number:
                getValue(
                    "inputPhone"
                ),

            dropoff_address:
                getValue(
                    "inputLocationAddress"
                ),

            dropoff_hours:
                getValue(
                    "inputOperatingHours"
                ),

            dropoff_notes:
                getValue(
                    "inputImportantNotes"
                )
        };

        // =====================================================
        // CHECK CHANGES
        // =====================================================

        const previous =
            initialPaymentFormState || {};

        const paymentChanged =
            current.payment_method !==
                previous.payment_method ||

            current.gcash_name !==
                previous.gcash_name ||

            current.gcash_number !==
                previous.gcash_number ||

            current.maya_name !==
                previous.maya_name ||

            current.maya_number !==
                previous.maya_number;

        const inkindChanged =
            current.dropoff_address !==
                previous.dropoff_address ||

            current.dropoff_hours !==
                previous.dropoff_hours ||

            current.dropoff_notes !==
                previous.dropoff_notes;

        // =====================================================
        // CHECK QR FILES
        // =====================================================

        const gcashQrChanged =
            document.getElementById(
                "qrCodeInput"
            )?.files?.length > 0;

        const mayaQrChanged =
            document.getElementById(
                "mayaQrCodeInput"
            )?.files?.length > 0;

        const dropoffImageChanged =
            document.getElementById(
                "dropoffImageInput"
            )?.files?.length > 0;

        // =====================================================
        // FINAL SECTION DETECTION
        // =====================================================

        const actualPaymentChanged =
            paymentChanged ||
            gcashQrChanged ||
            mayaQrChanged;

        const actualInKindChanged =
            inkindChanged ||
            dropoffImageChanged;

        // =====================================================
        // SUBMIT
        // =====================================================

        const form =
            document.getElementById(
                "paymentConfigForm"
            );

        const formData =
            new FormData(form);

        const response =
            await fetch(
                "/org/payment-info",
                {
                    method: "POST",
                    body: formData
                }
            );

        const result =
            await response.json();

        if (!result.success) {

            showToast(
                result.message ||
                "Unable to save settings.",
                "error"
            );

            return;
        }

        // =====================================================
        // BUILD REAL CONFIRMATION
        // =====================================================

        const sections = [];

        if (actualPaymentChanged) {

            const method =
                current.payment_method
                    .toLowerCase();

            if (method === "maya") {

                sections.push(
                    "Maya payment information"
                );

            } else {

                sections.push(
                    "GCash payment information"
                );
            }
        }

        if (actualInKindChanged) {

            sections.push(
                "In-Kind donation information"
            );
        }

        // =====================================================
        // SHOW CONFIRMATION
        // =====================================================

        let message;

        if (sections.length === 0) {

            message =
                "No changes were detected.";

        } else if (
            sections.length === 1
        ) {

            message =
                `${sections[0]} saved successfully!`;

        } else {

            message =
                `${sections.join(
                    " and "
                )} saved successfully!`;
        }

        showToast(
            message,
            "success"
        );

        closeConfigModal();

        await fetchPaymentDetails();

    } catch (error) {

        console.error(
            "Save settings error:",
            error
        );

        showToast(
            "An unexpected error occurred while saving.",
            "error"
        );

    } finally {

        saveBtn.disabled = false;

        saveBtn.innerHTML =
            originalBtnText;
    }
}
/**
 * Displays a toast notification
 * to inform the user of the result[cite: 5].
 *
 * @param {string} message - Notification message.
 * @param {string} type - "success" or "error".
 */
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

function toggleExportMenu() {
    document.getElementById("exportMenu").classList.toggle("hidden");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropdown-toggle') && !event.target.closest('.dropdown-toggle')) {
        var exportMenu = document.getElementById("exportMenu");
        if (exportMenu && !exportMenu.classList.contains('hidden')) {
            exportMenu.classList.add('hidden');
        }
    }
}

function toggleDateInput() {
    const filterType = document.getElementById('filterType').value;
    const datePicker = document.getElementById('datePicker');

    if (filterType === 'year') {
        datePicker.type = "number";
        datePicker.placeholder = "YYYY";
        datePicker.value = new Date().getFullYear();
        datePicker.min = "2000";
        datePicker.max = "2100";
    } else {
        datePicker.type = "month";
        datePicker.value = "2026-08";
    }
}

function refreshData() {
    fetchPaymentDetails();
    fetchDonations();
    fetchInKindDonations();
    showToast("Donation list refreshed!", "success");
}

async function exportFile(format) {
    const filterType = document.getElementById('filterType').value;
    const dateValue = document.getElementById('datePicker').value;
    const url = `/org/donations/export?format=${format}&type=${filterType}&date=${dateValue}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = 'There was an issue downloading the file.';
            
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                const errorText = await response.text();
                console.error("Server Error HTML:", errorText);
                errorMessage = `Server Error (${response.status}): Could not find export route or backend error encountered.`;
            }
            throw new Error(errorMessage);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        
        const fileExtension = format === 'excel' ? 'xlsx' : 'pdf';
        a.download = `donations_report_${dateValue}.${fileExtension}`;
        
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        
        showToast(`Report downloaded as ${format.toUpperCase()}!`, 'success');

    } catch (error) {
        console.error(error);
        showToast("Failed to download file: " + error.message, 'error');
    }
}
// Function kapag sine-save ang In-Kind Settings
function saveInKindSettings(event) {
    event.preventDefault(); // Iwasan ang default form submit

    const formData = new FormData();
    
    // Kunin ang value ng location name mula sa input field
    const locationName = document.getElementById('inKindLocationInput').value;
    formData.append('location_name', locationName);

    // Kunin ang file mula sa file input
    const imageFile = document.getElementById('inKindImageInput').files[0];
    if (imageFile) {
        formData.append('donation_image', imageFile); // 'donation_image' ang pangalan na sasuhin ng multer sa backend
    }

    // Ipadala sa backend gamit ang fetch
    fetch('/api/donation-settings/inkind', {
        method: 'POST', // o PUT depende sa route mo
        body: formData
        // TANDAAN: Walang 'Headers' dito para sa Content-Type para hindi masira ang boundary ng FormData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Settings saved successfully!');
            loadInKindSettings(); // Tawagin para mag-update ang UI
        } else {
            alert('Failed to save settings: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error saving settings:', error);
    });
}
// Function para i-load at i-display ang settings sa UI
function loadInKindSettings() {
    fetch('/api/donation-settings/inkind')
    .then(response => response.json())
    .then(data => {
        if (data.success && data.settings) {
            // 1. I-display ang location name sa input o text element
            const locationInput = document.getElementById('inKindLocationInput');
            if (locationInput) {
                locationInput.value = data.settings.location_name || '';
            }

            // 2. I-display ang image sa UI (kung meron)
            const imagePreview = document.getElementById('inKindImagePreview');
            if (imagePreview && data.settings.image_path) {
                imagePreview.src = data.settings.image_path; // Path na galing sa database
                imagePreview.style.display = 'block';
            }
        }
    })
    .catch(error => {
        console.error('Error loading settings:', error);
    });
}

// Tawagin ang function na ito kapag nag-load ang DOM
document.addEventListener('DOMContentLoaded', () => {
    loadInKindSettings();
});
// =====================================================
// ORGANIZATION ANALYTICS - FRONTEND
// =====================================================

let adoptedPetsChart = null;
let availablePetsChart = null;
let cashDonationChart = null;
let inKindDonationChart = null;


// =====================================================
// DOM READY
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    setupAnalyticsFilters();
    loadAnalytics();
});


// =====================================================
// FILTERS
// =====================================================

function setupAnalyticsFilters() {
    const periodSelect = document.getElementById("analyticsPeriodType");
    const dateContainer = document.getElementById("analyticsDateContainer");
    const refreshButton = document.getElementById("refreshAnalyticsBtn");

    if (!periodSelect || !dateContainer) {
        console.error("Analytics filter elements not found.");
        return;
    }

    function renderDateInput() {
        const period = periodSelect.value;

        let inputType = "month";
        let value = new Date().toISOString().slice(0, 7);

        if (period === "day") {
            inputType = "date";
            value = new Date().toISOString().slice(0, 10);
        }

        if (period === "year") {
            inputType = "number";
            value = new Date().getFullYear();
        }

        dateContainer.innerHTML = `
            <input
                id="analyticsDate"
                type="${inputType}"
                value="${value}"
                ${period === "year" ? 'min="2000" max="2100"' : ""}
                class="bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 px-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            >
        `;

        const dateInput = document.getElementById("analyticsDate");

        if (dateInput) {
            dateInput.addEventListener("change", loadAnalytics);
        }
    }

    periodSelect.addEventListener("change", () => {
        renderDateInput();
        loadAnalytics();
    });

    if (refreshButton) {
        refreshButton.addEventListener("click", loadAnalytics);
    }

    renderDateInput();
}


// =====================================================
// LOAD ANALYTICS
// =====================================================

async function loadAnalytics() {
    try {
        const period =
            document.getElementById("analyticsPeriodType")?.value || "month";

        const dateInput =
            document.getElementById("analyticsDate");

        let date = dateInput?.value;

        if (!date) {
            if (period === "year") {
                date = new Date().getFullYear().toString();
            } else if (period === "month") {
                date = new Date().toISOString().slice(0, 7);
            } else {
                date = new Date().toISOString().slice(0, 10);
            }
        }

        const response = await fetch(
            `/org/analytics/data?period=${encodeURIComponent(period)}&date=${encodeURIComponent(date)}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log("Analytics DB response:", data);

        if (!data.success) {
            throw new Error(data.message || "Failed to load analytics.");
        }

        // =================================================
        // UPDATE EVERYTHING
        // =================================================

        updatePetSummary(data.pets);
        updateDonationSummary(data);
        updateAdoptionChart(data);
        updateAvailablePetsChart(data);
        updateCashChart(data);
        updateInKindChart(data);
        updatePeriodLabels(period, date);

    } catch (error) {
        console.error("Analytics loading error:", error);
    }
}


// =====================================================
// PET SUMMARY
// =====================================================

function updatePetSummary(pets) {
    document.getElementById("petAvailable").textContent =
        pets?.available ?? 0;

    document.getElementById("petPending").textContent =
        pets?.pending ?? 0;

    document.getElementById("petAdopted").textContent =
        pets?.adopted ?? 0;

    document.getElementById("petArchived").textContent =
        pets?.archived ?? 0;

    document.getElementById("petTotal").textContent =
        pets?.total ?? 0;

    document.getElementById("availableTotal").textContent =
        pets?.available ?? 0;
}


// =====================================================
// DONATION SUMMARY
// =====================================================

function updateDonationSummary(data) {
    const cashTotal =
        Number(data.cash?.total || 0);

    const inKindTotal =
        Number(data.inKind?.total || 0);

    document.getElementById("summaryCash").textContent =
        `₱${cashTotal.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    document.getElementById("summaryInKind").textContent =
        inKindTotal.toLocaleString("en-PH");

    document.getElementById("cashTotal").textContent =
        `₱${cashTotal.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    document.getElementById("inKindTotal").textContent =
        inKindTotal.toLocaleString("en-PH");

    document.getElementById("adoptedTotal").textContent =
        data.adoptions?.total ?? 0;
}


// =====================================================
// ADOPTION CHART
// =====================================================

function updateAdoptionChart(data) {
    const canvas = document.getElementById("adoptedPetsChart");

    if (!canvas) return;

    const series = data.adoptions?.series || [];

    const labels = series.map(row => row.period_value);
    const values = series.map(row => Number(row.total || 0));

    if (adoptedPetsChart) {
        adoptedPetsChart.destroy();
    }

    adoptedPetsChart = new Chart(canvas, {
        type: "line",

        data: {
            labels,

            datasets: [{
                label: "Approved Adoptions",
                data: values,
                tension: 0.3,
                fill: true,
                borderWidth: 2
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}


// =====================================================
// AVAILABLE PETS BY SPECIES
// =====================================================

function updateAvailablePetsChart(data) {
    const canvas = document.getElementById("availablePetsChart");

    if (!canvas) return;

    const rows = data.availableBySpecies || [];

    const labels = rows.map(row => row.species);
    const values = rows.map(row => Number(row.total || 0));

    if (availablePetsChart) {
        availablePetsChart.destroy();
    }

    availablePetsChart = new Chart(canvas, {
        type: "doughnut",

        data: {
            labels,

            datasets: [{
                label: "Available Pets",
                data: values,
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


// =====================================================
// CASH CHART
// =====================================================

function updateCashChart(data) {
    const canvas = document.getElementById("cashDonationChart");

    if (!canvas) return;

    const series = data.cash?.series || [];

    const labels = series.map(row => row.period_value);
    const values = series.map(row => Number(row.total || 0));

    if (cashDonationChart) {
        cashDonationChart.destroy();
    }

    cashDonationChart = new Chart(canvas, {
        type: "bar",

        data: {
            labels,

            datasets: [{
                label: "Cash Donations",
                data: values,
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// =====================================================
// IN-KIND CHART
// =====================================================

function updateInKindChart(data) {
    const canvas = document.getElementById("inKindDonationChart");

    if (!canvas) return;

    const items = data.inKind?.items || [];

    const labels = items.map(row => row.item_name);
    const values = items.map(row => Number(row.total || 0));

    if (inKindDonationChart) {
        inKindDonationChart.destroy();
    }

    inKindDonationChart = new Chart(canvas, {
        type: "bar",

        data: {
            labels,

            datasets: [{
                label: "Quantity",
                data: values,
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// =====================================================
// PERIOD LABELS
// =====================================================

function updatePeriodLabels(period, date) {
    let label = "For selected month";

    if (period === "day") {
        label = `For ${date}`;
    }

    if (period === "year") {
        label = `For ${date}`;
    }

    if (period === "month") {
        label = `For ${date}`;
    }

    const cashLabel =
        document.getElementById("cashPeriodLabel");

    const inKindLabel =
        document.getElementById("inKindPeriodLabel");

    if (cashLabel) {
        cashLabel.textContent = label;
    }

    if (inKindLabel) {
        inKindLabel.textContent = label;
    }
}
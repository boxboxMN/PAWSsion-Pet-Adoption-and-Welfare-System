// ORGANIZATION ANALYTICS CHARTS
let adoptedPetsChart = null;
let availablePetsChart = null;
let cashDonationChart = null;
let inKindDonationChart = null;

// FORMAT PERIOD LABEL
function getPeriodLabel(period, date) {
    const selectedDate = new Date(`${date}T00:00:00`);
    if (period === "day") {
        return selectedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }
    if (period === "year") {
        return selectedDate.getFullYear().toString();
    }
    return selectedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });
}
// FORMAT DATE LABEL
function formatDateLabel(value) {
    const selectedDate = new Date(`${value}T00:00:00`);

    return selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}
// FORMAT MONTH LABEL
function formatMonthLabel(value) {
    const [year, month] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);

    return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });
}
// GET PERIOD DESCRIPTION
function getPeriodDescription(period) {
    if (period === "day") {
        return "Hourly";
    }
    if (period === "year") {
        return "Monthly";
    }
    return "Daily";
}
// LOAD ANALYTICS
async function loadAnalytics() {
    try {
        const periodElement =
            document.getElementById("analyticsPeriodType");
        const dateElement =
            document.getElementById("analyticsDate");
        const period =
            periodElement?.value || "month";
        const date =
            dateElement?.value ||
            new Date().toISOString().slice(0, 10);
        const response = await fetch(
            `/org/analytics/data?period=${encodeURIComponent(period)}&date=${encodeURIComponent(date)}`
        );
        const data = await response.json();

        console.log("Analytics DB response:", data);

        if (!data.success) {
            throw new Error(
                data.message || "Failed to load analytics."
            );
        }

        // PERIOD LABEL
        const periodLabel =
            getPeriodLabel(data.period, data.date);
        const periodDescription =
            getPeriodDescription(data.period);

        // PET SUMMARY
        document.getElementById("petAvailable").textContent =
            data.pets.available;
        document.getElementById("petPending").textContent =
            data.pets.pending;
        document.getElementById("petAdopted").textContent =
            data.pets.adopted;
        document.getElementById("petArchived").textContent =
            data.pets.archived;
        document.getElementById("petTotal").textContent =
            data.pets.total;

        // CASH SUMMARY
        const cashTotal =
            Number(data.cash.total || 0);
        document.getElementById("summaryCash").textContent =
            `₱${cashTotal.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        document.getElementById("cashTotal").textContent =
            `₱${cashTotal.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        document.getElementById("cashPeriodLabel").textContent =
            `${periodLabel} — Approved donations`;
        document.getElementById("cashPeriodLabelChart").textContent =
            periodLabel;

        // IN-KIND SUMMARY
        const inKindTotal =
            Number(data.inKind.totalQuantity || 0);
        document.getElementById("summaryInKind").textContent =
            inKindTotal.toLocaleString();
        document.getElementById("inKindTotal").textContent =
            inKindTotal.toLocaleString();
        document.getElementById("inKindPeriodLabel").textContent =
            `${periodLabel} — Approved donations`;
        document.getElementById("inKindPeriodLabelChart").textContent =
            periodLabel;

        // ADOPTION TOTAL
        const adoptionTotal =
            Number(data.adoptions.total || 0);
        document.getElementById("adoptedTotal").textContent =
            adoptionTotal;
        document.getElementById("adoptionPeriodLabel").textContent =
            periodLabel;

        // AVAILABLE PET TOTAL
        document.getElementById("availableTotal").textContent =
            data.pets.available;
        document.getElementById("availablePetsSubtitle").textContent =
            `Current available pets — ${periodLabel}`;

        // CHART SUBTITLES
        document.getElementById("adoptionChartSubtitle").textContent =
            `${periodLabel} — ${periodDescription} approved adoptions`;
        document.getElementById("cashChartSubtitle").textContent =
            `${periodLabel} — ${periodDescription} approved cash donations`;
        document.getElementById("inKindChartSubtitle").textContent =
            `${periodLabel} — ${periodDescription} approved in-kind donations`;

        // DRAW CHART
        createAdoptionChart(
            data,
            periodLabel,
            periodDescription
        );
        createAvailablePetsChart(
            data
        );
        createCashChart(
            data,
            periodLabel,
            periodDescription
        );
        createInKindChart(
            data,
            periodLabel,
            periodDescription
        );
    } catch (error) {
        console.error(
            "Analytics loading error:",
            error
        );
    }
}

// ADOPTION BAR CHART
function createAdoptionChart(
    data,
    periodLabel,
    periodDescription
) {
    const canvas =
        document.getElementById("adoptedPetsChart");
    if (!canvas) return;
    if (adoptedPetsChart) {
        adoptedPetsChart.destroy();
    }

    const chartData =
        data.adoptions.chart || [];
    const labels = chartData.map(item => {
        if (data.period === "month") {
            return formatDateLabel(item.label);
        }

        if (data.period === "year") {
            return formatMonthLabel(item.label);
        }

        return item.label;
    });
    const values =
        chartData.map(item => Number(item.total || 0));

    adoptedPetsChart =
        new Chart(canvas, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Approved adoptions",
                    data: values,
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            title: function(items) {
                                return items[0].label;
                            },
                            label: function(context) {
                                return ` Approved adoptions: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text:
                                data.period === "day"
                                    ? "Hour"
                                    : data.period === "year"
                                        ? "Month"
                                        : "Day"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        },
                        title: {
                            display: true,
                            text: "Number of approved adoptions"
                        }
                    }
                }
            }
        });
}

// AVAILABLE PETS DOUGHNUT
function createAvailablePetsChart(data) {
    const canvas =
        document.getElementById("availablePetsChart");
    if (!canvas) return;
    if (availablePetsChart) {
        availablePetsChart.destroy();
    }

    const speciesData =
    data.availableBySpecies || [];
    const labels =
        speciesData.map(item => item.species);
    const values =
        speciesData.map(item => Number(item.total || 0));

    availablePetsChart =
        new Chart(canvas, {
            type: "doughnut",
            data: {
                labels,
                datasets: [{
                    label: "Available pets",
                    data: values,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw} pets`;
                            }
                        }
                    }
                }
            }
        });
}

// CASH BAR CHART
function createCashChart(
    data,
    periodLabel,
    periodDescription
) {
    const canvas =
        document.getElementById("cashDonationChart");
    if (!canvas) return;
    if (cashDonationChart) {
        cashDonationChart.destroy();
    }

    const chartData =
        data.cash.chart || [];
    const labels = chartData.map(item => {
        if (data.period === "month") {
            return formatDateLabel(item.label);
        }

        if (data.period === "year") {
            return formatMonthLabel(item.label);
        }

        return item.label;
    });
    const values =
        chartData.map(item => Number(item.total || 0));

    cashDonationChart =
        new Chart(canvas, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Approved cash donations (₱)",
                    data: values,
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ₱${Number(context.raw).toLocaleString("en-PH", {
                                    minimumFractionDigits: 2
                                })}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text:
                                data.period === "day"
                                    ? "Hour"
                                    : data.period === "year"
                                        ? "Month"
                                        : "Day"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Amount (₱)"
                        }
                    }
                }
            }
        });
}
// =====================================================
// IN-KIND BAR CHART
// =====================================================
function createInKindChart(
    data,
    periodLabel,
    periodDescription
) {
    const canvas =
        document.getElementById("inKindDonationChart");
    if (!canvas) return;
    if (inKindDonationChart) {
        inKindDonationChart.destroy();
    }

    const chartData =
        data.inKind.chart || [];
    const labels = chartData.map(item => {
        if (data.period === "month") {
            return formatDateLabel(item.label);
        }

        if (data.period === "year") {
            return formatMonthLabel(item.label);
        }

        return item.label;
    });
    const values =
        chartData.map(item => Number(item.quantity || 0));

    inKindDonationChart =
        new Chart(canvas, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Approved donated quantity",
                    data: values,
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` Quantity: ${context.raw}`;
                            }
                        }
                    }
                },

                scales: {
                    x: {
                        title: {
                            display: true,
                            text:
                                data.period === "day"
                                    ? "Hour"
                                    : data.period === "year"
                                        ? "Month"
                                        : "Day"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        },
                        title: {
                            display: true,
                            text: "Quantity"
                        }
                    }
                }
            }
        });
}
// =====================================================
// INITIALIZE
// =====================================================
document.addEventListener(
    "DOMContentLoaded",
    () => {
        const periodSelect =
            document.getElementById("analyticsPeriodType");
        const dateContainer =
            document.getElementById("analyticsDateContainer");
        function createDateInput() {
            const period =
                periodSelect.value;
            let inputType = "month";
            let value =
                new Date().toISOString().slice(0, 7);

            if (period === "day") {
                inputType = "date";
                value =
                    new Date().toISOString().slice(0, 10);
            }

            else if (period === "year") {
                inputType = "number";
                value =
                    new Date().getFullYear();
            }

            dateContainer.innerHTML = `
                <input
                    id="analyticsDate"
                    type="${inputType}"
                    value="${value}"
                    ${inputType === "number"
                        ? `min="2000" max="2100"`
                        : ""
                    }
                    class="bg-white border border-gray-200
                           text-gray-700 text-sm font-semibold
                           py-2.5 px-4 rounded-xl shadow-sm
                           focus:outline-none focus:ring-2
                           focus:ring-blue-100
                           focus:border-blue-400"
                >
            `;
        }
        createDateInput();
        periodSelect.addEventListener(
            "change",
            () => {
                createDateInput();
                loadAnalytics();
            }
        );

        document
            .getElementById("refreshAnalyticsBtn")
            ?.addEventListener(
                "click",
                () => {
                    loadAnalytics();
                }
            );

        dateContainer.addEventListener(
            "change",
            () => {
                loadAnalytics();
            }
        );
        loadAnalytics();
    }
);
// =====================================================
// ANALYTICS EXPORT
// =====================================================

// FORMAT CURRENT ANALYTICS PERIOD
function getExportPeriodLabel() {
    const period =
        document.getElementById("analyticsPeriodType")?.value || "year";

    const date =
        document.getElementById("analyticsDate")?.value ||
        new Date().getFullYear().toString();

    if (period === "day") {
        const selectedDate = new Date(`${date}T00:00:00`);

        return selectedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }

    if (period === "month") {
        const [year, month] = date.split("-");

        const selectedDate =
            new Date(Number(year), Number(month) - 1, 1);

        return selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });
    }

    return date;
}

// GET CURRENT ANALYTICS SUMMARY
function getAnalyticsExportData() {
    const period =
        document.getElementById("analyticsPeriodType")?.value || "year";
    const periodLabel =
        getExportPeriodLabel();
    return {
        period,
        periodLabel,

        pets: {
            available:
                document.getElementById("petAvailable")?.textContent || "0",
            pending:
                document.getElementById("petPending")?.textContent || "0",
            adopted:
                document.getElementById("petAdopted")?.textContent || "0",
            archived:
                document.getElementById("petArchived")?.textContent || "0",
            total:
                document.getElementById("petTotal")?.textContent || "0"
        },

        cash:
            document.getElementById("summaryCash")?.textContent || "₱0.00",
        inKind:
            document.getElementById("summaryInKind")?.textContent || "0",
        adoptionTotal:
            document.getElementById("adoptedTotal")?.textContent || "0",
        availableTotal:
            document.getElementById("availableTotal")?.textContent || "0"
    };
}
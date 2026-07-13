// Shared options para hindi paulit-ulit ang code
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right', // Dinala lahat ng legend sa kanan
            labels: {
                boxWidth: 12,
                font: { size: 12 }
            }
        }
    }
};

// CHART 1: Number of Adopted Pets
new Chart(document.getElementById('adoptedPetsChart').getContext('2d'), {
    type: 'pie',
    data: {
        labels: ['Dog (44 | 56.4%)', 'Cat (34 | 43.6%)'],
        datasets: [{
            data: [44, 34],
            backgroundColor: ['#1d4ed8', '#15803d'] // Blue at Green base sa pic mo
        }]
    },
    options: commonOptions
});

// CHART 2: Available Pets by Type
new Chart(document.getElementById('availablePetsChart').getContext('2d'), {
    type: 'pie',
    data: {
        labels: ['Dog (33 | 63.5%)', 'Cat (19 | 36.6%)'],
        datasets: [{
            data: [33, 19],
            backgroundColor: ['#f59e0b', '#1d4ed8'] // Orange at Blue
        }]
    },
    options: commonOptions
});

// CHART 3: Cash Donation by Payment Method
new Chart(document.getElementById('cashDonationChart').getContext('2d'), {
    type: 'pie',
    data: {
        labels: ['Gcash (7,000 | 66.4%)', 'Others (3,000 | 34.6%)'],
        datasets: [{
            data: [7000, 3000],
            backgroundColor: ['#1d4ed8', '#f59e0b'] // Blue at Orange
        }]
    },
    options: commonOptions
});

// CHART 4: In-Kind Donation by Items
new Chart(document.getElementById('inKindDonationChart').getContext('2d'), {
    type: 'pie',
    data: {
        labels: ['Pet Food (5 sacks)', 'Blanket and Bedding (27 Sheets)', 'Toys (33 pcs.)', 'Treats (30 packs)', 'Others (3)'],
        datasets: [{
            data: [5, 27, 33, 30, 3],
            backgroundColor: ['#1d4ed8', '#15803d', '#e11d48', '#facc15', '#cbd5e1'] // Multi-color slice
        }]
    },
    options: commonOptions
});
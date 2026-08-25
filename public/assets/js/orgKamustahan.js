let allUpdatesData = [];
    let currentTab = 'active'; 
    let currentSortOrder = 'desc'; 
    let currentView = 'table';
    let currentDate = new Date();

    document.addEventListener("DOMContentLoaded", async () => {
        if (typeof loadTopbar === "function") {
            await loadTopbar({ title: "Kamustahan", subtitle: "" });
        }
        if (typeof loadSidebar === "function") {
            await loadSidebar("dashboard");
        }

        await fetchKamustahanData();

        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                filterAndRenderTable();
            });
        }

        const tabs = document.querySelectorAll(".flex.items-center.gap-8.border-b button");
        if(tabs.length >= 2) {
            tabs[0].addEventListener("click", () => {
                currentTab = 'active';
                tabs[0].className = "text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 px-1 transition-colors";
                tabs[1].className = "text-sm font-medium text-gray-500 hover:text-gray-800 pb-3 px-1 transition-colors";
                filterAndRenderTable();
            });
            tabs[1].addEventListener("click", () => {
                currentTab = 'archive';
                tabs[1].className = "text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 px-1 transition-colors";
                tabs[0].className = "text-sm font-medium text-gray-500 hover:text-gray-800 pb-3 px-1 transition-colors";
                filterAndRenderTable();
            });
        }

        const sortButton = document.querySelector("button:has(.fa-arrows-up-down)");
        if(sortButton) {
            sortButton.addEventListener("click", () => {
                currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
                sortButton.innerHTML = `<i class="fa-solid fa-arrows-up-down text-gray-400 text-xs"></i> Sort (${currentSortOrder.toUpperCase()})`;
                filterAndRenderTable();
            });
        }
    });

    function switchView(view) {
        currentView = view;
        const tableContainer = document.getElementById('tableViewContainer');
        const calendarContainer = document.getElementById('calendarViewContainer');
        const tableBtn = document.getElementById('switchToTableBtn');
        const calendarBtn = document.getElementById('switchToCalendarBtn');

        if (view === 'table') {
            tableContainer.classList.remove('hidden');
            calendarContainer.classList.add('hidden');
            tableBtn.className = "px-3 py-1.5 text-xs font-semibold bg-white text-blue-600 rounded-lg shadow-xs transition-all";
            calendarBtn.className = "px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-all";
        } else {
            tableContainer.classList.add('hidden');
            calendarContainer.classList.remove('hidden');
            calendarBtn.className = "px-3 py-1.5 text-xs font-semibold bg-white text-blue-600 rounded-lg shadow-xs transition-all";
            tableBtn.className = "px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-all";
            renderCalendar();
        }
    }

    function changeMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        renderCalendar();
    }

    function renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const monthYearLabel = document.getElementById('calendarMonthYear');
        if (!calendarGrid) return;

        calendarGrid.innerHTML = "";

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthYearLabel.textContent = `${monthNames[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = "h-28 bg-gray-50/50 rounded-xl border border-dashed border-gray-100";
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= totalDays; day++) {
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            const dateString = `${year}-${formattedMonth}-${formattedDay}`;

            const dayCell = document.createElement('div');
            dayCell.className = "h-28 bg-white border border-gray-200 rounded-xl p-2 overflow-y-auto flex flex-col justify-between transition-all hover:border-blue-300";

            const scheduledItems = (typeof allUpdatesData !== 'undefined' ? allUpdatesData : []).filter(item => {
                const rawDate = item.scheduled_date ? item.scheduled_date.split('T')[0] : '';
                return rawDate === dateString && item.is_archived != 1;
            });

            let eventsHtml = '';
            scheduledItems.forEach(item => {
                eventsHtml += `
                    <div onclick='openUpdateModal(${JSON.stringify(item)})' class="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium p-1 rounded-md mb-1 cursor-pointer truncate hover:bg-amber-100 transition-colors" title="Pet: ${item.pet_name} | Adopter: ${item.adopter_name}">
                        <i class="fa-regular fa-clock mr-1"></i> ${item.pet_name} (${item.adopter_name})
                    </div>
                `;
            });

            dayCell.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-gray-700">${day}</span>
                    ${scheduledItems.length > 0 ? `<span class="w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">${scheduledItems.length}</span>` : ''}
                </div>
                <div class="mt-1 flex-1 overflow-y-auto">
                    ${eventsHtml}
                </div>
            `;

            calendarGrid.appendChild(dayCell);
        }
    }

function exportData(type) {
    const monthFilter = document.getElementById("exportMonthFilter") ? document.getElementById("exportMonthFilter").value : "";
    
    let dataToExport = (typeof allUpdatesData !== 'undefined' ? allUpdatesData : []).filter(item => {
        const isArchived = item.is_archived == 1;
        const matchesTab = currentTab === 'archive' ? isArchived : !isArchived;
        
        let matchesMonth = true;
        if (monthFilter) {
            const itemDate = item.update_date || item.scheduled_date || "";
            matchesMonth = itemDate.startsWith(monthFilter);
        }
        
        return matchesTab && matchesMonth;
    });

    if (dataToExport.length === 0) {
        alert("No data found for the selected month and category.");
        return;
    }

    if (type === 'csv') {
        let csvContent = "data:text/csv;charset=utf-8,Pet Name,Adopter,Date\n";
        
        dataToExport.forEach(item => {
            let pet = (item.pet_name || "").replace(/,/g, "");
            let adopter = (item.adopter_name || "").replace(/,/g, "");
            let date = (item.formatted_date || item.scheduled_date || "").replace(/,/g, "");
            csvContent += `${pet},${adopter},${date}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `kamustahan_${currentTab}_reports.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } else if (type === 'pdf') {
        if (typeof html2pdf === 'undefined') {
            alert("The PDF library has not been included yet.");
            return;
        }
        renderPrintableReport(dataToExport);
        downloadKamustahanPDF();
    }
    
    const dropdownMenu = document.getElementById('exportDropdownMenu');
    if (dropdownMenu) {
        dropdownMenu.classList.add('hidden');
    }
}
function renderPrintableReport(data) {
    let printContainer = document.getElementById('printableReport');
    if (!printContainer) return;

    // Helper function to format raw dates into a clean, readable format (e.g., August 26, 2026)
    function cleanDate(dateString) {
        if (!dateString) return 'N/A';
        // If it's already a formatted string and doesn't look like an ISO date, return as is
        const parsedDate = new Date(dateString);
        if (isNaN(parsedDate.getTime())) {
            return dateString; 
        }
        return parsedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    let html = `
        <div class="hidden print:block mb-6 text-center">
            <h1 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0;">PAWSSION BENEVOLENCE CIRCLE</h1>
            <p style="font-size: 13px; color: #4b5563; margin: 4px 0 15px 0;">Adopted Pets Kamustahan Report</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 15px;">
        </div>
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">
            <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                    <th style="padding: 10px; color: #334155; text-transform: uppercase; font-size: 11px;">Pets</th>
                    <th style="padding: 10px; color: #334155; text-transform: uppercase; font-size: 11px;">Adopter</th>
                    <th style="padding: 10px; color: #334155; text-transform: uppercase; font-size: 11px;">Date</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(item => {
        const petName = item.pet_name || 'N/A';
        const adopterName = item.adopter_name || 'N/A';
        
        // Get raw date and format it cleanly
        const rawDate = item.formatted_date || item.formatted_scheduled_date || item.scheduled_date || '';
        const dateVal = cleanDate(rawDate);
        
        // Resolve pet image URL
        let displayPhoto = "";
        if (item.update_photos) {
            try {
                let parsed = JSON.parse(item.update_photos);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    displayPhoto = parsed[0];
                }
            } catch (e) { 
                displayPhoto = item.update_photos; 
            }
            if (displayPhoto && !displayPhoto.startsWith('http') && !displayPhoto.startsWith('/')) {
                displayPhoto = `/uploads/${displayPhoto}`;
            }
        } else if (item.pet_image) {
            displayPhoto = item.pet_image;
            if (displayPhoto && !displayPhoto.startsWith('http') && !displayPhoto.startsWith('/')) {
                displayPhoto = `/uploads/pets/${displayPhoto}`;
            }
        } else if (item.photo) {
            displayPhoto = item.photo;
        }

        html += `
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px; vertical-align: middle;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${displayPhoto ? `<img src="${displayPhoto}" crossorigin="anonymous" style="width: 45px; height: 45px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0;" />` : `<div style="width: 45px; height: 45px; border-radius: 8px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #64748b;">No Img</div>`}
                        <span style="font-weight: 600; color: #1e293b;">${petName}</span>
                    </div>
                </td>
                <td style="padding: 10px; vertical-align: middle; color: #475569;">${adopterName}</td>
                <td style="padding: 10px; vertical-align: middle; color: #475569;">${dateVal}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    printContainer.innerHTML = html;
}
function downloadKamustahanPDF() {
    const element = document.getElementById('printableReport'); 

    if (!element) {
        alert("No report container found for download.");
        return;
    }

    const options = {
        margin:       10,
        filename:     'Kamustahan-Report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save()
        .then(() => {
            console.log("PDF downloaded successfully!");
            // Restore the normal UI table view after downloading
            if (typeof filterAndRenderTable === 'function') {
                filterAndRenderTable();
            }
        })
        .catch(err => {
            console.error("Error downloading PDF:", err);
            alert("There was a problem downloading the PDF.");
        });
}

function exportSingleKamustahan() {
    const petNameElement = document.getElementById('modalPetName');
    const photoElement = document.getElementById('modalPhoto');
    const adopterElement = document.getElementById('modalAdopter');
    const dateElement = document.getElementById('modalDate');

    if (!petNameElement || !photoElement) {
        alert("May kulang na element sa modal mo.");
        return;
    }

    const petName = petNameElement.innerText;
    const photoSrc = photoElement.src;
    const adopterRaw = adopterElement ? adopterElement.innerText : '';
    const dateRaw = dateElement ? dateElement.innerText : '';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Naka-block ang pop-up window ng iyong browser. Paki-allow po ito.");
        return;
    }

    printWindow.document.write(`
        <html>
            <head>
                <title>Kamustahan Report - ${petName}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 30px;
                        text-align: center;
                    }
                    .report-container {
                        max-width: 700px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .image-wrapper {
                        width: 100%;
                        height: 400px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #f9fafb;
                        margin-bottom: 20px;
                    }
                    .image-wrapper img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                    }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <h2>Kamustahan Report: ${petName}</h2>
                    <div class="image-wrapper">
                        <img id="printImage" src="${photoSrc}" crossorigin="anonymous" alt="Pet Photo">
                    </div>
                    <p><strong>${adopterRaw}</strong></p>
                    <p><strong>${dateRaw}</strong></p>
                </div>
                <script>
                    const img = document.getElementById('printImage');
                    img.onload = function() {
                        setTimeout(() => {
                            window.print();
                        }, 300);
                    };
                    img.onerror = function() {
                        setTimeout(() => {
                            window.print();
                        }, 300);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}
    async function fetchKamustahanData() {
        try {
            const response = await fetch("/org/kamustahan-updates");
            const result = await response.json();

            if (result.success && result.updates) {
                allUpdatesData = result.updates;
                filterAndRenderTable();
                updateStatistics(allUpdatesData);
            } else {
                document.getElementById("updatesTableBody").innerHTML = `
                    <tr><td colspan="5" class="text-center py-8 text-gray-400 italic">No updates found in database.</td></tr>
                `;
            }
        } catch (error) {
            console.error("Error fetching updates:", error);
            document.getElementById("updatesTableBody").innerHTML = `
                <tr><td colspan="5" class="text-center py-8 text-red-400 italic">Failed to connect to database server.</td></tr>
            `;
        }
    }

    function filterAndRenderTable() {
        const searchInputEl = document.getElementById("searchInput");
        const searchQuery = searchInputEl ? (searchInputEl.value || "").toLowerCase() : "";

        let filtered = allUpdatesData.filter(item => {
            const isArchived = item.is_archived == 1;
            const matchesTab = currentTab === 'archive' ? isArchived : !isArchived;

            const petName = (item.pet_name || "").toLowerCase();
            const adopterName = (item.adopter_name || "").toLowerCase();
            const matchesSearch = petName.includes(searchQuery) || adopterName.includes(searchQuery);

            return matchesTab && matchesSearch;
        });

        filtered.sort((a, b) => {
            let nameA = (a.pet_name || "").toLowerCase();
            let nameB = (b.pet_name || "").toLowerCase();
            if (currentSortOrder === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });

        renderTable(filtered);
    }

  function renderTable(data) {
        const tbody = document.getElementById("updatesTableBody");
        if (!tbody) return;
        tbody.innerHTML = "";

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-gray-400 italic">No matching records found.</td></tr>`;
            const paginationInfo = document.getElementById("tablePaginationInfo");
            if (paginationInfo) paginationInfo.textContent = "Showing 0 results";
            return;
        }

        data.forEach((item) => {
            let displayPhoto = "https://images.unsplash.com/photo-1543466835-00a7907e9de1";
            
            if (item.update_photos) {
                try {
                    let parsed = JSON.parse(item.update_photos);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        displayPhoto = parsed[0];
                    }
                } catch (e) { 
                    displayPhoto = item.update_photos; 
                }
                if (!displayPhoto.startsWith('http') && !displayPhoto.startsWith('/')) {
                    displayPhoto = `/uploads/${displayPhoto}`;
                }
            } else if (item.pet_image) {
                displayPhoto = item.pet_image;
                if (!displayPhoto.startsWith('http') && !displayPhoto.startsWith('/')) {
                    displayPhoto = `/uploads/pets/${displayPhoto}`;
                }
            }

            let statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100"><i class="fa-solid fa-check text-[10px]"></i> Updated</span>`;

            if (item.update_status === 'For Update' || !item.formatted_date) {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    <i class="fa-regular fa-clock text-[10px]"></i> For Update
                </span>`;
            } else if (item.update_status === 'Archived' || item.is_archived == 1) {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                    <i class="fa-solid fa-box-archive text-[10px]"></i> Archived
                </span>`;
            }

            // Kompaktong Action Buttons na hindi sumisira sa layout ng Active at Archive tabs
            let actionButtons = `
                <button onclick='openUpdateModal(${JSON.stringify(item)})' class="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 flex items-center gap-1 transition-colors ${item.is_archived == 1 ? '' : 'border-r border-slate-200'}" title="View Details">
                    <i class="fa-regular fa-eye text-[11px]"></i> View
                </button>
            `;

            if (item.is_archived != 1) {
                actionButtons += `
                    <button onclick='openScheduleModal(${item.update_id})' class="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-amber-600 hover:bg-slate-50 flex items-center gap-1 transition-colors" title="Set Schedule">
                        <i class="fa-regular fa-calendar-days text-[11px]"></i> Schedule
                    </button>
                `;
            }

            const row = document.createElement("tr");
            row.className = "hover:bg-slate-50/60 transition-colors";
            
            row.innerHTML = `
                <td class="py-4 px-3 align-middle">
                    <div class="flex items-center gap-3">
                        <img src="${displayPhoto}" alt="${item.pet_name}" class="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                        <div>
                            <span class="font-semibold text-slate-900 block text-sm">${item.pet_name || 'Unnamed Pet'}</span>
                            <span class="text-xs text-slate-400 font-medium block mt-0.5">${item.species || 'Pet'}</span>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-3 align-middle">
                    <span class="font-semibold text-slate-900 block text-sm">${item.adopter_name || 'Adopter'}</span>
                    <span class="text-xs text-slate-400 block mt-0.5">${item.adopter_email || ''}</span>
                </td>
                <td class="py-4 px-3 align-middle">
                    <span class="font-medium text-slate-800 block text-sm">${item.formatted_date || item.formatted_scheduled_date || item.scheduled_date || 'N/A'}</span>
                    <span class="text-xs text-slate-400 block mt-0.5">${item.formatted_date ? 'Submitted Update' : 'Scheduled Date'}</span>
                </td>
                <td class="py-4 px-3 align-middle">${statusBadge}</td>
                <td class="py-4 px-3 align-middle text-right pr-4 whitespace-nowrap">
                    <div class="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden align-middle">
                        ${actionButtons}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        const paginationInfo = document.getElementById("tablePaginationInfo");
        if (paginationInfo) paginationInfo.textContent = `Showing 1 to ${data.length} of ${data.length} results`;
    }
    function exportSingleKamustahan() {
    const petNameElement = document.getElementById('modalPetName');
    const photoElement = document.getElementById('modalPhoto');
    const adopterElement = document.getElementById('modalAdopter');
    const dateElement = document.getElementById('modalDate');

    if (!petNameElement || !photoElement) {
        alert("May kulang na element sa modal mo.");
        return;
    }

    const petName = petNameElement.innerText;
    const photoSrc = photoElement.src;
    const adopterRaw = adopterElement ? adopterElement.innerText : '';
    const dateRaw = dateElement ? dateElement.innerText : '';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Naka-block ang pop-up window ng iyong browser. Paki-allow po ito.");
        return;
    }

    printWindow.document.write(`
        <html>
            <head>
                <title>Kamustahan Report - ${petName}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 30px;
                        text-align: center;
                    }
                    .report-container {
                        max-width: 700px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .image-wrapper {
                        width: 100%;
                        height: 400px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #f9fafb;
                        margin-bottom: 20px;
                    }
                    .image-wrapper img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                    }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <h2>Kamustahan Report: ${petName}</h2>
                    <div class="image-wrapper">
                        <img src="${photoSrc}" alt="Pet Photo">
                    </div>
                    <p><strong>${adopterRaw}</strong></p>
                    <p><strong>${dateRaw}</strong></p>
                </div>
                <script>
                    // Otomatikong magbubukas ang print/save dialog kapag na-load ang image
                    window.onload = function() {
                        setTimeout(() => {
                            window.print();
                        }, 500);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

    function openUpdateModal(item) {
        const modal = document.getElementById("updateModal");
        const modalPetName = document.getElementById("modalPetName");
        const modalPhoto = document.getElementById("modalPhoto");
        const modalText = document.getElementById("modalText");
        const modalAdopter = document.getElementById("modalAdopter");
        const modalDate = document.getElementById("modalDate");
        const modalActionContainer = document.getElementById("modalActionContainer");

        if (modalPetName) modalPetName.textContent = `Kamustahan: ${item.pet_name || 'Pet'}`;
        
        let photoUrl = "https://images.unsplash.com/photo-1543466835-00a7907e9de1";
        
        if (item.update_photos) {
            try {
                let parsed = JSON.parse(item.update_photos);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    photoUrl = parsed[0];
                }
            } catch (e) { 
                photoUrl = item.update_photos; 
            }
            if (!photoUrl.startsWith('http') && !photoUrl.startsWith('/')) {
                photoUrl = `/uploads/${photoUrl}`;
            }
        } else if (item.pet_image) {
            photoUrl = item.pet_image;
            if (!photoUrl.startsWith('http') && !photoUrl.startsWith('/')) {
                photoUrl = `/uploads/pets/${photoUrl}`;
            }
        }

        if (modalPhoto) modalPhoto.src = photoUrl;
        if (modalText) modalText.textContent = item.update_text || "No message provided by the adopter."; 
        if (modalAdopter) modalAdopter.textContent = `Adopter: ${item.adopter_name || 'N/A'}`;
        if (modalDate) modalDate.textContent = `Date: ${item.formatted_date || item.formatted_scheduled_date || 'N/A'}`;

            
        if (modalActionContainer) {
            if (item.is_archived == 1) {
                // Tinanggal na ang restore button, papalitan na lang ng status o magiging blangko
                modalActionContainer.innerHTML = `
                    <span class="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-2 rounded-xl border border-gray-200">
                        <i class="fa-solid fa-box-archive mr-1"></i> Archived Item
                    </span>
                `;
            } else {
                if (item.update_status === 'For Update' || !item.formatted_date) {
                    modalActionContainer.innerHTML = `
                        <span class="text-xs text-amber-600 font-medium bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
                            <i class="fa-regular fa-clock mr-1"></i> Available to archive once updated
                        </span>
                    `;
                } else {
                    modalActionContainer.innerHTML = `
                        <button onclick='archiveUpdate(${item.update_id})' class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">
                            <i class="fa-solid fa-box-archive"></i> Archive
                        </button>
                    `;
                }
            }
        }
        if (modal) modal.classList.remove("hidden");
    }

    function closeUpdateModal() {
        const modal = document.getElementById("updateModal");
        if (modal) modal.classList.add("hidden");
    }

    async function archiveUpdate(update_id) {
        if(confirm("Are you sure you want to archive this update?")) {
            try {
                const res = await fetch('/org/kamustahan-archive', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ update_id })
                });
                const data = await res.json();
                if(data.success) {
                    closeUpdateModal();
                    fetchKamustahanData();
                } else {
                    alert(data.message || "Failed to archive update.");
                }
            } catch (err) {
                console.error("Error archiving update:", err);
            }
        }
    }

    function updateStatistics(data) {
        const total = data.filter(i => i.is_archived != 1).length;
        const forUpdateCount = data.filter(i => i.update_status === 'For Update' && i.is_archived != 1).length;
        const updatedCount = data.filter(i => i.update_status !== 'For Update' && i.formatted_date && i.is_archived != 1).length;

        const statTotalPets = document.getElementById("statTotalPets");
        const statUpdated = document.getElementById("statUpdated");
        const statForUpdate = document.getElementById("statForUpdate");

        if (statTotalPets) statTotalPets.textContent = total;
        if (statUpdated) statUpdated.textContent = updatedCount;
        if (statForUpdate) statForUpdate.textContent = forUpdateCount; 
    }

    function openScheduleModal(updateId) {
    const schedUpdateIdInput = document.getElementById("schedUpdateId");
    const scheduleModal = document.getElementById("scheduleModal");
    const dateInput = document.getElementById("scheduledDateInput");

    if (schedUpdateIdInput) schedUpdateIdInput.value = updateId;

    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    if (dateInput) {
        // Set the minimum selectable date to today
        dateInput.setAttribute('min', today);
        // Optional: Set default value to today for convenience
        dateInput.value = today;
    }

    if (scheduleModal) scheduleModal.classList.remove("hidden");
}

    function closeScheduleModal() {
        const scheduleModal = document.getElementById("scheduleModal");
        if (scheduleModal) scheduleModal.classList.add("hidden");
    }

    function submitSchedule(event) {
    event.preventDefault();
    const update_id = document.getElementById("schedUpdateId").value;
    const scheduled_date = document.getElementById("scheduledDateInput").value;

    // Double-check validation: prevent past dates in case the HTML min attribute is bypassed
    const today = new Date().toISOString().split('T')[0];
    if (scheduled_date < today) {
        alert("You cannot set a schedule for past dates.");
        return;
    }

    fetch('/org/kamustahan-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ update_id, scheduled_date })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            closeScheduleModal();
            fetchKamustahanData();
        } else {
            alert(data.message);
        }
    })
    .catch(err => console.error(err));
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
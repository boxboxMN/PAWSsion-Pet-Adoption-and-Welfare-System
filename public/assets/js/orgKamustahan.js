 let allUpdatesData = [];
    let currentTab = 'active'; 
    let currentSortOrder = 'desc'; 

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
            } else if (item.update_status === 'Archived') {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                    <i class="fa-solid fa-box-archive text-[10px]"></i> Archived
                </span>`;
            }

      
            let actionButtons = `
                <button onclick='openUpdateModal(${JSON.stringify(item)})' class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors ${item.is_archived == 1 ? '' : 'border-r border-slate-200'}" title="View Details">
                    <i class="fa-regular fa-eye text-[11px]"></i> View
                </button>
            `;

            if (item.is_archived != 1) {
                actionButtons += `
                    <button onclick='openScheduleModal(${item.update_id})' class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-amber-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors" title="Set Schedule">
                        <i class="fa-regular fa-calendar-days text-[11px]"></i> Schedule
                    </button>
                `;
            }

            const row = document.createElement("tr");
            row.className = "hover:bg-slate-50/60 transition-colors";
            
            row.innerHTML = `
                <td class="py-4 px-3">
                    <div class="flex items-center gap-3">
                        <img src="${displayPhoto}" alt="${item.pet_name}" class="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                        <div>
                            <span class="font-semibold text-slate-900 block text-sm">${item.pet_name || 'Unnamed Pet'}</span>
                            <span class="text-xs text-slate-400 font-medium block mt-0.5">${item.species || 'Pet'}</span>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-3">
                    <span class="font-semibold text-slate-900 block text-sm">${item.adopter_name || 'Adopter'}</span>
                    <span class="text-xs text-slate-400 block mt-0.5">${item.adopter_email || ''}</span>
                </td>
                <td class="py-4 px-3">
                    <span class="font-medium text-slate-800 block text-sm">${item.formatted_date || item.formatted_scheduled_date || item.scheduled_date || 'N/A'}</span>
                    <span class="text-xs text-slate-400 block mt-0.5">${item.formatted_date ? 'Submitted Update' : 'Scheduled Date'}</span>
                </td>
                <td class="py-4 px-3">${statusBadge}</td>
                <td class="py-4 px-3 text-right pr-6 whitespace-nowrap">
                    <div class="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
                        ${actionButtons}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        const paginationInfo = document.getElementById("tablePaginationInfo");
        if (paginationInfo) paginationInfo.textContent = `Showing 1 to ${data.length} of ${data.length} results`;
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
        if (schedUpdateIdInput) schedUpdateIdInput.value = updateId;
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
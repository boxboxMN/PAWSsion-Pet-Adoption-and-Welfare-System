let allPets = [];
let currentViewMode = "active"; // "active", "adopted", or "archived"

document.addEventListener("DOMContentLoaded", async () => {
    // Load shared dashboard components
    await loadSidebar("pets");
    
    await loadTopbar({
        title: "Pets",
        subtitle: "Manage pet profiles, monitor availability, and oversee your organization's rescue animals."
    });

    // Load org pets from db
    await loadPets();

    // Toggle Adopter Details Form Base sa Adoption Status
    const adoptionStatusSelect = petForm ? petForm.querySelector('select[name="adoption_status"]') : null;
  

    if (adoptionStatusSelect) {
        adoptionStatusSelect.addEventListener('change', (e) => {
            const adopterDetailsSection = document.getElementById('adopterDetailsSection');
            const adopterInputs = document.querySelectorAll('.adopter-input');
    
            if (e.target.value === 'Adopted') {
                adopterDetailsSection?.classList.remove('hidden');
                adopterInputs.forEach(input => input.setAttribute('required', 'true'));
            } else {
                adopterDetailsSection?.classList.add('hidden');
                adopterInputs.forEach(input => {
                    input.removeAttribute('required');
                    input.value = '';
                });
            }
        });
    }

    const adoptedBtn = document.getElementById("adoptedPetsBtn");
    const archivedBtn = document.getElementById("archivedPetsBtn");
    const statusFilter = document.getElementById("statusFilter");
    const addPetBtn = document.getElementById("addPetBtn");

    if (adoptedBtn) {
        adoptedBtn.addEventListener("click", () => {
            if (currentViewMode !== "adopted") {
                currentViewMode = "adopted";
                statusFilter.classList.add("hidden");
                addPetBtn.classList.add("hidden");

                adoptedBtn.className = "bg-slate-700 hover:bg-slate-800 text-white w-11 h-11 rounded-xl flex items-center justify-center font-medium transition cursor-pointer shadow-sm";
                adoptedBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;

                archivedBtn.className = "bg-slate-600 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition cursor-pointer";
                archivedBtn.innerHTML = `<i class="fa-solid fa-box-archive"></i>`;
            } else {
                resetToActiveView();
            }
            filterPets();
        });
    }

    // ARCHIVED PETS TOGGLE
    if (archivedBtn) {
        archivedBtn.addEventListener("click", () => {
            if (currentViewMode !== "archived") {
                currentViewMode = "archived";
                statusFilter.classList.add("hidden");
                addPetBtn.classList.add("hidden");

                archivedBtn.className = "bg-slate-700 hover:bg-slate-800 text-white w-11 h-11 rounded-xl flex items-center justify-center font-medium transition cursor-pointer shadow-sm";
                archivedBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;

                adoptedBtn.className = "bg-emerald-600 hover:bg-emerald-700 text-white w-11 h-11 rounded-xl flex items-center justify-center font-medium transition cursor-pointer shadow-sm";
                adoptedBtn.innerHTML = `<i class="fa-solid fa-heart text-base"></i>`;
            } else {
                resetToActiveView();
            }
            filterPets();
        });
    }

    const recycleBinBtn = document.getElementById("recycleBinBtn");

    // RECYCLE BIN TOGGLE
    if (recycleBinBtn) {
        recycleBinBtn.addEventListener("click", () => {
            if (currentViewMode !== "trash") {
                currentViewMode = "trash";
                statusFilter.classList.add("hidden");
                addPetBtn.classList.add("hidden");

                recycleBinBtn.className = "bg-red-700 hover:bg-red-800 text-white w-11 h-11 rounded-xl flex items-center justify-center font-medium transition cursor-pointer shadow-sm";
                recycleBinBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;

                adoptedBtn.className = "bg-emerald-600 hover:bg-emerald-700 text-white w-11 h-11 rounded-xl flex items-center justify-center font-medium transition cursor-pointer shadow-sm";
                adoptedBtn.innerHTML = `<i class="fa-solid fa-heart text-base"></i>`;

                archivedBtn.className = "bg-slate-600 hover:bg-slate-700 text-white w-11 h-11 rounded-xl flex items-center justify-center font-medium transition cursor-pointer shadow-sm";
                archivedBtn.innerHTML = `<i class="fa-solid fa-box-archive text-base"></i>`;

                loadTrash();
            } else {
                resetToActiveView();
                loadPets();
            }
        });
    }
});

// ==========================
// PET MODAL
// ==========================
const modal = document.getElementById("petModal");
const addPetBtn = document.getElementById("addPetBtn");
const adoptedBtn = document.getElementById("adoptedPetsBtn");
const archivedBtn = document.getElementById("archivedPetsBtn");
const statusFilter = document.getElementById("statusFilter");
const closePetModal = document.getElementById("closePetModal");
const cancelPetBtn = document.getElementById("cancelPetBtn");
const petForm = document.getElementById("petForm");
const petImageInput = document.getElementById("petImageInput");
const petImagePreview = document.getElementById("petImagePreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const selectedFileName = document.getElementById("selectedFileName");

function resetToActiveView() {
        currentViewMode = "active";
        statusFilter.classList.remove("hidden");
        addPetBtn.classList.remove("hidden");

        adoptedBtn.className = "bg-emerald-600 hover:bg-emerald-700 text-white w-11 h-11 rounded-xl flex items-center justify-center font-medium transition cursor-pointer shadow-sm";
        adoptedBtn.innerHTML = `<i class="fa-solid fa-heart text-base"></i>`;

        archivedBtn.className = "bg-slate-600 hover:bg-slate-700 text-white w-11 h-11 rounded-xl flex items-center justify-center font-medium transition cursor-pointer shadow-sm";
        archivedBtn.innerHTML = `<i class="fa-solid fa-box-archive text-base"></i>`;
        
        const recycleBinBtn = document.getElementById("recycleBinBtn");
        if (recycleBinBtn) {
            recycleBinBtn.className = "bg-red-600 hover:bg-red-700 text-white w-11 h-11 rounded-xl flex items-center justify-center font-medium transition cursor-pointer shadow-sm";
            recycleBinBtn.innerHTML = `<i class="fa-solid fa-trash-can text-base"></i>`;
        }

        statusFilter.value = "";
    }

petImageInput.addEventListener("change", () => {
    const file = petImageInput.files[0];
    if (!file) return;
        selectedFileName.textContent = "✔ " + file.name;
    const reader = new FileReader();
    reader.onload = function(e){
        petImagePreview.src = e.target.result;
        petImagePreview.classList.remove("hidden");
        uploadPlaceholder.classList.add("hidden");
    };
    reader.readAsDataURL(file);
});
let editingPetId = null;

const modalTitle = document.querySelector("#petModal h2");
const submitButton = petForm.querySelector('button[type="submit"]');

// OPEN MODAL
addPetBtn.addEventListener("click", () => {
    editingPetId = null;
    petForm.reset();
    medicalList = [];
    renderMedicalTable();

    // Tanggalin ang required sa hidden adopter inputs
    const adopterDetailsSection = document.getElementById('adopterDetailsSection');
    const adopterInputs = document.querySelectorAll('.adopter-input');
    if (adopterDetailsSection) {
        adopterDetailsSection.classList.add('hidden');
        adopterInputs.forEach(input => {
            input.removeAttribute('required');
            input.value = '';
        });
    }

    modalTitle.innerHTML = `
        <i class="fa-solid fa-paw text-blue-700 mr-2"></i>
        Add New Pet
    `;

    submitButton.innerHTML = `
        <i class="fa-solid fa-floppy-disk mr-2"></i>
        Save Pet
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
});

// CLOSE BUTTON
closePetModal.addEventListener("click", closeModal);

// CANCEL BUTTON
cancelPetBtn.addEventListener("click", closeModal);

// CLOSE WHEN CLICKING OUTSIDE
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ==========================
// FORM SUBMIT PLACEHOLDER
// ==========================
// This will later connect to your PHP API
petForm.addEventListener("submit", async (e)=>{

    e.preventDefault();
    
    const formData = new FormData(petForm);
    formData.append(
        "medical_history",
        JSON.stringify(medicalList)
    );

    console.log("FormData:");
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    // Kunin ang piniling adoption status bago i-reset ang form
    const selectedAdoptionStatus = petForm.querySelector('select[name="adoption_status"]').value;

     // VALIDATE PHONE NUMBERS BAGO MAG-SUBMIT (dapat mangyari ito bago ipadala sa server)
     if (selectedAdoptionStatus === "Adopted") {
        const contactNumber = petForm.querySelector('input[name="adopter_contact_number"]').value.trim();
        const emergencyPhone = petForm.querySelector('input[name="adopter_emergency_phone"]').value.trim();

        // Regex: Dapat eksaktong 11 digits at nagsisimula sa '09'
        const phPhoneRegex = /^09\d{9}$/;

        if (!phPhoneRegex.test(contactNumber)) {
            alert("Please enter a valid Philippine contact number (e.g., 09123456789).");
            return;
        }

        if (!phPhoneRegex.test(emergencyPhone)) {
            alert("Please enter a valid Philippine emergency phone number (e.g., 09123456789).");
            return;
        }
    }

    try {

    const url = editingPetId
        ? `/org/pets/update/${editingPetId}`
        : "/org/pets/add";

    const method = editingPetId
        ? "PUT"
        : "POST";

    const response = await fetch(url, {
        method,
        body: formData
    });

        console.log("STATUS:", response.status);

        const text = await response.text();

        console.log("SERVER RESPONSE:", text);
        let data;
        try {
            data = JSON.parse(text);
        }

        catch(err){
            alert("Server returned invalid response. Check terminal.");
            return;
        }

        if (data.success) {
            alert(data.message);
            closeModal();
            petForm.reset();

            // =======================================================
            // AUTOMATIC VIEW SWITCHING BASE SA PINILING STATUS
            // =======================================================
            const statusFilter = document.getElementById("statusFilter");
            const addPetBtn = document.getElementById("addPetBtn");
            const adoptedBtn = document.getElementById("adoptedPetsBtn");
            const archivedBtn = document.getElementById("archivedPetsBtn");

            if (selectedAdoptionStatus === "Adopted") {
                
                // Ilipat ang view sa Adopted Pets
                currentViewMode = "adopted";
                statusFilter?.classList.add("hidden");
                addPetBtn?.classList.add("hidden");

                if (adoptedBtn) {
                    adoptedBtn.className = "bg-slate-700 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition cursor-pointer";
                    adoptedBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Active Pets`;
                }
                if (archivedBtn) {
                    archivedBtn.className = "bg-slate-600 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition cursor-pointer";
                    archivedBtn.innerHTML = `<i class="fa-solid fa-box-archive"></i> Archived Pets`;
                }
            } else {
                // Kung Available o Pending: Ibalik sa Active Pets view
                resetToActiveView();
            }

            await loadPets();
        } else {
            alert(data.message || "Failed to save pet. Please check all required fields.");
        }
    }

    catch(error){
        console.error("FETCH ERROR:", error);
        alert(
            "Request failed. Check browser console and server terminal."
        );
    }
});

// PETS CARD
async function loadPets() {
    const container = document.getElementById("petsContainer");
    container.innerHTML = `
        <div class="text-center py-10">
            Loading pets...
        </div>
    `;

    const res = await fetch("/org/pets/list");
    const data = await res.json();

    allPets = data.pets || [];

    if (!data.success) {
        container.innerHTML = `
            <div class="text-red-600">
                Failed to load pets.
            </div>
        `;
        return;
    }

    if (data.pets.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-xl p-10 text-center shadow">
                No pets added yet.
            </div>
        `;

        return;
    }
    filterPets();
}

function renderPets(pets) {
    const container = document.getElementById("petsContainer");

    if (!pets.length) {
        container.innerHTML = `
            <div class="bg-white rounded-xl p-10 text-center shadow">
                No pets found.
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
            ${pets.map(createPetCard).join("")}
        </div>
    `;
}

// ==========================
// RECYCLE BIN
// ==========================
async function loadTrash() {
    const container = document.getElementById("petsContainer");
    container.innerHTML = `
        <div class="text-center py-10">
            Loading recycle bin...
        </div>
    `;

    try {
        const res = await fetch("/org/pets/trash");
        const data = await res.json();

        if (!data.success) {
            container.innerHTML = `<div class="text-red-600">Failed to load recycle bin.</div>`;
            return;
        }

        renderTrashPets(data.pets || []);
    } catch (err) {
        console.error("LOAD TRASH ERROR:", err);
        container.innerHTML = `<div class="text-red-600">Failed to load recycle bin.</div>`;
    }
}

function renderTrashPets(pets) {
    const container = document.getElementById("petsContainer");

    if (!pets.length) {
        container.innerHTML = `
            <div class="bg-white rounded-xl p-10 text-center shadow">
                <i class="fa-solid fa-trash-can text-3xl text-slate-300 mb-3"></i>
                <p>Recycle Bin is empty.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
            ${pets.map(createTrashCard).join("")}
        </div>
    `;
}

function createTrashCard(pet) {
    const image = pet.image_path
        ? `/uploads/pets/${pet.image_path}`
        : "/assets/images/no-image.png";

    const daysLeft = pet.days_left != null ? Math.max(0, pet.days_left) : "—";

    return `
        <div class="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col opacity-90">
            <div class="relative overflow-hidden bg-slate-100">
                <img src="${image}" alt="${pet.name}" class="w-full h-60 object-cover grayscale">
                <span class="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-xl shadow-md">
                    Deleted
                </span>
            </div>

            <div class="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                    <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">${pet.name}</h2>
                    <p class="text-xs text-amber-600 font-semibold mt-1">
                        <i class="fa-solid fa-clock"></i> Purges automatically in ${daysLeft} day${daysLeft === 1 ? '' : 's'}
                    </p>
                </div>

                <div class="flex gap-2">
                    <button class="restorePetBtn flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold transition" data-id="${pet.animal_id}" data-name="${pet.name}">
                        <i class="fa-solid fa-rotate-left mr-1"></i> Restore
                    </button>
                    <button class="permanentDeleteBtn flex-1 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 py-2.5 text-xs font-bold transition" data-id="${pet.animal_id}" data-name="${pet.name}">
                        <i class="fa-solid fa-trash mr-1"></i> Delete Forever
                    </button>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener("click", async (e) => {
    const restoreBtn = e.target.closest(".restorePetBtn");
    if (restoreBtn) {
        const id = restoreBtn.dataset.id;
        const name = restoreBtn.dataset.name;
        if (!confirm(`Restore ${name} from the Recycle Bin?`)) return;

        try {
            const res = await fetch(`/org/pets/restore/${id}`, { method: "POST" });
            const data = await res.json();
            alert(data.message);
            if (data.success) loadTrash();
        } catch (err) {
            console.error("RESTORE ERROR:", err);
            alert("Failed to restore pet.");
        }
        return;
    }

    const permDeleteBtn = e.target.closest(".permanentDeleteBtn");
    if (permDeleteBtn) {
        const id = permDeleteBtn.dataset.id;
        const name = permDeleteBtn.dataset.name;
        if (!confirm(`Permanently delete ${name}? This CANNOT be undone.`)) return;

        try {
            const res = await fetch(`/org/pets/permanent/${id}`, { method: "DELETE" });
            const data = await res.json();
            alert(data.message);
            if (data.success) loadTrash();
        } catch (err) {
            console.error("PERMANENT DELETE ERROR:", err);
            alert("Failed to permanently delete pet.");
        }
        return;
    }
});

function createPetCard(pet) {
    const genderColor = pet.gender === "Female" ? "text-pink-500" : "text-blue-500";
    const genderIcon = pet.gender === "Female" ? "fa-venus" : "fa-mars";

    const statusColor = {
        Available: "bg-green-600",
        Pending: "bg-yellow-500",
        Adopted: "bg-blue-600",
        Archived: "bg-slate-600"
    };

    const speciesColor = {
        Dog: "bg-blue-500",
        Cat: "bg-orange-500"
    };

    const image = pet.image_path
        ? `/uploads/pets/${pet.image_path}`
        : "/assets/images/no-image.png";


    return `
        <div class="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col">

            <!-- Image -->
            <div class="relative overflow-hidden bg-slate-100">
                <img src="${image}" alt="${pet.name}" class="w-full h-60 object-cover">

                <span class="absolute top-3 left-3 ${speciesColor[pet.species] || "bg-blue-600"} text-white text-xs font-bold uppercase px-3 py-1 rounded-xl shadow-md">
                    ${pet.species}
                </span>

                <span class="absolute top-3 right-3 ${statusColor[pet.adoption_status] || "bg-slate-500"} text-white text-xs font-bold uppercase px-3 py-1 rounded-xl shadow-md">
                    ${pet.adoption_status}
                </span>
            </div>

            <!-- Body -->
            <div class="p-5 flex flex-col flex-1 justify-between gap-4">

                <!-- Name + Details -->
                <div>
                    <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">
                        ${pet.name}
                    </h2>

                    <div class="flex items-center gap-2 mt-3 overflow-x-auto whitespace-nowrap no-scrollbar">
                        <span class="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60">
                            <i class="fa-solid fa-paw text-slate-400 text-[10px]"></i>
                            ${pet.species}
                        </span>

                        <span class="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60">
                            <i class="fa-regular fa-calendar-days text-slate-400 text-[10px]"></i>
                            ${pet.age}
                        </span>

                        <span class="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold border border-slate-200/60 ${genderColor}">
                            <i class="fa-solid ${genderIcon} text-[10px]"></i>
                            ${pet.gender}
                        </span>
                    </div>
                </div>

                <!-- Button -->
                <button class="viewPetBtn w-full rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-blue-900 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700" data-id="${pet.animal_id}">
                    View Profile
                </button>

            </div>

        </div>
    `;
}
document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".viewPetBtn");
    if (!btn) return;

    const id = btn.dataset.id;

    try {
        const res = await fetch(`/org/pets/${id}`);
        const data = await res.json();

        if (!data.success) {
            alert("Unable to load pet details.");
            return;
        }

        openPetDetailsModal(data.pet);
    } catch (err) {
       try {

    const res = await fetch(`/org/pets/${id}`);

    console.log("Status:", res.status);

    const text = await res.text();

    console.log(text);

    const data = JSON.parse(text);

    console.log(data);

    if(!data.success){
        alert(data.message);
        return;
    }

    openPetDetailsModal(data.pet);

}
catch(err){

    console.error(err);

}
    }
});

function openPetDetailsModal(pet){

    const editBtn = document.getElementById("editPetBtn");
    const archiveBtn = document.getElementById("archivePetBtn");
    const deleteBtn = document.getElementById("deletePetBtn");
    const viewAppBtn = document.getElementById("viewAdoptionAppBtn");

    // KUNG ADOPTED: Itago ang Edit, Archive, Delete at ipakita ang View Application Button
    if (pet.adoption_status === "Adopted") {
        if (editBtn) editBtn.classList.add("hidden");
        if (archiveBtn) archiveBtn.classList.add("hidden");
        if (deleteBtn) deleteBtn.classList.add("hidden");
        
        if (viewAppBtn) {
            viewAppBtn.classList.remove("hidden");
            viewAppBtn.onclick = async () => {
                try {
                    const res = await fetch(`/org/pets/${pet.animal_id}/application`);
                    const data = await res.json();

                    if (data.success && data.application_id) {
                        // I-store sa sessionStorage gaya ng nasa adoption table
                        sessionStorage.setItem("selectedApplicationId", data.application_id);
                        // Redirect sa mismong Adoption Details Page
                        window.location.href = "/org/adoption-details";
                    } else {
                        alert("No adoption application details record found for this pet.");
                    }
                } catch (err) {
                    console.error("Error redirecting to application:", err);
                    alert("Failed to load application details.");
                }
            };
        }
    } 
    // =========================================================================
    // 2. KUNG ARCHIVED: Tanging "Unarchive" Button lang ang makikita (Walang Edit/Delete)
    // =========================================================================
    else if (pet.adoption_status === "Archived") {
        if (editBtn) editBtn.classList.add("hidden");
        if (deleteBtn) deleteBtn.classList.add("hidden");
        if (viewAppBtn) viewAppBtn.classList.add("hidden");
        
        if (archiveBtn) {
            archiveBtn.classList.remove("hidden");
            archiveBtn.innerHTML = `<i class="fa-solid fa-box-open mr-2"></i> Unarchive Record`;
            archiveBtn.className = "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition cursor-pointer";

            archiveBtn.onclick = async () => {
                if (!confirm(`Do you want to restore ${pet.name} back to Active Pets?`)) return;

                try {
                    const storedPrevStatus = archiveBtn.dataset.prevStatus || null;

                    const res = await fetch(`/org/pets/archive/${pet.animal_id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "Restore", prevStatus: storedPrevStatus })
                    });

                    const data = await res.json();
                    if (data.success) {
                        alert(data.message);
                        closeViewPetModal();
                        await loadPets();
                    } else {
                        alert(data.message);
                    }
                } catch (err) {
                    console.error("UNARCHIVE ERROR:", err);
                    alert("Failed to unarchive pet.");
                }
            };
        }
    } else {
       // 3. KUNG ACTIVE (Available / Pending): Ipakita ang Edit, Archive, Delete
        if (editBtn) editBtn.classList.remove("hidden");
        if (deleteBtn) deleteBtn.classList.remove("hidden");
        if (viewAppBtn) viewAppBtn.classList.add("hidden");
    
        if (archiveBtn) {
            archiveBtn.classList.remove("hidden");
            archiveBtn.innerHTML = `<i class="fa-solid fa-box-archive mr-2"></i> Archive Record`;
            archiveBtn.className = "bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition cursor-pointer";

            // Itabi ang kasalukuyang status (Pending o Available) sa button dataset
            archiveBtn.dataset.prevStatus = pet.adoption_status;

            archiveBtn.onclick = async () => {
                if (!confirm(`Are you sure you want to archive ${pet.name}?`)) return;

                try {
                    const res = await fetch(`/org/pets/archive/${pet.animal_id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "Archived", prevStatus: pet.adoption_status })
                    });

                    const data = await res.json();
                    if (data.success) {
                        alert(data.message);
                        closeViewPetModal();
                        await loadPets();
                    } else {
                        alert(data.message);
                    }
                } catch (err) {
                    console.error("ARCHIVE ERROR:", err);
                    alert("Failed to archive pet.");
                }
            };
        }
    }

    document.getElementById("editPetBtn").onclick = () => {

        editingPetId = pet.animal_id;
        document.getElementById("animal_id").value = pet.animal_id;
        petForm.name.value = pet.name;
        petForm.species.value = pet.species;
        petForm.gender.value = pet.gender;
        petForm.age.value = pet.age;
        petForm.health_status.value = pet.health_status;
        petForm.vaccination_status.value = pet.vaccination_status;
        petForm.adoption_status.value = pet.adoption_status;
        petForm.pet_description.value = pet.pet_description || "";

        medicalList = pet.medical_history ? [...pet.medical_history] : [];
        renderMedicalTable();

        modalTitle.innerHTML = `
            <i class="fa-solid fa-pen text-amber-500 mr-2"></i>
            Edit Pet
        `;
        submitButton.innerHTML = `
            <i class="fa-solid fa-floppy-disk mr-2"></i>
            Save Changes
        `;
        closeViewPetModal();
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    };

    document.getElementById("deletePetBtn").onclick = async () => {
        const confirmed = confirm(
            `Move ${pet.name} to the Recycle Bin? You can restore it within 30 days from the Recycle Bin.`
        );
        if (!confirmed) return;
        try {
            const res = await fetch(`/org/pets/delete/${pet.animal_id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                closeViewPetModal();
                await loadPets();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("DELETE ERROR:", err);
            alert(err.message);
        }

    };

    // DISPLAY PET DETAILS TO MODAL
    const viewModal = document.getElementById("viewPetModal");

    document.getElementById("viewPetImage").src =
        pet.image_path
            ? `/uploads/pets/${pet.image_path}`
            : "/assets/images/no-image.png";

    document.getElementById("viewName").textContent = pet.name;

    document.getElementById("viewSpecies").textContent = pet.species;

    document.getElementById("viewGender").textContent = pet.gender;

    document.getElementById("viewAge").textContent = pet.age;

    document.getElementById("viewVaccination").textContent =
        pet.vaccination_status;

    document.getElementById("viewHealthStatus").textContent =
        pet.health_status;

    document.getElementById("viewHealth").textContent =
        pet.health_status;

    document.getElementById("viewStatus").textContent =
        pet.adoption_status;

    document.getElementById("viewDescription").textContent =
        pet.pet_description || "No description.";

    // ============================
    // MEDICAL HISTORY
    // ============================

    const medical = pet.medical_history || [];

    const tbody = document.getElementById("viewMedicalTable");

    tbody.innerHTML = "";

    if (!medical.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="3"
                    class="text-center p-5 text-slate-400">
                    No medical history available.
                </td>
            </tr>
        `;

    } else {

        medical.forEach(record => {

            tbody.innerHTML += `
                <tr class="border-t">

                    <td class="p-3">
                        ${record.treatment}
                    </td>

                    <td class="p-3">
                        ${record.administered_date}
                    </td>

                    <td class="p-3">
                        ${record.administered_by}
                    </td>

                </tr>
            `;

        });

    }

    viewModal.classList.remove("hidden");
    viewModal.classList.add("flex");

}

function closeViewPetModal(){

    const viewModal = document.getElementById("viewPetModal");

    viewModal.classList.remove("flex");
    viewModal.classList.add("hidden");

}

function closeModal(){

    modal.classList.remove("flex");
    modal.classList.add("hidden");
    medicalList = [];

    renderMedicalTable();
    petForm.reset();
    petImagePreview.src = "";
    petImagePreview.classList.add("hidden");
    uploadPlaceholder.classList.remove("hidden");
    selectedFileName.textContent = "";


    // LIGTAS NA PAG-RESET NG ADOPTER DETAILS
    const adopterDetailsSection = document.getElementById('adopterDetailsSection');
    const adopterInputs = document.querySelectorAll('.adopter-input');

    if (adopterDetailsSection) {
        adopterDetailsSection.classList.add('hidden');
        adopterInputs.forEach(input => {
            input.removeAttribute('required'); // Inaalis ang required para hindi harangin ng browser validation
            input.value = '';
        });
    }
}

document.querySelector(".add-med-btn").addEventListener("click", () => {

    const treatment = document.getElementById("m-treatment").value.trim();
    const date = document.getElementById("m-date").value;
    const by = document.getElementById("m-by").value.trim();

    if (!treatment || !date || !by) {
        alert("Please complete all medical history fields.");
        return;
    }

    medicalList.push({
        treatment,
        administered_date: date,
        administered_by: by
    });

    renderMedicalTable();

    document.getElementById("m-treatment").value = "";
    document.getElementById("m-date").value = "";
    document.getElementById("m-by").value = "";

});
function renderMedicalTable() {

    const tbody = document.getElementById("medical-tbody");

    tbody.innerHTML = "";

    if (!medicalList.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center p-5 text-slate-400">
                    No medical records yet
                </td>
            </tr>
        `;

        return;
    }

    medicalList.forEach((m, index) => {

        tbody.innerHTML += `
            <tr class="border-t">

                <td class="p-3">${m.treatment}</td>

                <td class="p-3">${m.administered_date}</td>

                <td class="p-3">${m.administered_by}</td>

                <td class="text-center">

                    <button
                        onclick="removeMedical(${index})"
                        class="text-red-500 hover:text-red-700">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>
        `;

    });
}

function removeMedical(index) {

    medicalList.splice(index, 1);

    renderMedicalTable();

}
const searchInput = document.getElementById("searchPet");

searchInput.addEventListener("input", filterPets);

function filterPets() {

    const keyword = document
        .getElementById("searchPet")
        .value
        .toLowerCase()
        .trim();

    const status = document
        .getElementById("statusFilter")
        .value;

    const species = document
        .getElementById("typeFilter")
        .value;

    const filtered = allPets.filter(pet => {

        const matchesSearch =
            pet.name.toLowerCase().includes(keyword) ||
            pet.species.toLowerCase().includes(keyword) ||
            pet.gender.toLowerCase().includes(keyword) ||
            pet.age.toLowerCase().includes(keyword);
            
        const matchesSpecies = !species || pet.species === species;

        if (currentViewMode === "adopted") {
            return matchesSearch && matchesSpecies && pet.adoption_status === "Adopted";
        } else if (currentViewMode === "archived") {
            return matchesSearch && matchesSpecies && pet.adoption_status === "Archived";
        } else {
            // ACTIVE PETS VIEW (Exclude Adopted & Archived)
            const isNotAdoptedOrArchived = pet.adoption_status !== "Adopted" && pet.adoption_status !== "Archived";
            const matchesStatus = !status || pet.adoption_status === status;

            return matchesSearch && matchesSpecies && isNotAdoptedOrArchived && matchesStatus;
        }
    });

    renderPets(filtered);
}
document
    .getElementById("statusFilter")
    .addEventListener("change", filterPets);

document
    .getElementById("typeFilter")
    .addEventListener("change", filterPets);
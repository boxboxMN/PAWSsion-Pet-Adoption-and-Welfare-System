// <!-- ===== ADOPTION HUB SCRIPT ===== -->
let petsData = [];
let filteredPets = [];
async function loadPets() {
    try {

        const response = await fetch("/api/pets");
        const data = await response.json();

        if (!data.success) {
            alert("Unable to load pets.");
            return;
        }

       petsData = data.pets.map(pet => ({
        animal_id: pet.animal_id,
        name: pet.name,
        species: pet.species,
        gender: pet.gender,
        age: pet.age,
        color: pet.color,
        personality: pet.personality_tags || "",
        breed: pet.personality_tags || "",
        behavior: pet.pet_description,
        status: pet.adoption_status,
        birth_date: pet.birth_date,
        health: pet.health_status,
        vaccination: pet.vaccination_status,
        organization: pet.organization_name,
        organization_logo: pet.profile_pic,
        medical_history: pet.medical_history || [],
        img: pet.image_path
            ? `/uploads/pets/${pet.image_path}`
            : "/assets/images/no-image.png"
    }));

    filteredPets = [...petsData];

    renderGrid(filteredPets);

    } catch (err) {

        console.error(err);

    }
}
function renderGrid(pets = filteredPets) {

    const grid = document.getElementById("pet-grid");

    if (!pets.length) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10 text-gray-500">
                No pets available for adoption.
            </div>
        `;
        return;
    }

grid.innerHTML = pets.map(pet => `
<div class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/80 flex flex-col">

    <!-- Image -->
    <div class="relative overflow-hidden bg-slate-100">
        <img
            src="${pet.img}"
            alt="${pet.name}"
            class="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105"
        >

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80"></div>

        <!-- Species -->
        <span class="absolute top-3 left-3 px-3 py-1 rounded-xl text-white text-xs font-bold shadow-md ${
            pet.species.toLowerCase() === "dog"
                ? "bg-blue-600"
                : "bg-orange-500"
        }">
            ${pet.species.toUpperCase()}
        </span>

        <!-- Status -->
        <span class="absolute top-3 right-3 px-3 py-1 rounded-xl bg-green-600 text-white text-xs font-bold shadow-md">
            ${pet.status.toUpperCase()}
        </span>

        <!-- Name Banner -->
        <div class="absolute bottom-3 left-4 right-4">
            <div class="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 shadow-md">
                <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">
                    ${pet.name}
                </h2>
            </div>
        </div>
    </div>

    <!-- Body -->
    <div class="p-5 flex flex-col flex-1 justify-between gap-4">

        <!-- Species Age Gender -->
        <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
            <span class="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60">
                <i class="fa-solid fa-paw text-slate-400 text-[10px]"></i>
                ${pet.species}
            </span>

            <span class="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60">
                <i class="fa-regular fa-calendar-days text-slate-400 text-[10px]"></i>
                ${pet.age}
            </span>

            <span class="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200/60 bg-slate-100 text-xs font-semibold ${
                pet.gender === "Male"
                    ? "text-blue-600"
                    : "text-pink-600"
            }">
                <i class="fas ${
                    pet.gender === "Male"
                        ? "fa-mars"
                        : "fa-venus"
                } text-[10px]"></i>
                ${pet.gender}
            </span>
        </div>

        <!-- Organization -->
        <div class="rounded-2xl bg-slate-50 border border-slate-200/70 p-3.5">
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                <i class="fas fa-building text-slate-400 text-[10px]"></i>
                Organization
            </p>
            <p class="text-sm font-semibold text-slate-800 break-words">
                ${pet.organization}
            </p>
        </div>

        <!-- Button -->
        <button class="view-btn w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            data-id="${pet.animal_id}">
            <i class="fa-regular fa-eye text-sm"></i>View Profile
        </button>

    </div>

</div>
`).join("");
        }
function filterPets() {

    const search = document
        .getElementById("search-input")
        .value
        .toLowerCase()
        .trim();

    const type = document
        .getElementById("type-filter")
        .value;

    filteredPets = petsData.filter(pet => {

        const matchesSearch =
            pet.name.toLowerCase().includes(search) ||
            pet.species.toLowerCase().includes(search) ||
            pet.personality.toLowerCase().includes(search) ||
            pet.organization.toLowerCase().includes(search);

        const matchesType =
            type === "All" ||
            pet.species === type;

        return matchesSearch && matchesType;
    });

    renderGrid(filteredPets);
}
loadPets();
document.getElementById("search-input")
    .addEventListener("input", filterPets);

document.getElementById("type-filter")
    .addEventListener("change", filterPets);

document.addEventListener("click", e => {

    const btn = e.target.closest(".view-btn");

    if(!btn) return;

    const id = Number(btn.dataset.id);

    const pet = petsData.find(p => p.animal_id == id);

    if(pet){

        openPetModal(pet);

    }

});

// Check if the user has already applied for adoption for this pet
async function checkPetApplicationStatus(petId) {
    const applyBtn = document.getElementById('applyModalBtn');
    if (!applyBtn) return;

    try {
        const res = await fetch(`/check-applied/${petId}`, {
            credentials: 'include'
        });
        const data = await res.json();

        if (data.hasApplied) {
            const statusUpper = (data.status || '').toUpperCase();

            if (statusUpper === 'DECLINED' || statusUpper === 'REJECTED') {
                // KAPAG DECLINED: Clickable Button na nagpapakita ng reason
                applyBtn.disabled = false;
                applyBtn.className = "w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]";
                applyBtn.innerHTML = `
                    <i class="fa-solid fa-circle-xmark text-sm"></i>
                    <span>Application Declined (View Details)</span>
                `;

                // Set click action para lumabas ang popup kung bakit na-decline
                applyBtn.onclick = (e) => {
                    e.preventDefault();
                    if (typeof showModal === 'function') {
                        showModal(
                            'Application Declined', 
                            `Reason: ${data.declineReason || 'No specific reason provided by the organization.'}`, 
                            false
                        );
                    } else {
                        alert(`Application Declined\n\nReason: ${data.declineReason}`);
                    }
                };
            } else {
                // KAPAG PENDING / APPROVED: Disabled Button
                applyBtn.disabled = true;
                applyBtn.onclick = null;
                applyBtn.className = "w-full bg-gray-400 text-white py-3 rounded-xl font-bold text-xs shadow-none cursor-not-allowed flex items-center justify-center gap-2";
                applyBtn.innerHTML = `
                    <i class="fa-solid fa-circle-check text-sm"></i>
                    <span>Application Submitted (${data.status || 'Pending'})</span>
                `;
            }
        } else {
            // Ibalik sa active state
            applyBtn.disabled = false;
            applyBtn.className = "w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer";
            applyBtn.innerHTML = `
                <i class="fa-regular fa-heart text-sm"></i>
                <span>Apply for Adoption</span>
            `;
        }
    } catch (err) {
        console.error("Error checking application status:", err);
    }
}

async function openPetModal(pet){
   
    window.currentPet = pet;
    const applyBtn = document.getElementById("applyModalBtn");
    if (applyBtn) {
        applyBtn.dataset.petId = pet.id || pet.animal_id; 
    }
    
    document.getElementById("modalImage").src = pet.img;
    document.getElementById("modalName").textContent = pet.name;
    document.getElementById("modalSpecies").textContent = pet.species;
    document.getElementById("modalGender").textContent = pet.gender;
    document.getElementById("modalAge").textContent = pet.age;
    document.getElementById("modalOrganization").textContent = pet.organization || "Unknown Organization";

    // ======================
    // Adoption Status
    // ======================
    const statusBadge = document.getElementById("modalStatus");

    statusBadge.className =
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold";

    switch (pet.status) {

        case "Available":
            statusBadge.textContent = "🟢 Available";
            statusBadge.classList.add(
                "bg-emerald-50",
                "border",
                "border-emerald-200",
                "text-emerald-800"
            );
            break;

        case "Pending":
            statusBadge.textContent = "🟡 Adoption in Progress";
            statusBadge.classList.add(
                "bg-yellow-50",
                "border",
                "border-yellow-200",
                "text-yellow-800"
            );
            break;

        case "Adopted":
            statusBadge.textContent = "💙 Successfully Adopted";
            statusBadge.classList.add(
                "bg-blue-50",
                "border",
                "border-blue-200",
                "text-blue-800"
            );
            break;

        case "Archived":
            statusBadge.textContent = "⚪ No Longer Listed";
            statusBadge.classList.add(
                "bg-slate-100",
                "border",
                "border-slate-300",
                "text-slate-700"
            );
            break;

        default:
            statusBadge.textContent = "Unknown";
            statusBadge.classList.add(
                "bg-gray-50",
                "border",
                "border-gray-200",
                "text-gray-700"
            );
    }
    // ======================
    // Health Status
    // ======================
    const healthBadge = document.getElementById("modalHealth");

    healthBadge.className =
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium";

    switch (pet.health) {

        case "Healthy":
            healthBadge.textContent = "💚 Excellent Condition";
            healthBadge.classList.add(
                "bg-emerald-50",
                "border",
                "border-emerald-200",
                "text-emerald-800"
            );
            break;

        case "Recovered":
            healthBadge.textContent = "🌿 Recovered";
            healthBadge.classList.add(
                "bg-green-50",
                "border",
                "border-green-200",
                "text-green-700"
            );
            break;

        case "Under Treatment":
            healthBadge.textContent = "🩺 Under Treatment";
            healthBadge.classList.add(
                "bg-yellow-50",
                "border",
                "border-yellow-200",
                "text-yellow-800"
            );
            break;

        case "Sick":
            healthBadge.textContent = "❤️ Needs Extra Care";
            healthBadge.classList.add(
                "bg-red-50",
                "border",
                "border-red-200",
                "text-red-700"
            );
            break;

        default:
            healthBadge.textContent = "Unknown";
            healthBadge.classList.add(
                "bg-gray-50",
                "border",
                "border-gray-200",
                "text-gray-700"
            );
    }
    // ======================
    // Vaccination Status
    // ======================
    const vaccinationBadge = document.getElementById("modalVaccination");

    vaccinationBadge.className =
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium";

    switch (pet.vaccination) {

        case "Vaccinated":
            vaccinationBadge.textContent = "💉 Vaccinated";
            vaccinationBadge.classList.add(
                "bg-blue-50",
                "border",
                "border-blue-200",
                "text-blue-700"
            );
            break;

        case "Not Vaccinated":
            vaccinationBadge.textContent = "⚠️ Not Yet Vaccinated";
            vaccinationBadge.classList.add(
                "bg-orange-50",
                "border",
                "border-orange-200",
                "text-orange-700"
            );
            break;

        case "Unknown":
            vaccinationBadge.textContent = "❓ Vaccination Unknown";
            vaccinationBadge.classList.add(
                "bg-slate-100",
                "border",
                "border-slate-300",
                "text-slate-700"
            );
            break;

        default:
            vaccinationBadge.textContent = "Unknown";
            vaccinationBadge.classList.add(
                "bg-gray-50",
                "border",
                "border-gray-200",
                "text-gray-700"
            );
    }
    // Behavior
    document.getElementById("modalBehavior").textContent = pet.behavior || "No description.";

    renderMedicalHistory(pet.medical_history);
        // const tags = document.getElementById("modalTags");

    await checkPetApplicationStatus(pet.animal_id);

    document.getElementById("viewPetModal").classList.remove("hidden");
    document.getElementById("viewPetModal").classList.add("flex");
    // tags.innerHTML = "";

// if (pet.personality) {

//     pet.personality.split(",").forEach(tag => {

//         tags.innerHTML += `
//             <span
//                 class="
//                 bg-blue-600
//                 text-white
//                 text-sm
//                 font-semibold
//                 px-4
//                 py-2
//                 rounded-full">

//                 ${tag.trim()}

//             </span>
//         `;

//     });

// }

    document.getElementById("viewPetModal").classList.remove("hidden");

    document.getElementById("viewPetModal").classList.add("flex");

}


function renderMedicalHistory(history) {

    const tbody = document.getElementById("modalMedicalBody");

    tbody.innerHTML = "";

    if (!history || history.length === 0) {

        tbody.innerHTML = `
            <tr>

                <td colspan="3"
                    class="text-center p-6 text-gray-400">

                    No medical records.

                </td>

            </tr>
        `;

        return;

    }

    history.forEach(record => {

        const date = record.administered_date
            ? new Date(record.administered_date)
                .toLocaleDateString()
            : "-";

        tbody.innerHTML += `

            <tr class="border-t hover:bg-gray-50">

                <td class="p-3">

                    ${record.treatment}

                </td>

                <td class="p-3">

                    ${date}

                </td>

                <td class="p-3">

                    ${record.administered_by}

                </td>

            </tr>

        `;

    });

}

function closePetModal(){

    document.getElementById("viewPetModal").classList.add("hidden");

    document.getElementById("viewPetModal").classList.remove("flex");
}
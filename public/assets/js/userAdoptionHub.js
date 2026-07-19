// <!-- ===== ADOPTION HUB SCRIPT ===== -->
let petsData = [];

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

        behavior: pet.behavior_description,

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

        renderGrid();

    } catch (err) {

        console.error(err);

    }
}
function renderGrid() {

    const grid = document.getElementById("pet-grid");

    if (!petsData.length) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10 text-gray-500">
                No pets available for adoption.
            </div>
        `;
        return;
    }

    grid.innerHTML = petsData.map(pet => `
<div class="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

    <!-- Image -->
    <div class="relative">

        <img
            src="${pet.img}"
            alt="${pet.name}"
            class="w-full h-52 object-cover"
        >

        <!-- Species -->
        <span
            class="absolute top-4 left-4
            px-4 py-2 rounded-full
            text-white text-xs font-bold shadow
            ${
                pet.species.toLowerCase() === "dog"
                    ? "bg-blue-500"
                    : "bg-orange-500"
            }">

            ${pet.species.toUpperCase()}

        </span>

        <!-- Status -->
        <span class="absolute top-4 right-4
            px-4 py-2 rounded-full
            bg-green-500 text-white
            text-xs font-bold shadow">

            ${pet.status.toUpperCase()}

        </span>

    </div>

    <!-- Body -->
    <div class="p-6">

        <!-- Name -->
        <h2 class="text-3xl font-bold text-gray-800">

            ${pet.name}

        </h2>


        <!-- Species Age Gender -->
        <div class="flex flex-wrap items-center gap-2 mt-3 text-gray-600 text-sm font-bold">

            <span>${pet.species}</span>

            <span>•</span>

            <span>${pet.age}</span>

            <span>•</span>

            <span class="${
                pet.gender === "Male"
                    ? "text-blue-500"
                    : "text-pink-500"
            } font-semibold">

                <i class="fas ${
                    pet.gender === "Male"
                        ? "fa-mars"
                        : "fa-venus"
                } mr-1"></i>

                ${pet.gender}

            </span>

        </div>

        <!-- Personality Tags -->
        <div class="flex flex-wrap gap-2 mt-3">

            ${
                pet.breed
                    .split(",")
                    .map(tag => `
                        <span
                            class="px-4 py-1.5
                                   rounded-full
                                   border border-gray-300
                                   bg-white
                                   text-gray-700
                                   text-sm
                                   font-medium
                                   hover:border-blue-400
                                   hover:text-blue-600
                                   transition">

                            ${tag.trim()}

                        </span>
                    `)
                    .join("")
            }

        </div>

          <!-- Organization -->
        <p class="text-blue-500 mt-8 flex items-center gap-2">
            <i class="fas fa-building"></i>
            ${pet.organization}
        </p>

        <!-- Button -->
        <button
            class="view-btn
                   w-full
                   mt-6
                   py-3
                   rounded-2xl
                   border
                   border-gray-300
                   bg-white
                   text-blue-600
                   font-semibold
                   text-lg
                   hover:bg-blue-600
                   hover:text-white
                   hover:border-blue-600
                   transition"
            data-id="${pet.animal_id}">

            View Profile

        </button>

    </div>

</div>
    `).join("");

}
loadPets();
document.addEventListener("click", e => {

    const btn = e.target.closest(".view-btn");

    if(!btn) return;

    const id = Number(btn.dataset.id);

    const pet = petsData.find(p => p.animal_id == id);

    if(pet){

        openPetModal(pet);

    }

});
function openPetModal(pet){

    document.getElementById("modalImage").src = pet.img;

    document.getElementById("modalName").textContent = pet.name;

    document.getElementById("modalSpecies").textContent = pet.species;

    document.getElementById("modalGender").textContent = pet.gender;

    document.getElementById("modalAge").textContent = pet.age;

    document.getElementById("modalStatus").textContent =
        pet.status;

    // =============================
    // Adoption Status Badge
    // =============================
    const status = document.getElementById("modalStatus");
    status.textContent = pet.status;
    status.className = "px-4 py-2 rounded-full text-sm font-medium " + 
        (pet.status === "Available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700");

    // =============================
    // Health Badge
    // =============================
    const health = document.getElementById("modalHealth");
    health.textContent = pet.health || "Healthy";

    let healthClass = "bg-orange-100 text-orange-700";
    switch (pet.health) {
        case "Healthy":
            healthClass = "bg-green-100 text-green-700";
            break;
        case "Recovered":
            healthClass = "bg-blue-100 text-blue-700";
            break;
        case "Sick":
            healthClass = "bg-red-100 text-red-700";
            break;
        case "Under Treatment":
            healthClass = "bg-yellow-100 text-yellow-700";
            break;
    }
    health.className = `px-4 py-2 rounded-full text-sm font-medium ${healthClass}`;

    // =============================
    // Vaccination Badge
    // =============================
    const vaccination = document.getElementById("modalVaccination");
    vaccination.textContent = pet.vaccination || "Unknown";

    let vaccinationClass = "bg-gray-100 text-gray-700";
    switch (pet.vaccination) {
        case "Vaccinated":
            vaccinationClass = "bg-blue-100 text-blue-700";
            break;
        case "Not Vaccinated":
            vaccinationClass = "bg-red-100 text-red-700";
            break;
        case "Unknown":
            vaccinationClass = "bg-gray-100 text-gray-700";
            break;
    }
    vaccination.className = `px-4 py-2 rounded-full text-sm font-medium ${vaccinationClass}`;

    // Behavior
    document.getElementById("modalBehavior").textContent = pet.behavior || "No description.";

    renderMedicalHistory(pet.medical_history);
        const tags = document.getElementById("modalTags");

    document.getElementById("viewPetModal").classList.remove("hidden");
    document.getElementById("viewPetModal").classList.add("flex");
    tags.innerHTML = "";

if (pet.personality) {

    pet.personality.split(",").forEach(tag => {

        tags.innerHTML += `
            <span
                class="
                bg-blue-600
                text-white
                text-sm
                font-semibold
                px-4
                py-2
                rounded-full">

                ${tag.trim()}

            </span>
        `;

    });

}

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

                <td class="p-4">

                    ${record.treatment}

                </td>

                <td class="p-4">

                    ${date}

                </td>

                <td class="p-4">

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
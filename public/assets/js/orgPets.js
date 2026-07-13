document.addEventListener("DOMContentLoaded", async () => {
    // Load shared dashboard components
    await loadSidebar("pets");
    
    await loadTopbar({
        title: "Pets",
        subtitle: "Manage pet profiles, monitor availability, and oversee your organization's rescue animals."
    });

    // Load org pets from db
    await loadPets();
});

// ==========================
// PET MODAL
// ==========================
const modal = document.getElementById("petModal");
const addPetBtn = document.getElementById("addPetBtn");
const closePetModal = document.getElementById("closePetModal");
const cancelPetBtn = document.getElementById("cancelPetBtn");
const petForm = document.getElementById("petForm");

// OPEN MODAL
addPetBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
});

// CLOSE MODAL FUNCTION
function closeModal(){
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    petForm.reset();
}

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
// SET MAX DATE FOR BIRTHDATE
// ==========================
const birthDate = document.querySelector('input[name="birth_date"]');
const today = new Date().toISOString().split("T")[0];
birthDate.max = today;

// ==========================
// FORM SUBMIT PLACEHOLDER
// ==========================
// This will later connect to your PHP API
petForm.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const formData = new FormData(petForm);

    try {

        const response = await fetch("/org/pets/add", {

            method:"POST",

            body:formData

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

        if(data.success){

            alert(data.message);

            closeModal();

            petForm.reset();

             await loadPets();
        }

        else{

            alert(data.message);

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

    container.innerHTML = `
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            ${data.pets.map(createPetCard).join("")}
        </div>
    `;
}
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

    const image = pet.image_path ? `/uploads/pets/${pet.image_path}` : "/assets/images/no-image.png";
    const tags = [];

    if (pet.behavior_description) {
        const words = pet.behavior_description
            .split(/[,. ]+/)
            .filter(w => w.length > 3);

        [...new Set(words)].slice(0, 2).forEach(tag => {
            tags.push(tag.charAt(0).toUpperCase() + tag.slice(1));
        });
    }

    if (tags.length === 0) {
        tags.push("Friendly");
    }

    return `
        <div class="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
            <div class="relative">
                <img src="${image}" alt="${pet.name}" class="w-full h-64 object-cover">
                <span class="absolute top-4 left-4 ${speciesColor[pet.species] || "bg-blue-600"} text-white text-xs font-bold uppercase px-4 py-2 rounded-full shadow">
                    ${pet.species}
                </span>
                <span class="absolute top-4 right-4 ${statusColor[pet.adoption_status] || "bg-slate-500"} text-white text-xs font-bold uppercase px-4 py-2 rounded-full shadow">
                    ${pet.adoption_status}
                </span>
            </div>
            <div class="p-6">
                <h2 class="text-3xl font-bold text-slate-800">${pet.name}</h2>
                <p class="mt-1 text-slate-500 flex items-center flex-wrap gap-2">
                    <span>${pet.species}</span>
                    <span>•</span>
                    <span>${pet.age}</span>
                    <span>•</span>
                    <span class="${genderColor}">
                        <i class="fa-solid ${genderIcon}"></i>
                        ${pet.gender}
                    </span>
                </p>
                <div class="flex flex-wrap gap-2 mt-5">
                    ${tags.map(tag => `
                        <span class="bg-slate-100 text-slate-700 text-sm font-medium px-4 py-1 rounded-full">
                            ${tag}
                        </span>
                    `).join("")}
                </div>
                <button class="mt-6 w-full border border-slate-300 rounded-2xl py-3 font-semibold text-slate-700 hover:bg-slate-100 transition">
                    View Profile
                </button>
            </div>
        </div>
    `;
}
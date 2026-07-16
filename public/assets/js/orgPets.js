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
const petImageInput = document.getElementById("petImageInput");
const petImagePreview = document.getElementById("petImagePreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const selectedFileName = document.getElementById("selectedFileName");
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
    traitsContainer.innerHTML = "";
    personalityTags.value = "";

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
    formData.append(
        "medical_history",
        JSON.stringify(medicalList)
    );

    console.log("Hidden field:", personalityTags.value);

    console.log("FormData:");
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
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

    // Personality Tags
    const tags = pet.personality_tags
        ? pet.personality_tags
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
        : [];

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
                <p class="mt-1 text-slate-500 flex items-center flex-wrap gap-2 text-sm font-bold">
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
                    ${
                        tags.length
                            ? tags.map(tag => `
                                <span class="bg-slate-100 text-slate-700 text-sm font-medium px-4 py-1 rounded-full">
                                    ${tag}
                                </span>
                            `).join("")
                            : `<span class="text-slate-400 text-sm italic">No personality tags</span>`
                    }
                </div>
                <button
                    class="viewPetBtn mt-5 w-full rounded-2xl border border-slate-200 bg-white py-3 text-base font-semibold text-blue-900 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    data-id="${pet.animal_id}">
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
    document.getElementById("editPetBtn").onclick = () => {

    editingPetId = pet.animal_id;
    document.getElementById("animal_id").value = pet.animal_id;
    petForm.name.value = pet.name;
    petForm.species.value = pet.species;
    petForm.gender.value = pet.gender;
    petForm.age.value = pet.age;
    petForm.birth_date.value = pet.birth_date
        ? pet.birth_date.split("T")[0]
        : "";
    petForm.color.value = pet.color || "";
    petForm.health_status.value = pet.health_status;
    petForm.vaccination_status.value = pet.vaccination_status;
    petForm.adoption_status.value = pet.adoption_status;
    petForm.behavior_description.value = pet.behavior_description || "";
    traitsContainer.innerHTML = "";

    if (pet.personality_tags) {
        pet.personality_tags
            .split(",")
            .forEach(tag => addTrait(tag.trim()));
    }

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
        `Are you sure you want to delete ${pet.name}?`
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
    const viewModal = document.getElementById("viewPetModal");

    document.getElementById("viewPetImage").src =
        pet.image_path
            ? `/uploads/pets/${pet.image_path}`
            : "/assets/images/no-image.png";

    document.getElementById("viewName").textContent = pet.name;

    document.getElementById("viewSpecies").textContent = pet.species;

    document.getElementById("viewGender").textContent = pet.gender;

    document.getElementById("viewAge").textContent = pet.age;

    document.getElementById("viewColor").textContent =
        pet.color || "Unknown";

    document.getElementById("viewBirthDate").textContent =
        pet.birth_date || "Unknown";

    document.getElementById("viewVaccination").textContent =
        pet.vaccination_status;

    document.getElementById("viewHealthStatus").textContent =
        pet.health_status;

    document.getElementById("viewHealth").textContent =
        pet.health_status;

    document.getElementById("viewStatus").textContent =
        pet.adoption_status;

    document.getElementById("viewDescription").textContent =
        pet.behavior_description || "No description.";

    // Personality Tags
    const tags = document.getElementById("viewTags");
    tags.innerHTML = "";

    if (pet.personality_tags) {

        pet.personality_tags.split(",").forEach(tag => {

            tags.innerHTML += `
                <span class="bg-blue-700 text-white px-3 py-1 rounded-full text-sm">
                    ${tag.trim()}
                </span>
            `;

        });

    }

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

// ==========================
// PERSONALITY TAGS
// ==========================

const traitInput = document.getElementById("traitInput");
const addTraitBtn = document.getElementById("addTraitBtn");
const traitsContainer = document.getElementById("traitsContainer");
const personalityTags = document.getElementById("personalityTags");
let medicalList = [];

function addTrait(value) {

    value = value.trim();

    if (!value) return;

    // prevent duplicates
    const exists = [...traitsContainer.querySelectorAll(".trait-tag")]
        .some(tag => tag.dataset.value.toLowerCase() === value.toLowerCase());

    if (exists) {
        traitInput.value = "";
        return;
    }

    const span = document.createElement("span");

    span.className =
        "trait-tag inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium";

    span.dataset.value = value;

    span.innerHTML = `
        ${value}
        <button
            type="button"
            class="text-red-500 hover:text-red-700 font-bold">
            <i class="fa-solid fa-xmark text-xs"></i>
        </button>
    `;

    span.querySelector("button").addEventListener("click", () => {

        span.remove();

        updateTraitField();

    });

    traitsContainer.appendChild(span);

    traitInput.value = "";

    updateTraitField();
}
addTraitBtn.addEventListener("click", () => {

    addTrait(traitInput.value);

});
traitInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        e.preventDefault();

        addTrait(traitInput.value);

    }

});
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

    traitsContainer.innerHTML = "";
    personalityTags.value = "";

}
function updateTraitField() {

    const tags = [...traitsContainer.querySelectorAll(".trait-tag")]
        .map(tag => tag.dataset.value);

    personalityTags.value = tags.join(",");

    console.log("Updated tags:", personalityTags.value);
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
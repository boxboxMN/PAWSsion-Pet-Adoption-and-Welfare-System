
        async function loadComponent(id, file) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`Cannot load ${file}`);
            }

            document.getElementById(id).innerHTML =
                await response.text();

        } catch (error) {
            console.error(error);
        }
    }
    Promise.all([
        loadComponent("sidebar", "/user/userSidebar.html"),
        loadComponent("header", "/user/userHeader.html")
    ])
    .then(() => {

        document.getElementById("sidebar").style.visibility = "visible";
        document.getElementById("header").style.visibility = "visible";

        const currentPath = window.location.pathname;
        const pageTitle = document.getElementById("pageTitle");

        const links = document.querySelectorAll("#sidebar .nav-link");

        links.forEach(link => {

            const href = link.getAttribute("href");

            const isActive =
                href === currentPath ||
                (href !== "/dashboard" && currentPath.startsWith(href));

            if (isActive) {

                link.className =
                    "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl bg-blue-600 text-white shadow";

                if (pageTitle) {
                    pageTitle.textContent = link.dataset.title;
                }

            } else {

                link.className =
                    "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition";

            }

        });

    
        document.body.style.visibility = "visible";

    })
    .catch(error => console.error(error));

        const introScreen = document.getElementById("introScreen");
        const preferenceScreen = document.getElementById("preferenceScreen");
        const compatibilityScreen = document.getElementById("compatibilityScreen");

        function showScreen(screenToShow) {
            [introScreen, preferenceScreen, compatibilityScreen].forEach((screen) => {
                screen.classList.toggle("hidden", screen !== screenToShow);
            });

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

function showPreferenceScreen() {
    showScreen(preferenceScreen);
}

// =========================
// MATCH PETS
// =========================
async function showCompatibilityScreen() {

    const type = document.getElementById("type").value;
    const sex = document.getElementById("sex").value;
    const age = document.getElementById("age").value;
    const behavior = document.getElementById("behavior").value.trim();

    const message = document.getElementById("validationMessage");

    // Hide previous message
    message.classList.add("hidden");

    if (
        type === "Select Type" ||
        sex === "Select Sex" ||
        age === "Select Age" ||
        behavior === ""
    ) {
        message.classList.remove("hidden");
        return;
    }
    console.log(type, sex, age, behavior);

    try {

        const response = await fetch("/api/matchmaking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type,
                sex,
                age,
                behavior
            })
        });

        console.log("Response:", response.status);

        const data = await response.json();

        console.log(data);

        renderMatches(data.matches);

        showScreen(compatibilityScreen);

    } catch (err) {
        console.error(err);
    }
}
document
    .getElementById("introNextBtn")
    .addEventListener("click", showPreferenceScreen);

document
    .getElementById("preferenceBackBtn")
    .addEventListener("click", showIntroScreen);

document
    .getElementById("preferenceNextBtn")
    .addEventListener("click", showCompatibilityScreen);

document
    .getElementById("compatibilityRestartBtn")
    .addEventListener("click", showIntroScreen);

function showIntroScreen() {
    showScreen(introScreen);
}
let matchedPets = [];
function renderMatches(matches) {
      matchedPets = matches;
    const container = document.querySelector("#compatibilityScreen .grid");
    container.innerHTML = "";

    if (!matches.length) {
        container.innerHTML = `
            <div class="col-span-full bg-white rounded-3xl shadow-sm border border-gray-200 py-16 text-center">
                <i class="fa-solid fa-heart-crack text-6xl text-gray-300 mb-5"></i>
                <h2 class="text-2xl font-bold text-gray-700">
                    No Compatible Pets Found
                </h2>
                <p class="text-gray-500 mt-3 max-w-lg mx-auto">
                    We couldn't find pets matching your preferences.
                    Try adjusting your criteria or writing a broader behavior description.
                </p>
            </div>
        `;
        return;
    }

    matches.forEach((pet, index) => {
        let badgeColor = "bg-red-500";

        if (pet.score >= 90) badgeColor = "bg-emerald-500";
        else if (pet.score >= 75) badgeColor = "bg-blue-600";
        else if (pet.score >= 60) badgeColor = "bg-yellow-500";

     container.innerHTML += `
<div class="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 max-w-[420px]">

    <!-- IMAGE -->
    <div class="relative">
        <img src="/uploads/pets/${pet.image_path}" class="w-full h-56 object-cover">

        <!-- Rank -->
        <div class="absolute top-3 left-3 bg-white rounded-full shadow px-3 py-1 text-xs font-semibold">
            #${index + 1}
        </div>

        <!-- Match Badge -->
        <div class="absolute top-3 right-3 ${badgeColor} text-white rounded-full px-3 py-1 text-sm font-bold shadow">
            ${pet.score}% Match
        </div>
    </div>

    <!-- BODY -->
    <div class="p-4 flex flex-col h-[360px]">

        <!-- Name -->
        <h2 class="text-xl font-bold text-gray-800">
            ${pet.name}
        </h2>

        <!-- Basic Info -->
        <p class="text-sm text-gray-500 mt-0">
            ${pet.species} • ${pet.gender} • ${pet.age}
        </p>


        <!-- Description Wrapper -->
        <div class="mt-2 h-28 border border-gray-200 rounded-2xl bg-gray-50 p-4 overflow-hidden">
            <p class="text-sm text-gray-600 leading-6 text-justify line-clamp-4">
                ${pet.pet_description}
            </p>
        </div>

        <!-- Similarity -->
        <div class="mt-auto">
            <div class="flex justify-between items-center text-sm mb-2">
                <span class="text-gray-600 font-medium">
                    Behavior Similarity
                </span>
                <span class="font-semibold text-blue-700">
                    ${pet.behaviorSimilarity}%
                </span>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                    class="bg-blue-600 h-2 rounded-full"
                    style="width:${pet.behaviorSimilarity}%">
                </div>
            </div>
        </div>

        <!-- Button -->
        <button
            class="view-profile-btn w-full mt-5 bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-xl font-semibold"
            data-id="${pet.animal_id}">
            View Pet Profile
        </button>

    </div>
</div>
`;
    });
}
// =========================
// VIEW PET PROFILE BUTTON
// =========================
document.addEventListener("click", (e) => {

    const btn = e.target.closest(".view-profile-btn");

    if (!btn) return;

    const id = Number(btn.dataset.id);

    const index = matchedPets.findIndex(p => p.animal_id == id);
    if (index !== -1) {
        openMatchPetModal(matchedPets[index], index + 1);
    }

});
function openMatchPetModal(pet, rank) {
    console.log(pet);
    // ===========================
    // BASIC INFO
    // ===========================
    document.getElementById("modalImage").src = `/uploads/pets/${pet.image_path}`;
    document.getElementById("modalName").textContent = pet.name;
    document.getElementById("modalSpecies").textContent = pet.species;
    document.getElementById("modalGender").textContent = pet.gender;
    document.getElementById("modalAge").textContent = pet.age;
    document.getElementById("modalBehavior").textContent = pet.pet_description || "No description available.";
    document.getElementById("modalStatus").textContent = pet.status || "Available";
    document.getElementById("modalHealth").textContent = pet.health_status;
    document.getElementById("modalVaccination").textContent = pet.vaccination_status;
    // ======================
    // Adoption Status Remark
    // ======================
    const statusRemark = document.getElementById("modalStatus");

    switch (pet.status || "Available") {
        case "Available":
            statusRemark.textContent = "🟢 Ready for Adoption";
            break;
        case "Pending":
            statusRemark.textContent = "🟡 Adoption in Progress";
            break;
        case "Adopted":
            statusRemark.textContent = "💙 Successfully Adopted";
            break;
        case "Archived":
            statusRemark.textContent = "⚪ No Longer Listed";
            break;
        default:
            statusRemark.textContent = "";
    }

    // ======================
    // Health Status Remark
    // ======================
    const healthRemark = document.getElementById("modalHealth");

    switch (pet.health_status) {
        case "Healthy":
            healthRemark.textContent = "💚 Excellent Condition";
            break;
        case "Recovered":
            healthRemark.textContent = "🌿 Recovered";
            break;
        case "Under Treatment":
            healthRemark.textContent = "🩺 Under Treatment";
            break;
        case "Sick":
            healthRemark.textContent = "❤️ Needs Extra Care";
            break;
        default:
            healthRemark.textContent = "";
    }

    // ==========================
    // Vaccination Status Remark
    // ==========================
    const vaccinationRemark = document.getElementById("modalVaccination");

    switch (pet.vaccination_status) {
        case "Vaccinated":
            vaccinationRemark.textContent = "💉 Vaccinated";
            break;
        case "Not Vaccinated":
            vaccinationRemark.textContent = "⚠️ Not Yet Vaccinated";
            break;
        case "Unknown":
            vaccinationRemark.textContent = "❓ Vaccination Record Unavailable";
            break;
        default:
            vaccinationRemark.textContent = "";
    }
    document.getElementById("modalOrganization").textContent = pet.organization_name || "Unknown Organization";
   
   
    // ===========================
    // MATCH SCORE
    // ===========================
  
    document.getElementById("modalRank").textContent = rank;
    document.getElementById("modalScore").textContent = pet.score + "%";
    document.getElementById("modalFinalScore").textContent = pet.score + "%";
    document.getElementById("modalFinalScoreBar").style.width = pet.score + "%";        
    const remark = document.getElementById("modalMatchRemark");
        if (pet.score >= 90) {
            remark.textContent = "Perfect Match 💚";
        }
        else if (pet.score >= 80) {
            remark.textContent = "Excellent Match 🌟";
        }
        else if (pet.score >= 70) {
            remark.textContent = "Great Match ❤️";
        }
        else if (pet.score >= 60) {
            remark.textContent = "Good Match 👍";
        }
        else {
            remark.textContent = "Possible Match 🐾";
        }

    // ===========================
    // MEDICAL HISTORY
    // ===========================
    const body = document.getElementById("modalMedicalBody");
    body.innerHTML = "";

    if (pet.medical_history && pet.medical_history.length) {
        pet.medical_history.forEach(record => {
            body.innerHTML += `
            <tr>
                <td class="px-6 py-4">${record.treatment}</td>
                <td class="px-6 py-4">${record.date}</td>
                <td class="px-6 py-4">${record.administered_by}</td>
            </tr>`;
        });
    } else {
        body.innerHTML = `
        <tr>
            <td colspan="3" class="text-center py-8 text-slate-400">No medical history available.</td>
        </tr>`;
    }

    // ===========================
    // OPEN MODAL
    // ===========================
    document.getElementById("viewPetModal").classList.remove("hidden");
    document.getElementById("viewPetModal").classList.add("flex");

}
function closeMatchPetModal() {

    document.getElementById("viewPetModal").classList.add("hidden");
    document.getElementById("viewPetModal").classList.remove("flex");
}

// REMARKS
const healthTag = document.getElementById("modalHealth").parentElement;

switch (pet.health_status) {
    case "Healthy":
        healthTag.className =
            "flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium";
        break;

    case "Recovered":
        healthTag.className =
            "flex items-center gap-2 px-4 py-2 rounded-full bg-lime-50 border border-lime-200 text-lime-700 text-sm font-medium";
        break;

    case "Under Treatment":
        healthTag.className =
            "flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium";
        break;

    case "Sick":
        healthTag.className =
            "flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-medium";
        break;
}
const vaccineTag = document.getElementById("modalVaccination").parentElement;

switch (pet.vaccination_status) {
    case "Vaccinated":
        vaccineTag.className =
            "flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium";
        break;

    case "Not Vaccinated":
        vaccineTag.className =
            "flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium";
        break;

    case "Unknown":
        vaccineTag.className =
            "flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium";
        break;
}

// ==========================================================
// MATCH RESULTS
// ==========================================================

// Original results returned by the AI
let allMatchResults = [];

// Currently displayed results after filters
let filteredMatchResults = [];
// ==========================================================
// FILTER HELPER FUNCTIONS
// ==========================================================

function normalizeFilterText(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}


// ==========================================================
// GET PET DATA
// ==========================================================

function getPetData(match) {
    return match?.pet || match || {};
}


// ==========================================================
// GET PET NAME
// ==========================================================

function getMatchPetName(match) {
    const pet = getPetData(match);

    return normalizeFilterText(
        match?.name ||
        match?.pet_name ||
        pet?.name ||
        pet?.pet_name ||
        ""
    );
}


// ==========================================================
// GET ORGANIZATION
// ==========================================================

function getMatchOrganization(match) {
    const pet = getPetData(match);

    return normalizeFilterText(
        match?.organization_name ||
        match?.organization ||
        match?.org_name ||
        pet?.organization_name ||
        pet?.organization ||
        pet?.org_name ||
        ""
    );
}


// ==========================================================
// GET SPECIES
// ==========================================================

function getMatchSpecies(match) {
    const pet = getPetData(match);

    return normalizeFilterText(
        match?.species ||
        match?.pet_species ||
        pet?.species ||
        pet?.pet_species ||
        ""
    );
}


// ==========================================================
// GET GENDER
// ==========================================================

function getMatchGender(match) {
    const pet = getPetData(match);

    return normalizeFilterText(
        match?.gender ||
        match?.sex ||
        match?.pet_gender ||
        match?.pet_sex ||
        pet?.gender ||
        pet?.sex ||
        pet?.pet_gender ||
        pet?.pet_sex ||
        ""
    );
}


// ==========================================================
// GET AGE
// ==========================================================

function getMatchAge(match) {
    const pet = getPetData(match);

    return normalizeFilterText(
        match?.age ||
        match?.age_category ||
        match?.age_group ||
        pet?.age ||
        pet?.age_category ||
        pet?.age_group ||
        ""
    );
}


// ==========================================================
// NORMALIZE AGE CATEGORY
// ==========================================================

function normalizeAgeCategory(ageValue) {

    const age = normalizeFilterText(ageValue);

    if (!age) {
        return "";
    }

    if (
        age.includes("puppy") ||
        age.includes("kitten") ||
        age.includes("0-1") ||
        age.includes("0 - 1") ||
        age.includes("0–1")
    ) {
        return "puppy/kitten";
    }

    if (
        age.includes("adolescence") ||
        age.includes("adolescent") ||
        age.includes("2-3") ||
        age.includes("2 - 3") ||
        age.includes("2–3")
    ) {
        return "adolescence";
    }

    if (
        age.includes("adult") ||
        age.includes("4-7") ||
        age.includes("4 - 7") ||
        age.includes("4–7")
    ) {
        return "adult";
    }

    if (
        age.includes("senior") ||
        age.includes("8-10") ||
        age.includes("8 - 10") ||
        age.includes("8–10")
    ) {
        return "senior";
    }

    return age;
}


// ==========================================================
// GET MATCH SCORE
// ==========================================================

function getMatchScore(match) {

    return (
        match?.score ??
        match?.match_score ??
        match?.similarity_score ??
        match?.final_score ??
        match?.compatibility_score ??
        0
    );
}

// ==========================================================
// GET MATCH SCORE AS PERCENTAGE
// ==========================================================

function getMatchScorePercent(match) {

    let score = Number(getMatchScore(match));

    if (!Number.isFinite(score)) {
        return 0;
    }

    // Handles 0.91 → 91
    if (score >= 0 && score <= 1) {
        score *= 100;
    }

    return score;
}

// start
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
        const loadingScreen = document.getElementById("matchingLoadingScreen");
        const compatibilityScreen = document.getElementById("compatibilityScreen");

        function showScreen(screenToShow) {
            [
                introScreen,
                preferenceScreen,
                loadingScreen,
                compatibilityScreen
            ].forEach((screen) => {

                screen.classList.toggle(
                    "hidden",
                    screen !== screenToShow
                );

            });

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
        function showLoadingScreen() {
            showScreen(loadingScreen);
        }
        function showPreferenceScreen() {
            showScreen(preferenceScreen);
        }
        
// ==========================================================
// UPDATE MATCHING PROGRESS
// ==========================================================

function updateMatchingProgress(percent, message) {
    const progressBar = document.getElementById("matchingProgressBar");
    const progressText = document.getElementById("matchingProgressText");
    const loadingMessage = document.getElementById("matchingLoadingMessage");

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${percent}%`;
    if (loadingMessage && message) loadingMessage.textContent = message;
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

    // ==============================
    // VALIDATION
    // ==============================
    if (
        !type ||
        !sex ||
        !age ||
        !behavior
    ) {
        message.classList.remove("hidden");
        return;
    }

    console.log(type, sex, age, behavior);

        // ==============================
        // SHOW LOADING SCREEN
        // ==============================
        showLoadingScreen();

        // Reset progress to 0%
        updateMatchingProgress(
            0,
            "Preparing your preferences..."
        );

        // Give the browser a moment to render
        await new Promise(resolve => setTimeout(resolve, 1000));

        // ==============================
        // PROGRESS: 20%
        // ==============================
        updateMatchingProgress(
            20,
            "Analyzing your preferences..."
        );

        await new Promise(resolve => setTimeout(resolve, 2000));

        // ==============================
        // PROGRESS: 40%
        // ==============================
        updateMatchingProgress(
            40,
            "Searching through available pets..."
        );

        await new Promise(resolve => setTimeout(resolve, 2000));

        // ==============================
        // PROGRESS: 60%
        // ==============================
        updateMatchingProgress(
            60,
            "Comparing your preferences with pet profiles..."
        );

        await new Promise(resolve => setTimeout(resolve, 2000));

        try {

            // ==============================
            // AI MATCHING REQUEST
            // ==============================

            updateMatchingProgress(
                70,
                "Our AI is calculating compatibility..."
            );
            await new Promise(resolve => setTimeout(resolve, 1000));

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

            if (!response.ok) {
                throw new Error(
                    `Matching request failed: ${response.status}`
                );
            }

            // ==============================
            // RESPONSE RECEIVED
            // ==============================

            updateMatchingProgress(
                85,
                "Ranking your best matches..."
            );
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const data = await response.json();

            console.log(data);

            // ==============================
            // RENDER MATCHES
            // ==============================

            renderMatches(data.matches);

            // ==============================
            // COMPLETE
            // ==============================

            updateMatchingProgress(
                100,
                "Your matches are ready!"
            );

            // Let user see 100%
            await new Promise(resolve => setTimeout(resolve, 1000));

            // ==============================
            // SHOW RESULTS
            // ==============================

            showScreen(compatibilityScreen);

        } catch (err) {

            console.error("Matching error:", err);

            // If something goes wrong,
            // return to preference screen
            showScreen(preferenceScreen);

            message.textContent =
                "Something went wrong while finding matches. Please try again.";

            message.classList.remove("hidden");
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
// ==========================================================
// RENDER MATCH RESULTS
// ==========================================================

let matchedPets = [];

function renderMatches(matches) {
    allMatchResults = Array.isArray(matches) ? matches : [];
    filteredMatchResults = [...allMatchResults];
    matchedPets = [...allMatchResults];

    populateOrganizationFilter(allMatchResults);
    renderPetCards(allMatchResults);
    updateMatchResultCount(allMatchResults.length);
}
// ==========================================================
// RENDER PET CARDS
// ==========================================================

function renderPetCards(matches) {
    const container = document.getElementById("matchResultsContainer");

    if (!container) {
        console.error("matchResultsContainer was not found.");
        return;
    }

    container.innerHTML = "";

    if (!Array.isArray(matches) || matches.length === 0) {
        renderNoMatchesMessage();
        return;
    }

    matches.forEach((pet, index) => {
        const score = getMatchScorePercent(pet);

        let badgeStyle = "from-amber-500 to-orange-600 text-white";
        if (score >= 90) badgeStyle = "from-emerald-500 to-teal-600 text-white";
        else if (score >= 75) badgeStyle = "from-blue-600 to-indigo-600 text-white";
        else if (score >= 60) badgeStyle = "from-yellow-500 to-amber-600 text-white";

        container.innerHTML += `
        <div class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/80 flex flex-col justify-between mx-auto w-full max-w-[420px]">
            <!-- IMAGE SECTION -->
            <div class="relative overflow-hidden bg-slate-100">
                <img src="/uploads/pets/${pet.image_path || ''}" class="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-105" alt="${pet.name || 'Pet'}">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80"></div>
                
                <!-- Rank -->
                <div class="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-white/50 rounded-xl px-3 py-1 shadow-md text-slate-900 font-extrabold text-xs flex items-center gap-1">
                    <i class="fa-solid fa-crown text-amber-500 text-[11px]"></i>
                    <span>RANK ${index + 1}</span>
                </div>

                <!-- Score -->
                <div class="absolute top-3 right-3 bg-gradient-to-r ${badgeStyle} rounded-xl px-3 py-1 shadow-md text-xs font-bold flex items-center gap-1">
                    <i class="fa-solid fa-sparkles text-xs"></i>
                    <span>${score.toFixed(0)}% Match</span>
                </div>

                <!-- Pet Name -->
                <div class="absolute bottom-3 left-4 right-4">
                    <div class="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 shadow-md shadow-slate-900/10">
                        <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">${pet.name || "Unnamed Pet"}</h2>
                    </div>
                </div>
            </div>

            <!-- CARD BODY -->
            <div class="p-5 flex flex-col flex-1 justify-between gap-4">
                <!-- META DETAILS -->
                <div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
                    <span class="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60">
                        <i class="fa-solid fa-dna text-slate-400 text-[10px]"></i> ${pet.species || "Unknown"}
                    </span>
                    <span class="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60">
                        <i class="fa-solid fa-venus-mars text-slate-400 text-[10px]"></i> ${pet.gender || pet.sex || "Unknown"}
                    </span>
                    <span class="inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60">
                        <i class="fa-regular fa-calendar-days text-slate-400 text-[10px]"></i> ${pet.age || "Unknown"}
                    </span>
                </div>

                <!-- ORGANIZATION -->
                <div class="rounded-2xl bg-slate-50 border border-slate-200/70 p-3.5 flex-1">
                    <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        <i class="fa-solid fa-building text-slate-400 text-[10px]"></i> Organization
                    </p>
                    <p class="text-sm font-semibold text-slate-800 break-words">${pet.organization_name || "Unknown Organization"}</p>
                </div>

                <!-- MATCH SCORE -->
                <div class="space-y-2">
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-slate-500 font-semibold flex items-center gap-1.5">
                            <i class="fa-solid fa-medal text-blue-600 text-xs"></i> Match Score
                        </span>
                        <span class="font-extrabold text-blue-700">${score.toFixed(0)}%</span>
                    </div>

                    <!-- SCORE BAR -->
                    <div class="w-full h-2 rounded-full overflow-hidden bg-slate-100 border border-slate-200/60 flex">
                        <div class="bg-blue-700 h-full transition-all duration-500" style="width:${Number(pet.behaviorContribution) || 0}%" title="Behavior"></div>
                        <div class="bg-blue-500 h-full transition-all duration-500" style="width:${Number(pet.ageContribution) || 0}%" title="Age"></div>
                        <div class="bg-blue-300 h-full transition-all duration-500" style="width:${Number(pet.sexContribution) || 0}%" title="Sex"></div>
                    </div>

                    <!-- LEGEND -->
                    <div class="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-blue-700"></span> Behavior</span>
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Age</span>
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-blue-300"></span> Sex</span>
                    </div>
                </div>

                <!-- VIEW PROFILE -->
                <button type="button" class="view-profile-btn w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer" data-id="${pet.animal_id}">
                    <i class="fa-regular fa-eye text-sm"></i>
                    <span>View Full Profile</span>
                </button>
            </div>
        </div>`;
    });
}
// ==========================================================
// NO MATCHES MESSAGE
// ==========================================================

function renderNoMatchesMessage() {
    const container = document.getElementById("matchResultsContainer");
    if (!container) return;

    container.innerHTML = `
        <div class="col-span-full bg-gradient-to-b from-white to-slate-50 rounded-3xl shadow-xs border border-slate-200/80 p-12 text-center">
            <div class="w-20 h-20 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <i class="fa-solid fa-heart-crack text-4xl text-rose-500"></i>
            </div>
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">No Compatible Pets Found</h2>
            <p class="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                No pets match your current filters. Try changing or clearing your filters.
            </p>
        </div>`;
}

// ==========================================================
// UPDATE RESULT COUNT
// ==========================================================

function updateMatchResultCount(count) {
    const resultCount = document.getElementById("matchResultCount");
    if (resultCount) {
        resultCount.textContent = count;
    }
}
// ==========================================================
// POPULATE ORGANIZATION FILTER
// ==========================================================

function populateOrganizationFilter(matches) {
    const select = document.getElementById("matchOrganizationFilter");
    if (!select) return;

    select.innerHTML = '<option value="">All Organizations</option>';

    const organizations = [
        ...new Set(matches.map(match => getMatchOrganization(match)).filter(Boolean))
    ].sort();

    organizations.forEach(organization => {
        const option = document.createElement("option");
        option.value = organization;
        option.textContent = organization.replace(/\b\w/g, char => char.toUpperCase());
        select.appendChild(option);
    });
}
// ==========================================================
// APPLY MATCH FILTERS
// ==========================================================

function applyMatchFilters() {

    // ======================================================
    // GET FILTER VALUES
    // ======================================================

    const searchValue =
        normalizeFilterText(
            document.getElementById("matchSearch")?.value
        );

    const speciesValue =
        normalizeFilterText(
            document.getElementById("matchSpeciesFilter")?.value
        );

    const genderValue =
        normalizeFilterText(
            document.getElementById("matchGenderFilter")?.value
        );

    const ageValue =
        normalizeFilterText(
            document.getElementById("matchAgeFilter")?.value
        );

    const organizationValue =
        normalizeFilterText(
            document.getElementById("matchOrganizationFilter")?.value
        );

    const scoreFilter =
        Number(
            document.getElementById("matchScoreFilter")?.value
        ) || 0;


    // ======================================================
    // FILTER ORIGINAL RESULTS
    // ======================================================

    filteredMatchResults =
        allMatchResults.filter(match => {

            // ----------------------------------------------
            // PET DATA
            // ----------------------------------------------

            const pet =
                getPetData(match);


            // ----------------------------------------------
            // NAME
            // ----------------------------------------------

            const petName =
                getMatchPetName(match);


            // ----------------------------------------------
            // ORGANIZATION
            // ----------------------------------------------

            const organization =
                getMatchOrganization(match);


            // ----------------------------------------------
            // SPECIES
            // ----------------------------------------------

            const species =
                getMatchSpecies(match);


            // ----------------------------------------------
            // GENDER
            // ----------------------------------------------

            const gender =
                getMatchGender(match);


            // ----------------------------------------------
            // AGE
            // ----------------------------------------------

            const age =
                getMatchAge(match);

            const normalizedAge =
                normalizeAgeCategory(age);


            // ----------------------------------------------
            // SCORE
            // ----------------------------------------------

            const score =
                getMatchScorePercent(match);


            // =================================================
            // SEARCH
            // =================================================

            const matchesSearch =
                !searchValue ||
                petName.includes(searchValue) ||
                organization.includes(searchValue);


            // =================================================
            // SPECIES
            // =================================================

            const matchesSpecies =
                !speciesValue ||
                species === speciesValue;


            // =================================================
            // GENDER
            // =================================================

            const matchesGender =
                !genderValue ||
                gender === genderValue;


            // =================================================
            // AGE
            // =================================================

            const matchesAge =
                !ageValue ||
                normalizedAge === ageValue;


            // =================================================
            // ORGANIZATION
            // =================================================

            const matchesOrganization =
                !organizationValue ||
                organization === organizationValue;


            // =================================================
            // SCORE
            // =================================================

            const matchesScore =
                score >= scoreFilter;


            // =================================================
            // FINAL RESULT
            // =================================================

            return (
                matchesSearch &&
                matchesSpecies &&
                matchesGender &&
                matchesAge &&
                matchesOrganization &&
                matchesScore
            );

        });


    // ======================================================
    // KEEP VIEW PROFILE DATA SYNCHRONIZED
    // ======================================================

    matchedPets =
        [...filteredMatchResults];


    // ======================================================
    // RENDER FILTERED RESULTS
    // ======================================================

    renderPetCards(filteredMatchResults);


    // ======================================================
    // UPDATE COUNT
    // ======================================================

    updateMatchResultCount(
        filteredMatchResults.length
    );
}
// ==========================================================
// FILTER EVENT LISTENERS
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    const search =
        document.getElementById("matchSearch");

    const species =
        document.getElementById("matchSpeciesFilter");

    const gender =
        document.getElementById("matchGenderFilter");

    const age =
        document.getElementById("matchAgeFilter");

    const organization =
        document.getElementById("matchOrganizationFilter");

    const score =
        document.getElementById("matchScoreFilter");

    const clear =
        document.getElementById("clearMatchFilters");


    // ======================================================
    // SEARCH
    // ======================================================

    if (search) {

        search.addEventListener(
            "input",
            applyMatchFilters
        );

    }


    // ======================================================
    // DROPDOWN FILTERS
    // ======================================================

    [
        species,
        gender,
        age,
        organization,
        score

    ].forEach(filter => {

        if (filter) {

            filter.addEventListener(
                "change",
                applyMatchFilters
            );

        }

    });


    // ======================================================
    // CLEAR FILTERS
    // ======================================================

    if (clear) {

        clear.addEventListener(
            "click",
            () => {

                if (search) {
                    search.value = "";
                }

                if (species) {
                    species.value = "";
                }

                if (gender) {
                    gender.value = "";
                }

                if (age) {
                    age.value = "";
                }

                if (organization) {
                    organization.value = "";
                }

                if (score) {
                    score.value = "";
                }

                // Reapply with everything cleared
                applyMatchFilters();

            }
        );

    }

});
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

    // Save currently selected pet
    window.currentSelectedPet = pet;

    // Save pet id to Apply button
    const applyBtn = document.getElementById("applyBtn");
    applyBtn.onclick = () => {
        window.location.href =
            `/user/adoptionHub.html?petId=${pet.animal_id}`;
    };

    // ===========================
    // BASIC INFO
    // ===========================
    document.getElementById("modalImage").src = `/uploads/pets/${pet.image_path}`;
    document.getElementById("modalName").textContent = pet.name;
    document.getElementById("modalSpecies").textContent = pet.species;
    document.getElementById("modalGender").textContent = pet.gender;
    document.getElementById("modalAge").textContent = pet.age;
    document.getElementById("modalBehavior").textContent = pet.pet_description || "No description available.";
    document.getElementById("modalOrganization").textContent = pet.organization_name || "Unknown Organization";
    // ======================
    // Adoption Status Remark
    // ======================
    const statusBadge = document.getElementById("statusBadge");
    const statusRemark = document.getElementById("modalStatusRemark");

    // Reset classes
    statusBadge.className =
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold";

    switch (pet.adoption_status) {

        case "Available":
            statusRemark.textContent = "🟢 Available";
            statusBadge.classList.add(
                "bg-emerald-50",
                "border",
                "border-emerald-200",
                "text-emerald-800"
            );
            break;

        case "Pending":
            statusRemark.textContent = "🟡 Adoption in Progress";
            statusBadge.classList.add(
                "bg-yellow-50",
                "border",
                "border-yellow-200",
                "text-yellow-800"
            );
            break;

        case "Adopted":
            statusRemark.textContent = "💙 Successfully Adopted";
            statusBadge.classList.add(
                "bg-blue-50",
                "border",
                "border-blue-200",
                "text-blue-800"
            );
            break;

        case "Archived":
            statusRemark.textContent = "⚪ No Longer Listed";
            statusBadge.classList.add(
                "bg-slate-100",
                "border",
                "border-slate-300",
                "text-slate-700"
            );
            break;

        default:
            statusRemark.textContent = "Unknown";
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
    const healthBadge = document.getElementById("healthBadge");
    const healthRemark = document.getElementById("modalHealthRemark");

    // Reset classes
    healthBadge.className =
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium";

    switch (pet.health_status) {

        case "Healthy":
            healthRemark.textContent = "💚 Excellent Condition";
            healthBadge.classList.add(
                "bg-emerald-50",
                "border",
                "border-emerald-200",
                "text-emerald-800"
            );
            break;

        case "Recovered":
            healthRemark.textContent = "🌿 Recovered";
            healthBadge.classList.add(
                "bg-green-50",
                "border",
                "border-green-200",
                "text-green-700"
            );
            break;

        case "Under Treatment":
            healthRemark.textContent = "🩺 Under Treatment";
            healthBadge.classList.add(
                "bg-yellow-50",
                "border",
                "border-yellow-200",
                "text-yellow-800"
            );
            break;

        case "Sick":
            healthRemark.textContent = "❤️ Needs Extra Care";
            healthBadge.classList.add(
                "bg-red-50",
                "border",
                "border-red-200",
                "text-red-700"
            );
            break;

        default:
            healthRemark.textContent = "Unknown";
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
    const vaccinationBadge = document.getElementById("vaccinationBadge");
    const vaccinationRemark = document.getElementById("modalVaccinationRemark");

    // Reset classes
    vaccinationBadge.className =
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium";

    switch (pet.vaccination_status) {

        case "Vaccinated":
            vaccinationRemark.textContent = "💉 Vaccinated";
            vaccinationBadge.classList.add(
                "bg-blue-50",
                "border",
                "border-blue-200",
                "text-blue-700"
            );
            break;

        case "Not Vaccinated":
            vaccinationRemark.textContent = "⚠️ Not Yet Vaccinated";
            vaccinationBadge.classList.add(
                "bg-orange-50",
                "border",
                "border-orange-200",
                "text-orange-700"
            );
            break;

        case "Unknown":
            vaccinationRemark.textContent = "❓ Vaccination Unknown";
            vaccinationBadge.classList.add(
                "bg-slate-100",
                "border",
                "border-slate-300",
                "text-slate-700"
            );
            break;

        default:
            vaccinationRemark.textContent = "Unknown";
            vaccinationBadge.classList.add(
                "bg-gray-50",
                "border",
                "border-gray-200",
                "text-gray-700"
            );
    }
   
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
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-2.5">${record.treatment}</td>
                <td class="px-4 py-2.5">${record.administered_date}</td>
                <td class="px-4 py-2.5">${record.administered_by}</td>
            </tr>`;
        });
    } else {
        body.innerHTML = `
        <tr>
            <td colspan="3" class="py-6 text-center text-slate-400">
                No medical history available.
            </td>
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

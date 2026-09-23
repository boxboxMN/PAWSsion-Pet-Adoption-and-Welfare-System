
// ==========================================================
// MATCH RESULTS
// ==========================================================

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
// BEHAVIOR INPUT NORMALIZATION
// ==========================================================

function normalizeBehaviorInput(rawInput) {

    return String(rawInput ?? "")
        .normalize("NFKC")
        .replace(/\s+/g, " ")
        .trim();
}


// ==========================================================
// CHECK FOR EXCESSIVE REPEATED CHARACTERS
// ==========================================================

function hasExcessiveCharacterRepetition(text) {

    return /(.)\1{5,}/u.test(text);
}


// ==========================================================
// CHECK FOR EXTREMELY LONG WORDS
// ==========================================================

// function hasExtremelyLongWord(text) {

//     const words = text.split(/\s+/);

//     return words.some(word => {

//         const cleanWord = word.replace(
//             /[^\p{L}\p{N}]/gu,
//             ""
//         );

//         return cleanWord.length > 40;
//     });
// }


// ==========================================================
// CHECK FOR MALFORMED WORD SEPARATORS
// ==========================================================

function hasMalformedSeparators(text) {

    return (
        /\p{L}[+_=|\\]\p{L}/u.test(text) ||
        /\p{L}[#$%]\p{L}/u.test(text)
    );
}


// ==========================================================
// CHECK FOR EXCESSIVE SYMBOLS
// ==========================================================

function hasExcessiveSymbols(text) {

    const letters = (
        text.match(/\p{L}/gu) || []
    ).length;

    const symbols = (
        text.match(
            /[^\p{L}\p{N}\s.,!?'"()\-]/gu
        ) || []
    ).length;

    // No letters at all
    if (letters === 0) {
        return true;
    }

    return symbols / letters > 0.30;
}


// ==========================================================
// CHECK FOR NO LETTERS
// ==========================================================

function hasNoLetters(text) {

    return !/\p{L}/u.test(text);
}


// ==========================================================
// CHECK FOR GIBBERISH-LIKE WORDS
// ==========================================================

function hasGibberishPattern(text) {

    const words =
        text.match(/\p{L}+/gu) || [];

    if (words.length === 0) {
        return true;
    }

    let suspiciousWords = 0;
    let longWords = 0;

    for (const word of words) {

        // Ignore short words because they can
        // legitimately have few or no vowels.
        if (word.length < 7) {
            continue;
        }

        longWords++;

        const vowels =
            word.match(
                /[aeiouáéíóúàèìòù]/giu
            ) || [];

        if (vowels.length === 0) {
            suspiciousWords++;
        }
    }

    // Only apply this heuristic when there
    // are at least 2 long words.
    return (
        longWords >= 2 &&
        suspiciousWords / longWords >= 0.5
    );
}


// ==========================================================
// CHECK FOR SUSPICIOUS WORD FORMATTING
// ==========================================================

function hasSuspiciousWordFormatting(text) {

    const words = text.split(/\s+/);

    let suspiciousCount = 0;

    for (const word of words) {

        // Ignore short words.
        if (word.length < 8) {
            continue;
        }

        // Detect camelCase / mashed formatting.
        // Example:
        // IWANTaKindpet
        // wantACalmPet
        if (/[a-z][A-Z]/.test(word)) {
            suspiciousCount++;
        }
    }

    return (
        words.length >= 2 &&
        suspiciousCount >= 1
    );
}


// ==========================================================
// CHECK FOR LIKELY MASHED WORDS
// ==========================================================

// function hasLikelyMashedWords(text) {

//     const words = text.split(/\s+/);

//     // A single very long token is suspicious because
//     // this field is expected to contain a description.
//     //
//     // Example:
//     // iwantakindpet
//     // iwantacalmfriendlydog
//     //
//     // This is only a heuristic.
//     if (words.length === 1) {

//         const word = words[0].replace(
//             /[^\p{L}]/gu,
//             ""
//         );

//         return word.length >= 15;
//     }

//     return false;
// }


// ==========================================================
// MAIN BEHAVIOR VALIDATION
// ==========================================================

function validateBehaviorInput(rawInput) {

    // Normalize the original input first.
    const behavior =
        normalizeBehaviorInput(rawInput);


    // ------------------------------------------------------
    // 1. EMPTY INPUT
    // ------------------------------------------------------

    if (!behavior) {

        return {
            valid: false,
            value: "",
            message:
                "Please describe the personality, behavior, and traits of your preferred pet."
        };
    }


    // ------------------------------------------------------
    // 2. NO LETTERS
    // ------------------------------------------------------

    if (hasNoLetters(behavior)) {

        return {
            valid: false,
            value: behavior,
            message:
                "Please describe your pet preferences using words, not only numbers or symbols."
        };
    }


    // ------------------------------------------------------
    // 3. EXCESSIVE CHARACTER REPETITION
    // ------------------------------------------------------

    if (hasExcessiveCharacterRepetition(behavior)) {

        return {
            valid: false,
            value: behavior,
            message:
                "Your description contains too many repeated characters. Please describe the personality, behavior, and traits of your preferred pet."
        };
    }


    // ------------------------------------------------------
    // 4. EXTREMELY LONG WORD
    // ------------------------------------------------------

    // if (hasExtremelyLongWord(behavior)) {

    //     return {
    //         valid: false,
    //         value: behavior,
    //         message:
    //             "Please use normal spaces between words when describing your pet preferences."
    //     };
    // }


    // ------------------------------------------------------
    // 5. MALFORMED WORD SEPARATORS
    // ------------------------------------------------------

    if (hasMalformedSeparators(behavior)) {

        return {
            valid: false,
            value: behavior,
            message:
                "Please use spaces between words instead of symbols such as +, _, or =."
        };
    }


    // ------------------------------------------------------
    // 6. EXCESSIVE SYMBOLS
    // ------------------------------------------------------

    if (hasExcessiveSymbols(behavior)) {

        return {
            valid: false,
            value: behavior,
            message:
                "Please use normal words and sentences to describe the personality, behavior, and traits of your preferred pet."
        };
    }


    // ------------------------------------------------------
    // 7. SUSPICIOUS WORD FORMATTING
    // ------------------------------------------------------

    if (hasSuspiciousWordFormatting(behavior)) {

        return {
            valid: false,
            value: behavior,
            message:
                "Please use normal spacing between words. For example, write 'I want a calm pet' instead of combining words together."
        };
    }

    // ------------------------------------------------------
    // 9. GIBBERISH
    // ------------------------------------------------------

    if (hasGibberishPattern(behavior)) {

        return {
            valid: false,
            value: behavior,
            message:
                "We couldn't understand your description. Please describe the personality, behavior, and traits of your preferred pet using normal words."
        };
    }


    // ------------------------------------------------------
    // 10. MINIMUM WORD COUNT
    // ------------------------------------------------------

    // const words =
    //     behavior.match(
    //         /\p{L}+(?:['’]\p{L}+)?/gu
    //     ) || [];

    // if (words.length < 5) {

    //     return {
    //         valid: false,
    //         value: behavior,
    //         message:
    //             "Please provide more meaningful details about the personality, behavior, and traits of your preferred pet."
    //     };
    // }


    // ------------------------------------------------------
    // 11. MINIMUM LETTER COUNT
    // ------------------------------------------------------

    // const letters =
    //     (
    //         behavior.match(
    //             /\p{L}/gu
    //         ) || []
    //     ).length;

    // if (letters < 10) {

    //     return {
    //         valid: false,
    //         value: behavior,
    //         message:
    //             "Please provide more meaningful details about the personality, behavior, and traits of your preferred pet."
    //     };
    // }


    // ------------------------------------------------------
    // 12. MINIMUM DESCRIPTION LENGTH
    // ------------------------------------------------------

    // if (behavior.length < 20) {

    //     return {
    //         valid: false,
    //         value: behavior,
    //         message:
    //             "Please provide a little more detail about the personality, behavior, and traits of your preferred pet."
    //     };
    // }


    // ------------------------------------------------------
    // 13. MAXIMUM DESCRIPTION LENGTH
    // ------------------------------------------------------

    if (behavior.length > 500) {

        return {
            valid: false,
            value: behavior,
            message:
                "Please keep your description within 500 characters."
        };
    }


    // ------------------------------------------------------
    // VALID
    // ------------------------------------------------------

    return {
        valid: true,
        value: behavior,
        message: ""
    };
}
// ==========================================================
// SANITIZE BEHAVIOR INPUT BEFORE REPAIR
// ==========================================================

function sanitizeBehaviorInput(rawInput) {

    // Make sure the input is always treated as text
    let text =
        normalizeBehaviorInput(rawInput);

    // ------------------------------------------------------
    // Replace punctuation with spaces
    // ------------------------------------------------------

    text = text.replace(
        /[.,!?;:]+/g,
        " "
    );


    // ------------------------------------------------------
    // Convert separated single letters
    //
    // p e t -> pet
    // d o g -> dog
    //
    // Only joins 3 or more consecutive
    // lowercase single-letter words.
    // ------------------------------------------------------

    text = text.replace(
        /\b(?:[a-z]\s+){2,}[a-z]\b/g,
        match =>
            match.replace(/\s+/g, "")
    );


    // ------------------------------------------------------
    // Collapse repeated spaces
    // ------------------------------------------------------

    text = text
        .replace(/\s+/g, " ")
        .trim();


    // IMPORTANT:
    // This function returns ONLY a string.
    // It does NOT call validateBehaviorInput().
    return text;
}
// ==========================================================
// MATCH PETS
// ==========================================================

async function showCompatibilityScreen() {

    const type =
        document.getElementById("type").value;

    const sex =
        document.getElementById("sex").value;

    const age =
        document.getElementById("age").value;

    const rawBehaviorInput =
        document.getElementById("behavior").value;


    // ======================================================
    // VALIDATION MESSAGE
    // ======================================================

    const message =
        document.getElementById("validationMessage");

    message.classList.add("hidden");


    // ======================================================
    // BASIC PREFERENCE VALIDATION
    // ======================================================

    if (!type || !sex || !age) {

        message.textContent =
            "Please complete all pet preferences before continuing.";

        message.classList.remove("hidden");

        return;
    }


    // ======================================================
    // EMPTY BEHAVIOR VALIDATION
    // ======================================================

    if (!rawBehaviorInput.trim()) {

        message.textContent =
            "Please provide details about the personality, behavior, and traits of your preferred pet.";

        message.classList.remove("hidden");

        return;
    }


    // ======================================================
    // SANITIZE BEFORE REPAIR
    // ======================================================

    const behaviorInput =
        sanitizeBehaviorInput(rawBehaviorInput);


    console.log("========================================");
    console.log("BEHAVIOR INPUT");
    console.log("========================================");

    console.log(
        "Raw:",
        rawBehaviorInput
    );

    console.log(
        "Sanitized:",
        behaviorInput
    );

    console.log("========================================");
    // ======================================================
    // SEND SANITIZED TEXT TO REPAIR API
    // ======================================================
    let repairResponse;
    let repairData;
    try {
        repairResponse = await fetch(
            "/api/matchmaking/repair",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    behavior: behaviorInput
                })
            }
        );
        repairData =
            await repairResponse.json();
    } catch (error) {
        console.error(
            "Behavior repair request failed:",
            error
        );
        message.textContent =
            "Unable to process your pet preference. Please try again.";
        message.classList.remove("hidden");
        return;
    }
    // ======================================================
    // SHOW REPAIR RESULT
    // =====================================================
    console.log("========================================");
    console.log("BEHAVIOR REPAIR RESULT");
    console.log("========================================");
    console.log(
        "Original:",
        rawBehaviorInput
    );
    console.log(
        "Sanitized:",
        behaviorInput
    );
    console.log(
        "Repaired:",
        repairData.repaired_text
    );
    console.log(
        "Word count:",
        repairData.word_count
    );
    console.log(
        "Character count:",
        repairData.character_count
    );
    console.log(
        "Success:",
        repairData.success
    );
    console.log("========================================");
    // ======================================================
    // REPAIR / SERVER VALIDATION FAILED
    // ======================================================
    if (
        !repairResponse.ok ||
        !repairData.success
    ) {
        message.textContent =
            repairData.message ||
            "Please provide more details about your preferred pet.";
        message.classList.remove("hidden");
        return;
    }
    // ======================================================
    // GET FINAL REPAIRED BEHAVIOR
    // ======================================================
    const behavior =
        repairData.repaired_text;
    // ======================================================
    // FINAL FRONTEND VALIDATION
    // ======================================================
    const finalValidation =
        validateBehaviorInput(behavior);
    if (!finalValidation.valid) {
        message.textContent =
            finalValidation.message;
        message.classList.remove("hidden");
        return;
    }
    // ======================================================
    // VALID REPAIRED MATCHMAKING INPUT
    // ======================================================
    console.log("========================================");
    console.log("VALID REPAIRED MATCHMAKING INPUT");
    console.log("========================================");
    console.log(
        "Type:",
        type
    );
    console.log(
        "Sex:",
        sex
    );
    console.log(
        "Age:",
        age
    );
    console.log(
        "Original behavior:",
        rawBehaviorInput
    );
    console.log(
        "Sanitized behavior:",
        behaviorInput
    );
    console.log(
        "Repaired behavior:",
        behavior
    );
    console.log("========================================");
    
    // ======================================================
    // SHOW LOADING SCREEN

    showLoadingScreen();

    updateMatchingProgress(
        0,
        "Preparing your preferences..."
    );


    await new Promise(
        resolve => setTimeout(resolve, 1000)
    );


    // ======================================================
    // PROGRESS: 20%
    // ======================================================

    updateMatchingProgress(
        20,
        "Analyzing your preferences..."
    );


    await new Promise(
        resolve => setTimeout(resolve, 2000)
    );


    // ======================================================
    // PROGRESS: 40%
    // ======================================================

    updateMatchingProgress(
        40,
        "Searching through available pets..."
    );


    await new Promise(
        resolve => setTimeout(resolve, 2000)
    );


    // ======================================================
    // PROGRESS: 60%
    // ======================================================

    updateMatchingProgress(
        60,
        "Comparing your preferences with pet profiles..."
    );


    await new Promise(
        resolve => setTimeout(resolve, 2000)
    );


    // ======================================================
    // MATCHMAKING REQUEST
    // ======================================================

    try {

        updateMatchingProgress(
            70,
            "Our AI is calculating compatibility..."
        );


        await new Promise(
            resolve => setTimeout(resolve, 1000)
        );


        // ==================================================
        // SEND REQUEST TO MATCHMAKING API
        // ==================================================

        const response = await fetch(
            "/api/matchmaking",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    // Keep the existing matchmaking fields.
                    // These are NOT changed.

                    type,
                    sex,
                    age,
                    behavior
                })
            }
        );
        // ==================================================
        // HANDLE API ERROR
        // ==================================================

        if (!response.ok) {
            const errorData = await response.json();

            console.error("Matching error response:", errorData);

            message.textContent =
                errorData.message ||
                `Matching request failed: ${response.status}`;

            message.classList.remove("hidden");

            return;
        }


        // ==================================================
        // RESPONSE RECEIVED
        // ==================================================

        updateMatchingProgress(
            85,
            "Ranking your best matches..."
        );
        await new Promise(
            resolve => setTimeout(resolve, 1000)
        );
        const data =
            await response.json();
        console.log(
            "Matchmaking response:",
            data
        );
        // ==================================================
        // RENDER MATCHES
        // ==================================================
        renderMatches(
            data.matches
        );
        // ==================================================
        // COMPLETE
        // ==================================================

        updateMatchingProgress(
            100,
            "Your matches are ready!"
        );

        await new Promise(
            resolve => setTimeout(resolve, 1000)
        );


        // ==================================================
        // SHOW RESULTS
        // ==================================================

        showScreen(
            compatibilityScreen
        );

    } catch (err) {

        // ==================================================
        // HANDLE MATCHMAKING ERROR
        // ==================================================

        console.error(
            "Matching error:",
            err
        );


        // Return to preference screen
        showScreen(
            preferenceScreen
        );


        message.textContent =
            "Something went wrong while finding matches. Please try again.";

        message.classList.remove("hidden");
    }
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

document.addEventListener("DOMContentLoaded", async () => {

    // Wait until sidebar + header are loaded
    await loadSidebar();

    // Wait one tick so the header HTML exists
    requestAnimationFrame(() => {

        // Set page title
        loadTopbar({
            title: "Pet Matchmaker",
            subtitle: "Find pets that best match your lifestyle, preferences, and personality using our AI-powered matching system."
        });

        document.body.style.visibility = "visible";
    });

});

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

        if (screen) {
            screen.classList.toggle(
                "hidden",
                screen !== screenToShow
            );
        }
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
                    <span>${Math.floor(score)}% Match</span>
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
                        <span class="font-extrabold text-blue-700">${Math.floor(score)}%</span>
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
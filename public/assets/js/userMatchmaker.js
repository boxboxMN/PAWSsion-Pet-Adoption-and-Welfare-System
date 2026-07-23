
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

    console.log("Next button clicked!");

    const type = document.getElementById("type").value;
    const sex = document.getElementById("sex").value;
    const age = document.getElementById("age").value;
    const behavior = document.getElementById("behavior").value;

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
function renderMatches(matches) {

    const container = document.querySelector(
        "#compatibilityScreen .grid"
    );

    container.innerHTML = "";

    if (!matches.length) {
        container.innerHTML =
            "<p>No matching pets found.</p>";
        return;
    }

    matches.forEach(pet => {

        container.innerHTML += `
        <div class="bg-white rounded-xl shadow-md p-5">

            <img
                src="/uploads/pets/${pet.image_path}"
                class="w-full h-48 object-cover rounded-lg">

            <h2 class="text-xl font-bold mt-4">
                ${pet.name}
            </h2>

            <p class="text-blue-600 font-semibold">
                ${pet.score}% Match
            </p>

            <p class="text-gray-600 mt-2">
                ${pet.behavior_description}
            </p>

        </div>
        `;

    });

}
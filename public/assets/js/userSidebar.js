async function loadComponent(id, file) {
        try {
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(`Cannot load ${file}`);
            }

            document.getElementById(id).innerHTML = await response.text();

        } catch (error) {
            console.error(error);
        }
    }

    function loadTopbar({ title = "", subtitle = "" }) {
        const titleEl = document.getElementById("pageTitle");
        const subtitleEl = document.getElementById("pageSubtitle");

        if (titleEl) {
            titleEl.textContent = title;
        }

        if (subtitleEl) {
            subtitleEl.textContent = subtitle;
        }
    }

    Promise.all([
        loadComponent("sidebar", "/user/userSidebar.html"),
        loadComponent("header", "/user/userHeader.html")
    ])
    .then(() => {

        // Show loaded components
        document.getElementById("sidebar").style.visibility = "visible";
        document.getElementById("header").style.visibility = "visible";

        // Wait until the header HTML is inserted
        setTimeout(() => {

            loadTopbar({
                title: "Adoption Hub",
                subtitle: "Browse available pets and submit adoption applications."
            });

        }, 0);

        // Highlight active sidebar link
        const currentPath = window.location.pathname;

        document.querySelectorAll("#sidebar .nav-link").forEach(link => {

            const href = link.getAttribute("href");

            const active =
                href === currentPath ||
                (href !== "/dashboard" && currentPath.startsWith(href));

            if (active) {
                link.className =
                    "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl bg-blue-600 text-white shadow";
            } else {
                link.className =
                    "nav-link flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition";
            }
        });

        document.body.style.visibility = "visible";

    })
    .catch(console.error);
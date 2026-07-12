async function loadTopbar({ title = "", subtitle = "" }) {

    console.log("Subtitle received:", subtitle);

    const container = document.getElementById("headerContainer");

    const response = await fetch("/organization/header.html");
    container.innerHTML = await response.text();

    const titleEl = document.getElementById("pageTitle");
    const subtitleEl = document.getElementById("pageSubtitle");

    console.log(titleEl);
    console.log(subtitleEl);

    if (titleEl) {
        titleEl.textContent = title;
    }

    if (subtitleEl) {
        subtitleEl.textContent = subtitle;
    }

    console.log("Subtitle after setting:", subtitleEl.textContent);

    initializeTopbar();
}

function initializeTopbar() {

    const notifBtn = document.getElementById("notificationBtn");
    const notifPopup = document.getElementById("notificationPopup");
    const markReadBtn = document.getElementById("markReadBtn");
    const notifList = document.getElementById("notifList");

    if (notifBtn && notifPopup) {
        notifBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            const isOpen =
                notifPopup.getAttribute("data-open") === "true";

            notifPopup.setAttribute("data-open", !isOpen);
        });

        document.addEventListener("click", (e) => {
            if (
                !notifBtn.contains(e.target) &&
                !notifPopup.contains(e.target)
            ) {
                notifPopup.setAttribute("data-open", "false");
            }
        });
    }

    if (markReadBtn && notifList) {
        markReadBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            const dot = document.querySelector(".notif-dot");

            if (dot) {
                dot.style.display = "none";
            }

            notifList.innerHTML = `
                <div class="text-center py-8 text-gray-400 text-sm">
                    <i class="fa-regular fa-bell-slash text-xl block mb-1.5"></i>
                    No new notifications
                </div>
            `;

            setTimeout(() => {
                notifPopup.setAttribute("data-open", "false");
            }, 300);
        });
    }
}
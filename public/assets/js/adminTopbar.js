async function loadTopbar() {

    const container = document.getElementById("topbar");
    if (!container) return;

    const response = await fetch("topbar.html");
    container.innerHTML = await response.text();

    const bell = document.getElementById("notificationBellBtn");
    const dropdown = document.getElementById("notificationDropdown");

    if (!bell || !dropdown) return;

    // Open / Close
    bell.addEventListener("click", function (e) {
        e.stopPropagation();

        dropdown.classList.toggle("hidden");
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
        if (
            !dropdown.contains(e.target) &&
            !bell.contains(e.target)
        ) {
            dropdown.classList.add("hidden");
        }
    });
}
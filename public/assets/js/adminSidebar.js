async function loadSidebar(activePage) {
    const container = document.getElementById("sidebar");
    const response = await fetch("sidebar.html");
    container.innerHTML = await response.text();

    // Dropdown
    const toggle = document.getElementById("orgDropdownToggle");
    if (toggle) {
        toggle.addEventListener("click", function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle("open");
        });
    }

    // Highlight active page
    document.querySelectorAll(".sidebar-link").forEach(link => {
        if (link.dataset.page === activePage) {
            link.classList.remove("text-slate-500");
            link.classList.add("bg-blue-600", "text-white", "font-semibold");
        }
    });
}
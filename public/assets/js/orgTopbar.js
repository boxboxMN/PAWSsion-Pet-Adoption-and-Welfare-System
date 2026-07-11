function loadTopbar({ title, subtitle }) {

    const titleEl = document.getElementById("pageTitle");
    const subtitleEl = document.getElementById("pageSubtitle");

    if (titleEl) {
        titleEl.textContent = title;
    }

    if (subtitleEl) {
        subtitleEl.textContent = subtitle;
    }

}
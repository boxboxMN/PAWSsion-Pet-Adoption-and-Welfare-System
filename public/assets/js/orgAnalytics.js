document.addEventListener("DOMContentLoaded", async () => {

    await loadSidebar("analytics");

    await loadTopbar({
        title: "Analytics",
        subtitle: "Overview of pet adoption and donation performance"
    });
});
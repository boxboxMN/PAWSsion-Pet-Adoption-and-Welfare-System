document.getElementById("submitBtn").addEventListener("click", function() {
    document.getElementById("successModal").style.display = "block";
});

window.onclick = function(event) {
    let modal = document.getElementById("successModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
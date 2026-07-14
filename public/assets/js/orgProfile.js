// para makita sa lahat ng pages yung profile pic
function syncHeaderProfilePic() {
    const imgTag = document.getElementById('headerProfilePic');
    const iconTag = document.getElementById('headerProfileIcon');
    const savedPic = localStorage.getItem('userProfilePic');

    // Magsisilbing log para makita natin kung kailan niya nahanap ang elements
    console.log("👀 Checking elements in loop...", { imgTag: !!imgTag, iconTag: !!iconTag });

    if (savedPic && imgTag && iconTag) {
        imgTag.src = savedPic;
        imgTag.classList.remove('hidden'); // Ipakita ang larawan
        iconTag.classList.add('hidden');    // Itago ang default icon
        console.log("✅ Header image updated successfully via Observer!");
        return true; // Magbabalik ng true para sabihing tapos na ang sync
    }
    return false;
}

// 1. Subukan patakbuhin agad pagka-load ng DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("🔥 orgProfile.js DOMContentLoaded fired!");
    syncHeaderProfilePic();
});

// 2. WATCHDOG (MutationObserver): Babantayan ang buong page. 
// Sa oras na i-inject ng orgTopbar.js ang header sa HTML, huli agad siya nito!
const observer = new MutationObserver((mutations, obs) => {
    const isSynced = syncHeaderProfilePic();
    if (isSynced) {
        obs.disconnect(); // Patayin ang observer para hindi bumigat ang browser kapag tapos na
        console.log("🛑 Observer disconnected.");
    }
});

// Simulan ang pagbabantay sa HTML container
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
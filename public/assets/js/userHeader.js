async function loadTopbar(options = {}) {
    const headerContainer = document.getElementById("header");
    if (!headerContainer) return;

    // 1. I-load ang userHeader.html
    const response = await fetch("/header"); // o kung ano ang route ng userHeader.html
    const html = await response.text();
    headerContainer.innerHTML = html;

    // 2. I-set ang Title at Subtitle kung mayroon
    if (options.title) {
        const titleEl = document.getElementById("pageTitle");
        if (titleEl) titleEl.textContent = options.title;
    }
    if (options.subtitle) {
        const subEl = document.getElementById("pageSubtitle");
        if (subEl) subEl.textContent = options.subtitle;
    }

    // 3. I-LOAD ANG PROFILE PICTURE MULA SA API
    try {
        const userRes = await fetch("/api/current-user");
        const userData = await userRes.json();
        
        const avatarContainer = document.getElementById("topbarAvatarContainer");
        if (avatarContainer && userData.profile_picture) {
            avatarContainer.innerHTML = `
                <img src="${userData.profile_picture}" 
                     alt="Profile" 
                     class="w-full h-full object-cover rounded-full" 
                     onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fas fa-user-circle text-2xl text-gray-500\\'></i>';" />
            `;
        }
    } catch (err) {
        console.error("Error setting topbar avatar:", err);
    }
}
 let petsData = [];
    let selectedFile = null;

    document.addEventListener("DOMContentLoaded", async () => {
        await loadSidebar();
        requestAnimationFrame(() => {
            loadTopbar({ title: "Kamustahan", subtitle: "Share updates about your adopted pet." });
            document.body.style.visibility = "visible";
        });

        const phTimeOptions = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
        const formatter = new Intl.DateTimeFormat('en-CA', phTimeOptions);
        document.getElementById('updateDate').value = formatter.format(new Date());

        try {
            const res = await fetch('/api/user/approved-pets');
            const data = await res.json();
            const petSelect = document.getElementById('petSelect');

            if (data.success && data.pets.length > 0) {
                petsData = data.pets;
                petSelect.innerHTML = '<option value="">-- Choose your adopted pet --</option>';
                
                petsData.forEach(pet => {
                    const opt = document.createElement('option');
                    opt.value = pet.animal_id;
                    opt.textContent = pet.name;
                    petSelect.appendChild(opt);
                });

                petSelect.addEventListener('change', (e) => {
                    const selectedPet = petsData.find(p => p.animal_id == e.target.value);
                    document.getElementById('orgIdInput').value = selectedPet ? selectedPet.organization_id : '';
                });
            } else {
                petSelect.innerHTML = '<option value="">No approved adopted pets available.</option>';
            }
        } catch (err) {
            console.error("Error loading approved pets:", err);
        }

        const photoInput = document.getElementById('photoInput');
        photoInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                selectedFile = files[0];
                renderPreview();
            }
        });

        document.getElementById('kamustahanForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            hideUiAlert();

            if (!selectedFile) {
                showUiAlert("Please upload a photo of your pet.", "error");
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting Report...';

            const formData = new FormData(e.target);
            formData.set('photos', selectedFile);

            try {
                const response = await fetch('/api/user/kamustahan', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.success) {
                    const petSelectEl = document.getElementById('petSelect');
                    const selectedPetName = petSelectEl.options[petSelectEl.selectedIndex].text;
                    const updateTextVal = document.getElementById('updateText').value;

                    document.getElementById('modalPetName').textContent = selectedPetName;
                    document.getElementById('modalUpdateText').textContent = `"${updateTextVal}"`;
                    
                    const phTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', dateStyle: 'full', timeStyle: 'medium' });
                    document.getElementById('modalTimestamp').textContent = phTimestamp;

                    const modalImagesGrid = document.getElementById('modalImagesGrid');
                    modalImagesGrid.innerHTML = '';
                    
                    const reader = new FileReader();
                    reader.onload = function(ev) {
                        const img = document.createElement('img');
                        img.src = ev.target.result;
                        img.className = 'w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm flex-shrink-0 cursor-pointer hover:opacity-90 transition';
                        img.onclick = () => openLightbox(ev.target.result);
                        modalImagesGrid.appendChild(img);
                    }
                    reader.readAsDataURL(selectedFile);

                    document.getElementById('successModal').classList.remove('hidden');
                    document.getElementById('successModal').classList.add('flex');
                } else {
                    showUiAlert(result.error || 'Failed to submit update.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Pet Update';
                }
            } catch (error) {
                console.error('Submission error:', error);
                showUiAlert('An error occurred during submission.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Pet Update';
            }
        });
    });

    // --- UI ALERT FUNCTIONS ---
    function showUiAlert(message, type = 'error') {
        const alertBox = document.getElementById('uiAlertBox');
        const alertMsg = document.getElementById('uiAlertMessage');
        const alertTitle = document.getElementById('uiAlertTitle');
        const alertIcon = document.getElementById('uiAlertIcon');

        alertMsg.textContent = message;

        if (type === 'error') {
            alertBox.className = 'mb-6 p-4 rounded-2xl border text-sm flex items-start gap-3 transition-all bg-rose-50 border-rose-200 text-rose-900';
            alertIcon.className = 'fas fa-exclamation-circle mt-0.5 text-lg shrink-0 text-rose-600';
            alertTitle.textContent = 'Action Required';
        } else {
            alertBox.className = 'mb-6 p-4 rounded-2xl border text-sm flex items-start gap-3 transition-all bg-emerald-50 border-emerald-200 text-emerald-900';
            alertIcon.className = 'fas fa-check-circle mt-0.5 text-lg shrink-0 text-emerald-600';
            alertTitle.textContent = 'Success';
        }

        alertBox.classList.remove('hidden');
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideUiAlert() {
        const alertBox = document.getElementById('uiAlertBox');
        alertBox.classList.add('hidden');
    }

    function renderPreview() {
        const container = document.getElementById('previewContainer');
        const existingThumbs = container.querySelectorAll('.preview-thumb');
        existingThumbs.forEach(el => el.remove());

        const addPhotoButton = container.querySelector('label');

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const div = document.createElement('div');
                div.className = 'relative w-32 h-32 border border-slate-200 rounded-2xl overflow-hidden preview-thumb shadow-sm bg-white group';
                div.innerHTML = `
                    <img src="${event.target.result}" class="w-full h-full object-cover cursor-pointer" onclick="openLightbox('${event.target.result}')" title="Tap to preview">
                    <button type="button" onclick="removePhoto()" class="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs transition shadow-md" title="Remove photo">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                addPhotoButton.before(div);
            }
            reader.readAsDataURL(selectedFile);
            document.getElementById('fileCountBadge').textContent = '1 photo selected';
        } else {
            document.getElementById('fileCountBadge').textContent = '0 selected';
        }
    }

    function removePhoto() {
        selectedFile = null;
        document.getElementById('photoInput').value = '';
        renderPreview();
    }

    function closeSuccessModal() {
        document.getElementById('successModal').classList.add('hidden');
        window.location.reload();
    }

    async function openHistoryModal() {
        const modal = document.getElementById('historyModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        const container = document.getElementById('historyFeedContainer');
        container.innerHTML = `
            <div class="text-center py-12 text-slate-400">
                <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <p class="text-sm">Loading history records...</p>
            </div>
        `;

        try {
            const res = await fetch('/api/user/kamustahan-history'); 
            const data = await res.json();

            if (data.success && data.updates.length > 0) {
                container.innerHTML = '';
                data.updates.forEach(item => {
                    let imageUrl = '';
                    if (item.photos) {
                        try {
                            const parsed = JSON.parse(item.photos);
                            imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
                        } catch(e) {
                            imageUrl = item.photos; 
                        }
                    }

                    if (imageUrl && !imageUrl.startsWith('http')) {
                        imageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
                    }

                    let photosHtml = imageUrl 
                        ? `<img src="${imageUrl}" class="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm flex-shrink-0 cursor-pointer hover:scale-105 transition duration-150" onclick="openLightbox('${imageUrl}')" title="Tap to view full image">`
                        : '<span class="text-xs text-slate-400 italic">No photo attached</span>';

                    const formattedTimestamp = item.created_at 
                        ? new Date(item.created_at).toLocaleString('en-US', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'short' }) 
                        : 'N/A';

                    const card = document.createElement('div');
                    card.className = 'bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3';
                    card.innerHTML = `
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-slate-800 text-sm flex items-center gap-1.5"><i class="fas fa-paw text-blue-600"></i> ${item.pet_name}</span>
                            <span class="text-xs text-slate-500 font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200/60"><i class="fas fa-clock mr-1 text-slate-400"></i> ${formattedTimestamp}</span>
                        </div>
                        <p class="text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-100 leading-relaxed">${item.update_text}</p>
                        <div class="flex gap-2.5 overflow-x-auto pt-1">${photosHtml}</div>
                    `;
                    container.appendChild(card);
                });
            } else {
                container.innerHTML = `<p class="text-center text-slate-500 py-12 text-sm italic">No update history logs found.</p>`;
            }
        } catch (err) {
            console.error("History fetch error:", err);
            container.innerHTML = `<p class="text-center text-rose-500 py-12 text-sm">Failed to retrieve history logs.</p>`;
        }
    }

    function closeHistoryModal() {
        document.getElementById('historyModal').classList.add('hidden');
    }

    function openLightbox(imgSrc) {
        const lightbox = document.getElementById('imageLightboxModal');
        const lightboxImg = document.getElementById('lightboxImage');
        lightboxImg.src = imgSrc;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
    }

    function closeLightbox() {
        const lightbox = document.getElementById('imageLightboxModal');
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
    }
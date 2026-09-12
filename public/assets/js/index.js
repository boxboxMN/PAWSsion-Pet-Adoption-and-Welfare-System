// ==========================================
// PAWPON LANDING PAGE SCRIPT (index.js)
// ==========================================

let organizationsData = [];
let currentQrSrc = "";        
let currentQrOrgName = "";    
let currentQrMethod = "";     

document.addEventListener("DOMContentLoaded", () => {
    fetchOrganizationsData();

    const donationForm = document.getElementById("donationForm");
    if (donationForm) {
        donationForm.addEventListener("submit", handlePublicDonationSubmit);
    }
    const receiptInput = document.getElementById("receiptInput");
if (receiptInput) {
    receiptInput.addEventListener("change", handleReceiptUpload);
}
});

async function fetchOrganizationsData() {
    try {
        const response = await fetch('/api/organizations');
        const data = await response.json();

        let rawOrgs = [];
        if (Array.isArray(data)) {
            rawOrgs = data;
        } else if (data.success && data.organizations) {
            rawOrgs = data.organizations;
        }

       
        organizationsData = rawOrgs.filter(org => 
            (org.gcash_number && org.gcash_number.trim() !== '') || 
            (org.maya_number && org.maya_number.trim() !== '')
        );

        populateOrgDropdown();
    } catch (err) {
        console.error("Error fetching organizations for index:", err);
    }
}

function populateOrgDropdown() {
    const select = document.getElementById('orgSelect');
    if (!select) return;

    select.innerHTML = '';

    if (organizationsData.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "No partner organizations with payment details available";
        select.appendChild(option);
        select.disabled = true;
        return;
    }

    select.disabled = false;
    organizationsData.forEach(org => {
        const option = document.createElement('option');
        option.value = org.organization_id;
        option.textContent = org.organization_name;
        option.setAttribute('data-name', org.organization_name);
        option.setAttribute('data-number', org.gcash_number || org.maya_number || 'N/A');
        option.setAttribute('data-desc', org.description || 'Dedicated animal welfare organization.');
        option.setAttribute('data-gcashqr', org.qr_code || '');
        option.setAttribute('data-mayaqr', org.maya_qr_code || '');
        
        //  Drop-off details — kuhanin lahat ng kailangan mula sa database
const dropoffAddr = (org.dropoff_address && String(org.dropoff_address).trim())
    || [org.city, org.province].filter(Boolean).join(', ')
    || 'Address not specified';

option.setAttribute('data-dropoff-location', dropoffAddr);
option.setAttribute('data-dropoff-hours',    org.dropoff_hours || 'Standard shelter hours apply');
option.setAttribute('data-dropoff-name',     org.dropoff_location_name || org.organization_name || 'Partner Shelter');
option.setAttribute('data-dropoff-image',    org.dropoff_image || '');
option.setAttribute('data-dropoff-notes',    org.dropoff_notes || '');
        select.appendChild(option);
    });

    updateOrgDetails();
}
function updateOrgDetails() {
    const select = document.getElementById('orgSelect');
    if (!select || select.selectedIndex === -1 || !select.value) return;

    const selectedOption = select.options[select.selectedIndex];

    const orgName  = selectedOption.getAttribute('data-name');
    const orgNumber = selectedOption.getAttribute('data-number');
    const orgDesc   = selectedOption.getAttribute('data-desc');

    //  Org info
    document.getElementById('displayOrgName').textContent   = orgName;
    document.getElementById('displayOrgNumber').textContent = orgNumber;
    document.getElementById('orgDescriptionBox').textContent = orgDesc;

    //  Drop-off details (mula sa DB)
    const dropoffLoc   = selectedOption.getAttribute('data-dropoff-location') || 'Address not specified';
    const dropoffHours = selectedOption.getAttribute('data-dropoff-hours')    || 'Standard shelter hours apply';
    const dropoffName  = selectedOption.getAttribute('data-dropoff-name')     || 'Partner Shelter';
    const dropoffImg   = selectedOption.getAttribute('data-dropoff-image')    || '';
    const dropoffNotes = selectedOption.getAttribute('data-dropoff-notes')    || '';

    const nameElem  = document.getElementById('displayDropoffName');
    const locElem   = document.getElementById('displayDropoffLocation');
    const hoursElem = document.getElementById('displayDropoffHours');
    const notesElem = document.getElementById('displayDropoffNotes');
    const notesWrap = document.getElementById('dropoffNotesWrapper');
    const imgWrap   = document.getElementById('dropoffImageContainer');

    if (nameElem)  nameElem.textContent  = dropoffName;
    if (locElem)   locElem.textContent   = dropoffLoc;
    if (hoursElem) hoursElem.textContent = dropoffHours;

    if (notesElem && notesWrap) {
        if (dropoffNotes && dropoffNotes.trim() !== '') {
            notesElem.textContent = dropoffNotes;
            notesWrap.classList.remove('hidden');
        } else {
            notesWrap.classList.add('hidden');
        }
    }

    if (imgWrap) {
        if (dropoffImg) {
            imgWrap.innerHTML =
                `<img src="${dropoffImg}" alt="Drop-off location" class="w-full h-full object-cover">`;
        } else {
            imgWrap.innerHTML =
                `<div class="text-center">
                    <i class="fa-solid fa-image text-[42px] text-[#cbd5e1]"></i>
                    <span class="text-[11px] text-[#94a3b8] block font-semibold mt-1">No image available</span>
                 </div>`;
        }
    }
    // Notes — itago kung blangko
if (notesElem && notesWrap) {
    if (dropoffNotes && dropoffNotes.trim() !== '') {
        notesElem.textContent = dropoffNotes;
        notesWrap.classList.remove('hidden');
    } else {
        notesWrap.classList.add('hidden');
    }
}

    updatePaymentDetails();
}
function updatePaymentDetails() {
    const methodSelect = document.getElementById('paymentMethodSelect');
    const selectOrg = document.getElementById('orgSelect');
    if (!methodSelect || !selectOrg || selectOrg.selectedIndex === -1 || !selectOrg.value) return;

    const selectedMethodText = methodSelect.options[methodSelect.selectedIndex].text;
    const selectedOrgOption = selectOrg.options[selectOrg.selectedIndex];

    document.getElementById('qrHeadingTitle').textContent = `Scan to Donate via ${selectedMethodText}`;
    document.getElementById('qrCodeLabel').textContent = `[ ${selectedMethodText} QR Code ]`;

    const qrContainer = document.getElementById('qrImageContainer');
    const viewQrBtn = document.getElementById('viewQrBtn');

    const gcashQR = selectedOrgOption.getAttribute('data-gcashqr');
    const mayaQR  = selectedOrgOption.getAttribute('data-mayaqr');
    const orgName = selectedOrgOption.getAttribute('data-name');

    let activeQR = methodSelect.value.toLowerCase() === 'maya' ? mayaQR : gcashQR;

    currentQrSrc     = activeQR || "";
    currentQrOrgName = orgName  || "Organization";
    currentQrMethod  = selectedMethodText;

    if (qrContainer) {
        if (activeQR) {
            qrContainer.innerHTML = `<img src="${activeQR}" alt="Payment QR Code" class="w-full h-full object-contain rounded-[12px]">`;
            //  Ipakita ang button gamit ang style.display
            if (viewQrBtn) viewQrBtn.style.display = 'inline-flex';
        } else {
            qrContainer.innerHTML = `
                <div class="text-center">
                    <i class="fa-solid fa-qrcode text-[50px] text-[#94a3b8] mb-1"></i>
                    <span class="text-[11px] text-[#64748b] block font-semibold">[ No QR Available ]</span>
                </div>`;
            //  Itago ang button
            if (viewQrBtn) viewQrBtn.style.display = 'none';
        }
    }
}

function toggleDonorFields() {
    const isAnonymous = document.getElementById('anonymousCheck').checked;
    const fieldsContainer = document.getElementById('donorDetailsFields');
    const nameInput = document.getElementById('donorName');

    if (!fieldsContainer) return;

    if (isAnonymous) {
        fieldsContainer.style.opacity = '0.4';
        fieldsContainer.style.pointerEvents = 'none';
        if (nameInput) nameInput.required = false;
    } else {
        fieldsContainer.style.opacity = '1';
        fieldsContainer.style.pointerEvents = 'auto';
        if (nameInput) nameInput.required = true;
    }
}

async function handlePublicDonationSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const orgId = document.getElementById('orgSelect').value;
    const paymentMethod = document.getElementById('paymentMethodSelect').value;
    const isAnonymous = document.getElementById('anonymousCheck').checked;

    // ⭐ Pre-check bago pa mag-fetch
    if (!orgId) {
        alert("Please select an organization first.");
        return;
    }

    formData.append('organization_id', orgId);
    formData.append('payment_method', paymentMethod);
    formData.append('is_anonymous', isAnonymous ? 'true' : 'false');

    if (isAnonymous) {
        formData.set('donor_name', 'Anonymous Donor');
        formData.set('gcash_account_name', 'Anonymous Donor');
    } else {
        const nameInput = document.getElementById('donorName');
        const typedName = (nameInput?.value || '').trim();
        if (!typedName) {
            alert('Please enter your name or check "Donate Anonymously".');
            return;
        }
        formData.set('donor_name', typedName);
        formData.set('gcash_account_name', typedName);
    }

    formData.set('donor_email', '');

    //  DEBUG — tingnan sa console kung ano talaga ang pinapadala
    console.log("[Donation] payload:", {
        organization_id: orgId,
        payment_method: paymentMethod,
        is_anonymous: isAnonymous,
        reference_number: formData.get('reference_number'),
        amount: formData.get('amount'),
        donor_name: formData.get('donor_name'),
        receipt: formData.get('receipt')?.name || '(no file)'
    });

    try {
        const response = await fetch('/api/donations/cash', {
            method: 'POST',
            body: formData
        });

        const raw = await response.text();
        console.log("[Donation] raw response:", response.status, raw);

        let result;
        try {
            result = JSON.parse(raw);
        } catch (parseErr) {
            alert(`Server error (${response.status}). Please check console.`);
            return;
        }

        if (result.success) {
            alert(result.message || 'Thank you! Your donation receipt has been submitted successfully.');
            event.target.reset();

            const previewWrap = document.getElementById("receiptPreviewWrap");
            if (previewWrap) previewWrap.classList.add("hidden");
            const preview = document.getElementById("receiptPreview");
            if (preview) preview.src = "";

            const statusBox = document.getElementById("ocrStatus");
            if (statusBox) {
                statusBox.classList.add("hidden");
                statusBox.classList.remove("flex");
            }

            document.getElementById('anonymousCheck').checked = false;
            toggleDonorFields();
        } else {
            alert('Error: ' + (result.error || 'Failed to submit donation.'));
        }
    } catch (err) {
        console.error("Donation submit error:", err);
        alert('An unexpected error occurred. Please try again later.');
    }
}
function switchDonationType(type) {
    const cashForm      = document.getElementById("donationForm");
    const inkindForm    = document.getElementById("inkindForm");
    const cashBtn       = document.getElementById("cashTabBtn");
    const inkindBtn     = document.getElementById("inkindTabBtn");

    // ⭐ Side panels
    const cashPanel     = document.getElementById("cashQrPanel");
    const inkindPanel   = document.getElementById("inkindDropoffPanel");

    if (type === 'cash') {
        cashForm.classList.remove('hidden');
        inkindForm.classList.add('hidden');

        cashBtn.className   = "flex-1 py-2.5 px-4 rounded-xl font-bold text-sm bg-[#0151ff] text-white transition-all shadow-sm";
        inkindBtn.className = "flex-1 py-2.5 px-4 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all";

        // ⭐ Ipakita ang QR panel, itago ang drop-off panel
        if (cashPanel)   cashPanel.classList.remove('hidden');
        if (inkindPanel) inkindPanel.classList.add('hidden');
    } else {
        cashForm.classList.add('hidden');
        inkindForm.classList.remove('hidden');

        inkindBtn.className = "flex-1 py-2.5 px-4 rounded-xl font-bold text-sm bg-[#ffa500] text-white transition-all shadow-sm";
        cashBtn.className   = "flex-1 py-2.5 px-4 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all";

        // ⭐ Ipakita ang drop-off panel, itago ang QR panel
        if (cashPanel)   cashPanel.classList.add('hidden');
        if (inkindPanel) inkindPanel.classList.remove('hidden');
    }
}
async function handleInKindSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const orgId = document.getElementById('orgSelect').value;
    const isAnonymous = document.getElementById('inkindAnonymousCheck').checked;

    if (!orgId) {
        alert("Please select an organization first.");
        return;
    }

    formData.append('organization_id', orgId);
    formData.append('is_anonymous', isAnonymous ? 'true' : 'false');

    // Anonymous handling
    if (isAnonymous) {
        formData.set('donor_name', 'Anonymous Donor');
        formData.set('contact_info', 'N/A (Anonymous)');
    } else {
        const nameInput = document.getElementById('inkindDonorName');
        const typedName = (nameInput?.value || '').trim();
        if (!typedName) {
            alert('Please enter your name or check "Donate Anonymously".');
            return;
        }
        formData.set('donor_name', typedName);
    }

    // DEBUG
    console.log("[In-Kind] payload:", {
        organization_id: orgId,
        is_anonymous: isAnonymous,
        donor_name: formData.get('donor_name'),
        item_name: formData.get('item_name'),
        quantity: formData.get('quantity'),
        unit: formData.get('unit'),
        contact_info: formData.get('contact_info')
    });

    try {
        const response = await fetch('/api/donations/inkind', {
            method: 'POST',
            body: formData
        });

        const raw = await response.text();
        console.log("[In-Kind] raw response:", response.status, raw);

        let result;
        try {
            result = JSON.parse(raw);
        } catch (parseErr) {
            alert(`Server error (${response.status}). Please check console.`);
            return;
        }

        if (result.success) {
            alert(result.message || 'Thank you! Your in-kind donation pledge has been submitted successfully.');
            event.target.reset();
            const anonCheck = document.getElementById('inkindAnonymousCheck');
            if (anonCheck) anonCheck.checked = false;
            toggleInKindDonorFields();
        } else {
            alert('Error: ' + (result.error || 'Failed to submit in-kind donation.'));
        }
    } catch (err) {
        console.error("In-kind submit error:", err);
        alert('An unexpected error occurred. Please try again later.');
    }
}

// ==========================================
// QR MODAL — View Full Size QR Code
// ==========================================
function openQrModal() {
    if (!currentQrSrc) return;

    const modal = document.getElementById('qrModal');
    const img   = document.getElementById('qrModalImage');
    const title = document.getElementById('qrModalTitle');
    const sub   = document.getElementById('qrModalSubtitle');
    const org   = document.getElementById('qrModalOrg');
    if (!modal || !img) return;

    img.src = currentQrSrc;
    title.textContent = `Scan to Donate via ${currentQrMethod}`;
    sub.textContent   = `[ ${currentQrMethod} QR Code ]`;
    org.textContent   = currentQrOrgName;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';   
}

function closeQrModal() {
    const modal = document.getElementById('qrModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQrModal();
});
// ==========================================
// RECEIPT OCR — Auto-fill Ref No., Name, Amount
// ==========================================
async function handleReceiptUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

  
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById("receiptPreview");
        const wrap    = document.getElementById("receiptPreviewWrap");
        if (preview && wrap) {
            preview.src = e.target.result;
            wrap.classList.remove("hidden");
        }
    };
    reader.readAsDataURL(file);

  
    await runReceiptOCR(file);
}
async function runReceiptOCR(file) {
    const statusBox  = document.getElementById("ocrStatus");
    const statusText = document.getElementById("ocrStatusText");

    if (statusBox) {
        statusBox.classList.remove("hidden");
        statusBox.classList.add("flex");
    }
    if (statusText) statusText.textContent = "Scanning receipt...";

    try {
        if (!window.Tesseract) throw new Error("Tesseract.js not loaded");

      
        const enhanced = await upscaleImageForOcr(file, 1600);

        const result = await Tesseract.recognize(enhanced, "eng", {
           
            tessedit_pageseg_mode: "6",
            preserve_interword_spaces: "1",
            logger: (m) => {
                if (m.status === "recognizing text" && statusText) {
                    statusText.textContent =
                        `Scanning receipt... ${Math.round((m.progress || 0) * 100)}%`;
                }
            }
        });

        const text = result?.data?.text || "";
        console.log("[OCR raw text]\n---\n" + text + "\n---");

        const parsed  = parseReceiptText(text);
        const result2 = fillReceiptFields(parsed);   

        if (statusText) {
            if (result2.corrected > 0) {
                statusText.textContent =
                    `Receipt scanned ✓ Corrected ${result2.corrected} field${result2.corrected > 1 ? "s" : ""} to match the receipt. Please double-check.`;
            } else if (result2.filled > 0) {
                statusText.textContent =
                    `Receipt scanned ✓ Auto-filled ${result2.filled} field${result2.filled > 1 ? "s" : ""}. Please double-check.`;
            } else {
                statusText.textContent =
                    "Receipt scanned — no matching details found. Please fill in manually.";
            }
        }
    } catch (err) {
        console.error("OCR error:", err);
        if (statusText) statusText.textContent =
            "Could not read the receipt. Please fill in the details manually.";
    } finally {
        setTimeout(() => {
            if (statusBox) {
                statusBox.classList.add("hidden");
                statusBox.classList.remove("flex");
            }
        }, 4000);
    }
}
function parseReceiptText(text) {
    const out = { reference: "", amount: "", name: "" };

    const raw   = String(text).replace(/\r/g, "").trim();
    const flat  = raw.replace(/[ \t]+/g, " ");
    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

    const fixDigits = (s) => s.replace(/[Oo]/g, "0").replace(/[Il|]/g, "1");

    // ⭐ Check kung mukhang PHONE NUMBER (para hindi ito maging Ref No.)
    const looksLikePhone = (numStr) => {
        const n = String(numStr).replace(/\D/g, "");
        if (/^09\d{9}$/.test(n))   return true;   // 09171234567 (11 digits)
        if (/^639\d{9}$/.test(n))  return true;   // 639171234567 (12 digits)
        if (/^63\d{10}$/.test(n))  return true;   // 63XXXXXXXXXX
        return false;
    };

    // ============================================================
    // STEP 1: Hanapin ang "Ref No." label (PINAKA-PRIORITY)
    // ============================================================
    const refLabelRx = /ref(?:erence)?\.?\s*(?:no\.?|number|num\.?|#)?/gi;
    let m;
    while ((m = refLabelRx.exec(flat)) !== null) {
        const after = flat.substring(
            m.index + m[0].length,
            m.index + m[0].length + 40
        );
        const normalized = fixDigits(after).replace(/[\s\-]/g, "");
        const dm = normalized.match(/^(\d{10,16})/);
        if (dm && !looksLikePhone(dm[1])) {
            out.reference = dm[1];
            break;
        }
    }

    // ============================================================
    // STEP 2: Fallback — spaced pattern (3-3-3-3 / 3-3-3-4),
    // kunin ang HULING match (nasa ilalim ng receipt ang ref)
    // ============================================================
    if (!out.reference) {
        const spaced = [...flat.matchAll(/\b(\d{3}[\s\-]\d{3}[\s\-]\d{3}[\s\-]\d{3,4})\b/g)];
        for (let i = spaced.length - 1; i >= 0; i--) {
            const cleaned = fixDigits(spaced[i][1]).replace(/[\s\-]/g, "");
            if (!looksLikePhone(cleaned)) {
                out.reference = cleaned;
                break;
            }
        }
    }

    // ============================================================
    // STEP 3: Fallback — solid 12–15 digits, HULING match,
    // i-exclude ang phone numbers
    // ============================================================
    if (!out.reference) {
        const solid = [...flat.matchAll(/\b(\d{12,15})\b/g)];
        for (let i = solid.length - 1; i >= 0; i--) {
            if (!looksLikePhone(solid[i][1])) {
                out.reference = solid[i][1];
                break;
            }
        }
    }

    // ============================================================
    // STEP 4: Fallback — scan lines from BOTTOM upward
    // ============================================================
    if (!out.reference) {
        for (let i = lines.length - 1; i >= 0; i--) {
            const cleaned = fixDigits(lines[i]).replace(/[\s\-]/g, "");
            const dm = cleaned.match(/(\d{10,16})/);
            if (dm && !looksLikePhone(dm[1])) {
                out.reference = dm[1];
                break;
            }
        }
    }

    // ---------- Amount ----------
    const amountPatterns = [
        /(?:total\s+amount\s+sent|amount\s+sent|total\s+amount|amount|total)\s*[:\-]?\s*(?:php|₱|p)?\s*([\d,]+\.\d{2})/i,
        /(?:php|₱)\s*([\d,]+\.?\d{0,2})/i,
        /\bp\s*([\d,]+\.\d{2})\b/i,
        /([\d,]+\.\d{2})/
    ];
    for (const rx of amountPatterns) {
        const mt = flat.match(rx);
        if (mt && mt[1]) {
            out.amount = mt[1].replace(/,/g, "").trim();
            break;
        }
    }

    console.log("[OCR parsed]", out);
    return out;
}
function fillReceiptFields(parsed) {
    const refInput    = document.querySelector('#donationForm input[name="reference_number"]');
    const amountInput = document.querySelector('#donationForm input[name="amount"]');
    const donorInput  = document.getElementById('donorName');

    let filled = 0;
    let corrected = 0;

    // Reference Number
    if (parsed.reference && refInput) {
        const typed = (refInput.value || "").replace(/\s/g, "").trim();
        const ocr   = parsed.reference.replace(/\s/g, "").trim();

        if (!typed) {
            refInput.value = ocr;
            highlightOcrField(refInput, "blue");
            filled++;
        } else if (typed !== ocr) {
            refInput.value = ocr;
            highlightOcrField(refInput, "orange");
            corrected++;
            console.warn(`[OCR] Ref mismatch: "${typed}" → "${ocr}"`);
        }
    }

    // Amount
    if (parsed.amount && amountInput) {
        const typed    = String(amountInput.value || "").trim();
        const ocr      = String(parsed.amount).trim();
        const typedNum = typed ? parseFloat(typed) : NaN;
        const ocrNum   = parseFloat(ocr);

        if (!typed) {
            amountInput.value = ocr;
            highlightOcrField(amountInput, "blue");
            filled++;
        } else if (!isNaN(ocrNum) && typedNum !== ocrNum) {
            amountInput.value = ocr;
            highlightOcrField(amountInput, "orange");
            corrected++;
            console.warn(`[OCR] Amount mismatch: "${typed}" → "${ocr}"`);
        }
    }

    // Your Name (fill lang kung blangko — hindi ito kino-correct)
    if (parsed.name && donorInput && !donorInput.value) {
        const anon = document.getElementById('anonymousCheck');
        if (!anon || !anon.checked) {
            donorInput.value = parsed.name;
            highlightOcrField(donorInput, "blue");
            filled++;
        }
    }

    return { filled, corrected };
}
/**
 * Brief visual flash para makita ng user ang auto-filled / corrected values.
 * @param {HTMLElement} el
 * @param {"blue"|"orange"} color - blue = bagong fill, orange = correction
 */
function highlightOcrField(el, color = "blue") {
    if (!el) return;

    const palette = {
        blue:   { bg: "#eef7ff", border: "#0151ff" },
        orange: { bg: "#fff7ed", border: "#f97316" }  // 🟠 correction
    };
    const c = palette[color] || palette.blue;

    el.style.transition = "background-color .3s, border-color .3s";
    el.style.backgroundColor = c.bg;
    el.style.borderColor = c.border;
    setTimeout(() => {
        el.style.backgroundColor = "";
        el.style.borderColor = "";
    }, 2600);
}
/** Scale the image up to a max width for better OCR on small GCash fonts. */
function upscaleImageForOcr(file, maxWidth = 1600) {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const scale = Math.max(1, Math.min(3, maxWidth / img.width));
            const canvas = document.createElement("canvas");
            canvas.width  = Math.round(img.width  * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            canvas.toBlob(b => resolve(b || file), "image/png");
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
        img.src = url;
    });
}
function toggleInKindDonorFields() {
    const isAnonymous = document.getElementById('inkindAnonymousCheck').checked;
    const fieldsContainer = document.getElementById('inkindDonorDetailsFields');
    const nameInput = document.getElementById('inkindDonorName');
    const contactInput = document.getElementById('inkindContactInfo');

    if (!fieldsContainer) return;

    if (isAnonymous) {
        fieldsContainer.style.opacity = '0.4';
        fieldsContainer.style.pointerEvents = 'none';
        if (nameInput) nameInput.required = false;
        if (contactInput) contactInput.required = false;
    } else {
        fieldsContainer.style.opacity = '1';
        fieldsContainer.style.pointerEvents = 'auto';
        if (nameInput) nameInput.required = true;
        if (contactInput) contactInput.required = true;
    }
}
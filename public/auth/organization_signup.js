// ================================
// REGEX & PHILIPPINES ADDR DATA
// ================================
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
const phoneRegex = /^09\d{9}$/;
const emailValidatorRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const zipRegex = /^\d{4}$/;
const streetAddressInput = document.getElementById("streetAddress");
const regionSelect = document.getElementById("region");
const provinceSelect = document.getElementById("province");
const citySelect = document.getElementById("city");
const barangaySelect = document.getElementById("barangay");
const zipCodeInput = document.getElementById("zipCode");
const zipHelper = document.getElementById("zipHelper");


// ================================
// CUSTOM MODAL ALERT FUNCTION
// ================================
const alertOverlay = document.getElementById("customAlertOverlay");
const alertIcon = document.getElementById("customAlertIcon");
const alertMessage = document.getElementById("customAlertMessage");
const alertBtn = document.getElementById("customAlertBtn");
let currentAlertCallback = null;

let regionsData = [];
let provincesData = [];
let citiesData = [];
let barangaysData = [];

// Zip code live formatting
zipCodeInput.addEventListener("input", function() {
    this.value = this.value.replace(/\D/g, "");
    if (this.value === "") {
        zipHelper.innerHTML = "";
    } else if (zipRegex.test(this.value)) {
        zipHelper.className = "input-helper-text success";
        zipHelper.innerHTML = "<i class='fa-solid fa-circle-check'></i> Valid ZIP code.";
    } else {
        zipHelper.className = "input-helper-text error";
        zipHelper.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> Must be exactly 4 digits.";
    }
});

// Cascading Loaders
async function loadRegions() {
    try {
        regionSelect.innerHTML = '<option value="">Loading regions...</option>';
        const res = await fetch('/data/regions.json');
        if (!res.ok) throw new Error("Local file not found");
        regionsData = await res.json();

        regionSelect.innerHTML = '<option value="">Select Region</option>';
        regionsData.forEach(reg => {
            const opt = document.createElement('option');
            opt.value = reg.region_name;
            opt.textContent = reg.region_name;
            opt.dataset.code = reg.region_code;
            regionSelect.appendChild(opt);
        });
    } catch (err) {
        regionSelect.innerHTML = '<option value="">Failed to load regions</option>';
    }
}

regionSelect.addEventListener('change', async function() {
    const selectedOption = this.options[this.selectedIndex];
    const regCode = selectedOption ? selectedOption.dataset.code : null;

    provinceSelect.innerHTML = '<option value="">Loading provinces...</option>';
    provinceSelect.disabled = true;
    citySelect.innerHTML = '<option value="">Select City / Municipality</option>';
    citySelect.disabled = true;
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    barangaySelect.disabled = true;

    if (!regCode) {
        provinceSelect.innerHTML = '<option value="">Select Province</option>';
        return;
    }

    try {
        if (provincesData.length === 0) {
            const res = await fetch('/data/provinces.json');
            provincesData = await res.json();
        }

        let filtered = provincesData.filter(p => p.region_code === regCode);
        filtered.sort((a, b) => a.province_name.localeCompare(b.province_name));

        if (filtered.length === 0) {
            filtered = [{ province_code: regCode, province_name: selectedOption.value }];
        }

        provinceSelect.innerHTML = '<option value="">Select Province</option>';
        filtered.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.province_name;
            opt.textContent = p.province_name;
            opt.dataset.code = p.province_code;
            provinceSelect.appendChild(opt);
        });
        provinceSelect.disabled = false;
    } catch (err) {
        provinceSelect.innerHTML = '<option value="">Error loading</option>';
    }
});

provinceSelect.addEventListener('change', async function() {
    const selectedOption = this.options[this.selectedIndex];
    const provCode = selectedOption ? selectedOption.dataset.code : null;
    const regCode = regionSelect.options[regionSelect.selectedIndex]?.dataset.code;

    citySelect.innerHTML = '<option value="">Loading cities...</option>';
    citySelect.disabled = true;
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    barangaySelect.disabled = true;

    if (!provCode) return;

    try {
        if (citiesData.length === 0) {
            const res = await fetch('/data/cities.json');
            citiesData = await res.json();
        }

        const filtered = citiesData.filter(c => c.province_code === provCode || c.region_desc === regCode);
        filtered.sort((a, b) => a.city_name.localeCompare(b.city_name));

        citySelect.innerHTML = '<option value="">Select City / Municipality</option>';
        filtered.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.city_name;
            opt.textContent = c.city_name;
            opt.dataset.code = c.city_code;
            citySelect.appendChild(opt);
        });
        citySelect.disabled = false;
    } catch (err) {
        citySelect.innerHTML = '<option value="">Error loading</option>';
    }
});

citySelect.addEventListener('change', async function() {
    const selectedOption = this.options[this.selectedIndex];
    const cityCode = selectedOption ? selectedOption.dataset.code : null;

    barangaySelect.innerHTML = '<option value="">Loading barangays...</option>';
    barangaySelect.disabled = true;

    if (!cityCode) return;

    try {
        if (barangaysData.length === 0) {
            const res = await fetch('/data/barangays.json');
            barangaysData = await res.json();
        }

        const filtered = barangaysData.filter(b => b.city_code === cityCode);
        filtered.sort((a, b) => a.brgy_name.localeCompare(b.brgy_name));

        barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
        filtered.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b.brgy_name;
            opt.textContent = b.brgy_name;
            barangaySelect.appendChild(opt);
        });
        barangaySelect.disabled = false;
    } catch (err) {
        barangaySelect.innerHTML = '<option value="">Error loading</option>';
    }
});

loadRegions();

function showCustomAlert(message, type = "error", callback = null) {
    alertMessage.textContent = message;
    currentAlertCallback = callback;

    if (type === "success") {
        alertIcon.className = "custom-alert-icon success-icon";
        alertIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    } else {
        alertIcon.className = "custom-alert-icon";
        alertIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    }

    alertOverlay.classList.add("active");
    alertBtn.focus();
}

alertBtn.addEventListener("click", () => {
    alertOverlay.classList.remove("active");
    if (currentAlertCallback) {
        currentAlertCallback();
        currentAlertCallback = null;
    }
});


// ================================
// LIVE VALIDATIONS (EMAIL, PHONE & NAME)
// ================================
const emailInput = document.getElementById("email");
const emailHelper = document.getElementById("emailHelper");
const phoneInput = document.getElementById("contactNumber");
const phoneHelper = document.getElementById("phoneHelper");
const orgNameInput = document.getElementById("organizationName");
const orgNameHelper = document.getElementById("orgNameHelper");

let isEmailValidAndAvailable = false; 
let isOrgNameAvailable = false;

// Async validation for Email Uniqueness
async function verifyEmailUniqueness() {
    const emailValue = emailInput.value.trim().toLowerCase();

    if (emailValue === "") {
        emailHelper.className = "input-helper-text";
        emailHelper.innerHTML = "";
        isEmailValidAndAvailable = false;
        validateStep1();
        return;
    }

    if (!emailValidatorRegex.test(emailValue)) {
        emailHelper.className = "input-helper-text error";
        emailHelper.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> Please enter a valid email format.";
        isEmailValidAndAvailable = false;
        validateStep1();
        return;
    }

    emailHelper.className = "input-helper-text";
    emailHelper.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Checking availability...";

    try {
        const response = await fetch(`/auth/check-email?email=${encodeURIComponent(emailValue)}`);
        
        if (response.status === 409 || !response.ok) {
            emailHelper.className = "input-helper-text error";
            emailHelper.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> Email address is already registered.";
            isEmailValidAndAvailable = false;
        } else {
            emailHelper.className = "input-helper-text success";
            emailHelper.innerHTML = "<i class='fa-solid fa-circle-check'></i> Email is available.";
            isEmailValidAndAvailable = true;
        }
    } catch (err) {
        emailHelper.className = "input-helper-text";
        emailHelper.innerHTML = "";
        isEmailValidAndAvailable = true; 
    }

    validateStep1();
}

emailInput.addEventListener("blur", verifyEmailUniqueness);
emailInput.addEventListener("input", () => {
    const emailValue = emailInput.value.trim().toLowerCase();
    isEmailValidAndAvailable = false;

    if (emailValue === "") {
        emailHelper.className = "input-helper-text";
        emailHelper.innerHTML = "";
    } else if (!emailValidatorRegex.test(emailValue)) {
        emailHelper.className = "input-helper-text error";
        emailHelper.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> Please enter a valid email address format.";
    } else {
        emailHelper.className = "input-helper-text";
        emailHelper.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Checking availability on blur...";
    }

    validateStep1();
});

// Async validation for Organization Name Uniqueness
async function verifyOrgNameUniqueness() {
    const orgNameValue = orgNameInput.value.trim();

    if (orgNameValue === "") {
        orgNameHelper.className = "input-helper-text";
        orgNameHelper.innerHTML = "Must be at least 3 characters.";
        isOrgNameAvailable = false;
        return;
    }

    if (orgNameValue.length < 3) {
        orgNameHelper.className = "input-helper-text error";
        orgNameHelper.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> Name is too short (min 3 characters).";
        isOrgNameAvailable = false;
        return;
    }

    orgNameHelper.className = "input-helper-text";
    orgNameHelper.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Checking if organization name exists...";

    try {
        const response = await fetch(`/auth/check-org-name?orgName=${encodeURIComponent(orgNameValue)}`);
        
        if (response.status === 409 || !response.ok) {
            orgNameHelper.className = "input-helper-text error";
            orgNameHelper.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> This organization name is already registered.";
            isOrgNameAvailable = false;
        } else {
            orgNameHelper.className = "input-helper-text success";
            orgNameHelper.innerHTML = "<i class='fa-solid fa-circle-check'></i> Organization name is available!";
            isOrgNameAvailable = true;
        }
    } catch (err) {
        isOrgNameAvailable = true; 
    }
}

orgNameInput.addEventListener("blur", verifyOrgNameUniqueness);
orgNameInput.addEventListener("input", () => {
    isOrgNameAvailable = false; 
    
    const val = orgNameInput.value.trim();
    if(val.length >= 3) {
        orgNameHelper.className = "input-helper-text";
        orgNameHelper.innerHTML = "Checking uniqueness when you finish typing...";
    } else if (val.length > 0) {
        orgNameHelper.className = "input-helper-text error";
        orgNameHelper.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> Name is too short (min 3 characters).";
    }
});

// Mobile number digits restriction
phoneInput.addEventListener("input", function() {
    this.value = this.value.replace(/\D/g, "");
    if (this.value === "") {
        phoneHelper.className = "input-helper-text";
        phoneHelper.innerHTML = "Format: 11-digit starting with 09";
    } else if (phoneRegex.test(this.value)) {
        phoneHelper.className = "input-helper-text success";
        phoneHelper.innerHTML = "<i class='fa-solid fa-circle-check'></i> Valid Philippine mobile number format.";
    } else {
        phoneHelper.className = "input-helper-text error";
        phoneHelper.innerHTML = "<i class='fa-solid fa-circle-xmark'></i> Must be exactly 11 digits starting with 09.";
    }
});


// ================================
// LIVE PASSWORD CHECKLIST TRACKER
// ================================
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const passwordRequirements = document.getElementById("passwordRequirements");

const reqLength = document.getElementById("reqLength");
const reqUppercase = document.getElementById("reqUppercase");
const reqLowercase = document.getElementById("reqLowercase");
const reqNumber = document.getElementById("reqNumber");
const reqSpecial = document.getElementById("reqSpecial");
const reqMatch = document.getElementById("reqMatch");

function updateRequirementStatus(element, isValid) {
    const icon = element.querySelector(".status-icon");
    if (isValid) {
        element.classList.remove("invalid");
        element.classList.add("valid");
        icon.className = "fa-solid fa-circle-check status-icon";
    } else {
        element.classList.remove("valid");
        element.classList.add("invalid");
        icon.className = "fa-solid fa-circle-xmark status-icon";
    }
}

passwordInput.addEventListener("focus", () => {
    passwordRequirements.style.display = "block";
});

passwordInput.addEventListener("blur", () => {
    passwordRequirements.style.display = "none";
});

passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;

    updateRequirementStatus(reqLength, value.length >= 8);
    updateRequirementStatus(reqUppercase, /[A-Z]/.test(value));
    updateRequirementStatus(reqLowercase, /[a-z]/.test(value));
    updateRequirementStatus(reqNumber, /\d/.test(value));
    updateRequirementStatus(reqSpecial, /[@$!%*?&#]/.test(value));
    
    checkMatch();
});

confirmInput.addEventListener("input", checkMatch);

function checkMatch() {
    if (confirmInput.value === "") {
        reqMatch.style.display = "none";
        return;
    }
    reqMatch.style.display = "flex";
    const valuesMatch = (passwordInput.value === confirmInput.value && passwordInput.value !== "");
    updateRequirementStatus(reqMatch, valuesMatch);
    if(valuesMatch) {
        reqMatch.querySelector(".status-icon").nextSibling.textContent = " Passwords match";
    } else {
        reqMatch.querySelector(".status-icon").nextSibling.textContent = " Passwords do not match";
    }
}


// ================================
// PASSWORD VISIBILITY TOGGLE
// ================================
document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
        const input = button.parentElement.querySelector("input");
        const icon = button.querySelector("i");

        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";

        icon.className = isHidden ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    });
});


// ================================
// STEP NAVIGATION
// ================================
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const stepTitle = document.getElementById("stepTitle");

function showStep(step) {
    step1.style.display = "none";
    step2.style.display = "none";
    step3.style.display = "none";

    step.style.display = "block";

    if (step === step1)
        stepTitle.innerHTML = "Step 1: Account Credentials";

    if (step === step2)
        stepTitle.innerHTML = "Step 2: Organization Information";

    if (step === step3)
        stepTitle.innerHTML = "Step 3: Verification";
}

showStep(step1);


// ================================
// NEXT STEP 1 VALIDATION (FIXED)
// ================================
const next1Btn = document.getElementById("next1");

function validateStep1() {
    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value;
    const confirmVal = confirmInput.value;

    const isEmailFormatValid = emailValidatorRegex.test(emailVal);
    const isPassValid = passwordRegex.test(passVal);
    const isConfirmMatch = (passVal === confirmVal && passVal !== "");

    // I-enable ang button base sa format at local validation.
    // Ang async email uniqueness check ay gagawin sa pag-click ng Next.
    const isValid = isEmailFormatValid && isPassValid && isConfirmMatch;
    next1Btn.disabled = !isValid;
}

// I-trigger ang validateStep1 kapag nagbago ang password/confirm password
passwordInput.addEventListener("input", validateStep1);
confirmInput.addEventListener("input", validateStep1);


document.getElementById("next1").addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (email === "") {
        showCustomAlert("Email is required.");
        return;
    }

    if (!isEmailValidAndAvailable) {
        await verifyEmailUniqueness();
        if(!isEmailValidAndAvailable) {
            showCustomAlert("Please use a unique and valid email address to proceed.");
            return;
        }
    }

    if (!passwordRegex.test(password)) {
        showCustomAlert("Please make sure your password satisfies all requirement items shown below the field.");
        return;
    }

    if (password !== confirm) {
        showCustomAlert("Passwords do not match.");
        return;
    }

    showStep(step2);
});


// ================================
// BACK STEP 2
// ================================
document.getElementById("back1").addEventListener("click", () => {
    showStep(step1);
});


// ================================
// NEXT STEP 2 VALIDATION
// ================================
const next2Btn = document.getElementById("next2");
const orgTypeSelect = document.getElementById("organizationType");
const contactPersonInput = document.getElementById("contactPerson");

function validateStep2() {
    const isOrgNameValid = orgNameInput.value.trim().length >= 3;
    const isTypeSelected = orgTypeSelect.value !== "";
    const isContactPersonValid = contactPersonInput.value.trim() !== "";
    const isPhoneValid = phoneRegex.test(phoneInput.value.trim());

    const isStreetValid = streetAddressInput.value.trim() !== "";
    const isRegionValid = regionSelect.value !== "";
    const isProvinceValid = provinceSelect.value !== "";
    const isCityValid = citySelect.value !== "";
    const isBarangayValid = barangaySelect.value !== "";
    const isZipValid = zipRegex.test(zipCodeInput.value.trim());

    const isValid = 
        isOrgNameValid &&
        isTypeSelected &&
        isContactPersonValid &&
        isPhoneValid &&
        isStreetValid &&
        isRegionValid &&
        isProvinceValid &&
        isCityValid &&
        isBarangayValid &&
        isZipValid;

    next2Btn.disabled = !isValid;
}

[orgNameInput, orgTypeSelect, contactPersonInput, phoneInput, streetAddressInput, zipCodeInput].forEach(el => {
    el.addEventListener("input", validateStep2);
    el.addEventListener("change", validateStep2);
});

[regionSelect, provinceSelect, citySelect, barangaySelect].forEach(el => {
    el.addEventListener("change", validateStep2);
});


document.getElementById("next2").addEventListener("click", async () => {
    const contactNumber = phoneInput.value.trim();
    const organizationName = orgNameInput.value.trim();

    if (organizationName === "" || organizationName.length < 3) {
        showCustomAlert("A valid organization name (at least 3 characters) is required.");
        return;
    }

    if (!isOrgNameAvailable) {
        await verifyOrgNameUniqueness();
        if (!isOrgNameAvailable) {
            showCustomAlert("The organization name you entered is already taken. Please choose another name.");
            return;
        }
    }

    if (document.getElementById("organizationType").value === "") {
        showCustomAlert("Please select organization type.");
        return;
    }
    if (document.getElementById("contactPerson").value.trim() === "") {
        showCustomAlert("Contact person is required.");
        return;
    }
    if (!phoneRegex.test(contactNumber)) {
        showCustomAlert("Please enter a valid 11-digit mobile number starting with 09.");
        return;
    }
    if (streetAddressInput.value.trim() === "") {
        showCustomAlert("Street address / House number is required.");
        return;
    }
    if (regionSelect.value === "") {
        showCustomAlert("Please select your region.");
        return;
    }
    if (provinceSelect.value === "") {
        showCustomAlert("Please select your province.");
        return;
    }
    if (citySelect.value === "") {
        showCustomAlert("Please select your city or municipality.");
        return;
    }
    if (barangaySelect.value === "") {
        showCustomAlert("Please select your barangay.");
        return;
    }
    if (!zipRegex.test(zipCodeInput.value.trim())) {
        showCustomAlert("Please enter a valid 4-digit ZIP code.");
        return;
    }

    showStep(step3);
});


// ================================
// BACK STEP 3
// ================================
document.getElementById("back2").addEventListener("click", () => {
    showStep(step2);
});


// ================================
// FINAL SUBMIT
// ================================
document.getElementById("organizationSignupForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const password = passwordInput.value;
    const contactNumber = phoneInput.value.trim();
    const organizationName = orgNameInput.value.trim();

    if (!isEmailValidAndAvailable) {
        showCustomAlert("The email address provided is invalid or already taken.", "error", () => {
            showStep(step1);
        });
        return;
    }

    if (!isOrgNameAvailable) {
        showCustomAlert("Organization name is already taken or invalid.", "error", () => {
            showStep(step2);
        });
        return;
    }

    if (!passwordRegex.test(password)) {
        showCustomAlert("Password does not meet the complexity requirements.", "error", () => {
            showStep(step1);
        });
        return;
    }

    if (organizationName.length < 3) {
        showCustomAlert("Organization name is too short.", "error", () => {
            showStep(step2);
        });
        return;
    }

    if (!phoneRegex.test(contactNumber)) {
        showCustomAlert("Please enter a valid Philippine mobile number.", "error", () => {
            showStep(step2);
        });
        return;
    }

    if (document.getElementById("document").files.length === 0) {
        showCustomAlert("Please upload a verification document.");
        return;
    }

    if (!document.getElementById("agree").checked) {
        showCustomAlert("Please certify the information.");
        return;
    }

    const formData = new FormData();
    formData.append("email", emailInput.value.trim());
    formData.append("password", password);
    formData.append("confirmPassword", confirmInput.value);
    formData.append("organizationName", organizationName);
    formData.append("organizationType", document.getElementById("organizationType").value);
    formData.append("contactPerson", document.getElementById("contactPerson").value.trim());
    formData.append("contactNumber", contactNumber);
    formData.append("streetAddress", streetAddressInput.value.trim());
    formData.append("region", regionSelect.value.trim());
    formData.append("province", provinceSelect.value.trim());
    formData.append("city", citySelect.value.trim());
    formData.append("barangay", barangaySelect.value.trim());
    formData.append("zipCode", zipCodeInput.value.trim());
    formData.append("description", document.getElementById("description").value.trim());
    formData.append("document", document.getElementById("document").files[0]);

    try {
        const response = await fetch("/auth/register-organization", {
            method: "POST",
            body: formData
        });

        const result = await response.text();

        if (response.ok) {
            showCustomAlert("Application submitted successfully!", "success", () => {
                window.location.href = "/auth/login";
            });
        } else {
            showCustomAlert(result);
        }
    } catch (err) {
        console.error(err);
        showCustomAlert("Unable to submit application.");
    }
});
(async function loadContactInfo() {
  try {
    const res = await fetch("/api/contact-info");
    const data = await res.json();

    if (data.success && data.contactInfo) {
      document.getElementById("contactEmail").textContent =
        data.contactInfo.support_email || "pawpon@gmail.com";

      document.getElementById("contactPhone").textContent =
        data.contactInfo.support_phone || "(+63) 992 487 4712";
    }
  } catch (err) {
    console.error("Failed to load contact info:", err);
  }
})();
const express = require("express");
const path = require("path");
const pool = require("../config/database");

// 1. IMPORT UPLOAD MIDDLEWARE (Dagdagan ng uploadDropoff)
const { uploadPet, uploadQR, uploadDropoff } = require('../config/upload');

// Controller functions
const { 
    addPet, 
    updatePet, 
    deletePet, 
    getPets, 
    getPetDetails,
    getDonations, 
    getPaymentInfo,
    updateDonationStatus, 
    updatePaymentInfo,
    addInKindDonation, 
    getInKindDonations,
    updateInKindDonationStatus,
    getDropoffInfo,    // <--- DAGDAG PARA SA DROPOFF
    updateDropoffInfo  // <--- DAGDAG PARA SA DROPOFF
} = require("../controllers/orgController");

const router = express.Router();

// 1. UNANG ROUTE: /pending
router.get("/pending", (req, res) => {
    if (!req.session.accountId) {
        return res.redirect("/auth/login.html");
    }
    res.sendFile(
        path.join(__dirname, "../public/organization/orgPending.html")
    );
});

// 2. MIDDLEWARE FOR APPROVAL
async function checkOrganizationApproval(req, res, next) {
    if (!req.session.accountId) {
        return res.redirect("/auth/login.html");
    }
    try {
        const [rows] = await pool.query(
            `SELECT status FROM accounts WHERE account_id=?`,
            [req.session.accountId]
        );

        if (!rows.length) {
            return res.redirect("/auth/login.html");
        }

        if (rows[0].status === "pending") {
            if (req.path !== "/pending") {
                return res.redirect("/org/pending");
            }
        }
        next();
    } catch (error) {
        console.error("Middleware Approval Check Error:", error);
        res.status(500).send("Server Error");
    }
}

router.use(checkOrganizationApproval);

// 3. PAGES ROUTES
router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/dashboard.html"));
});

router.get("/pets", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/pets.html"));
});

router.get("/adoption", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/adoption.html"));
});

router.get("/donation", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/donation.html"));
});

router.get("/kamustahan", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/kamustahan.html"));
});

router.get("/analytics", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/analytics.html"));
});

router.get("/settings", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/settings.html"));
});

router.get("/support", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/support.html"));
});

router.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/profile.html"));
});

// 4. PET & DONATION API ROUTES
router.post("/pets/add", uploadPet.single("image"), addPet);
router.put("/pets/update/:id", uploadPet.single("image"), updatePet);
router.delete("/pets/delete/:id", deletePet);
router.get("/pets/list", getPets);
router.get("/pets/:id", getPetDetails);

// Corrected donations route (serves GET /org/donations)
router.get("/donations", getDonations);

// 5. PAYMENT & QR ROUTES
router.get("/payment-info", getPaymentInfo);
router.post(
    "/payment-info", 
    uploadQR.fields([
        { name: "qr_code", maxCount: 1 },
        { name: "location_image", maxCount: 1 }
    ]), 
    updatePaymentInfo
);
router.put("/donations/:id/status", updateDonationStatus);

// In-Kind Donations Routes
router.get("/donations/in-kind", getInKindDonations);
router.post("/donations/in-kind", uploadQR.single("proof"), addInKindDonation);
router.put("/donations/in-kind/:id/status", updateInKindDonationStatus);

// ==========================================
// 6. DROPOFF DETAILS ROUTES (IDINAGDAG DITO)
// ==========================================
router.get("/dropoff-info", getDropoffInfo);
router.post("/dropoff-info", uploadDropoff.single("dropoff_image"), updateDropoffInfo);

module.exports = router;
const express = require("express");
const path = require("path");
const pool = require("../config/database");
const { uploadPet, uploadQR, uploadDropoff } = require('../config/upload');

// Controller functions
const { 
    addPet, 
    updatePet, 
    deletePet, 
    getPets, 
    getPetDetails,
    getDonations, 
    getDashboardStats,
    getPaymentInfo,
    updateDonationStatus, 
    updatePaymentInfo,
    addInKindDonation, 
    getInKindDonations,
    updateInKindDonationStatus,
    getDropoffInfo,   
    updateDropoffInfo,
    getNewestPets
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
router.get("/dashboard/stats", getDashboardStats);
// 3. PAGES ROUTES
router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/dashboard.html"));
});

router.get("/pets", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/pets.html"));
});

router.get("/pets/newest", checkOrganizationApproval, getNewestPets);

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
router.post( "/payment-info", uploadQR.fields
    ([
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
router.get("/dropoff-info", getDropoffInfo);
router.post("/dropoff-info", uploadDropoff.single("dropoff_image"), updateDropoffInfo);

// GET Single Application Details Endpoint (Protected by Organization)
router.get('/applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const accountId = req.session?.accountId;

        if (!accountId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Kunin ang organization_id ng naka-login na account
        const [orgRows] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [accountId]
        );

        if (!orgRows.length) {
            return res.status(404).json({ message: "Organization not found" });
        }

        const orgId = orgRows[0].organization_id;

        const query = `
        SELECT 
            app.application_id,
            app.animal_id,
            app.adopter_id,
            app.full_name,
            app.contact_number,
            app.email,
            app.full_address,
            app.civil_status,
            app.age,
            app.occupation,
            app.adoption_intent,
            app.emergency_name,
            app.emergency_phone,
            app.emergency_relation,
            app.document_path,
            app.status,
            app.interview_date,
            app.interview_time,
            app.interview_method,
            app.interview_location_link,
            DATE_FORMAT(app.created_at, '%b %d, %Y • %h:%i %p') AS applied_date,
            p.name AS pet_name
        FROM user_adoption_applications app
        INNER JOIN animals p ON app.animal_id = p.animal_id
        WHERE app.application_id = ? AND p.organization_id = ?
    `;
    
    const [rows] = await pool.query(query, [id, orgId]);
    
    if (!rows || rows.length === 0) {
        return res.status(404).json({ message: "Application not found or unauthorized access." });
    }
    
    res.json(rows[0]);

    } catch (err) {
        console.error("❌ SQL Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// PATCH Update Application Status (Decline, Approve, Schedule Interview)
router.patch('/applications/:id/status', async (req, res) => {
    // Gumamit ng connection mula sa pool para sa Transaction
    const connection = await pool.getConnection();

    try {
        const { id } = req.params;
        const { status, decline_reason } = req.body;

        const validStatuses = ['Under Review', 'Interview Scheduled', 'Approved', 'Declined'];

        if (!status || !validStatuses.includes(status)) {
            connection.release();
            return res.status(400).json({ 
                success: false,
                message: `Invalid status selected. Allowed: ${validStatuses.join(', ')}` 
            });
        }

        await connection.beginTransaction();

        // Get the animal_id of the pet from the application 
        const [appRows] = await connection.query(
            `SELECT animal_id FROM user_adoption_applications WHERE application_id = ?`,
            [id]
        );

        if (appRows.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ 
                success: false, 
                message: "Application not found." 
            });
        }

        const animalId = appRows[0].animal_id;
        const reasonValue = (status === 'Declined') ? (decline_reason || null) : null;

        // Update Application Status
        const updateQuery = `
            UPDATE user_adoption_applications 
            SET 
                status = ?, 
                decline_reason = ?, 
                updated_at = NOW() 
            WHERE application_id = ?
        `;

        const [result] = await connection.query(updateQuery, [status, reasonValue, id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ 
                success: false, 
                message: "No changes were saved." 
            });
        }

        // If approved, change the status of the pet from "animals" table, and matanggal sa Adoption Hub
        if (status === 'Approved') {
            await connection.query(
                `UPDATE animals SET adoption_status = 'Adopted' WHERE animal_id = ?`,
                [animalId]
            );
        }

        // save the changes in the db
        await connection.commit();
        connection.release();

        res.json({
            success: true,
            message: `Application status successfully updated to "${status}".`,
            status: status
        });

    } catch (err) {
        await connection.rollback();
        connection.release();

        res.status(500).json({ 
            success: false, 
            message: "Failed to update application status due to a database error.",
            details: err.message 
        });
    }
});

// POST: Save/Schedule Interview
router.post('/applications/:id/schedule', async (req, res) => {
    try {
        const { id } = req.params;
        let { interview_date, interview_time, interview_method, interview_location_link } = req.body;

        // SIGURADUHING EXACT MATCH SA ENUM MO SA DB ('Interview Scheduled')
        const exactStatus = "Interview Scheduled"; 

        // Siguraduhing lowercase 'virtual' o 'onsite' para tumugma sa ENUM ng interview_method
        const cleanMethod = (interview_method && interview_method.toLowerCase() === 'onsite') ? 'onsite' : 'virtual';

        const query = `
            UPDATE user_adoption_applications 
            SET 
                status = ?,
                interview_date = ?,
                interview_time = ?,
                interview_method = ?,
                interview_location_link = ?
            WHERE application_id = ?
        `;

        await pool.query(query, [
            exactStatus,
            interview_date,
            interview_time,
            cleanMethod,
            interview_location_link,
            id
        ]);

        return res.json({ success: true, message: "Interview scheduled!" });
    } catch (err) {
        console.error("❌ Schedule Error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
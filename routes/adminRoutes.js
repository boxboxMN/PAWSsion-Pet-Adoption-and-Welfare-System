const express = require("express");
const path = require("path");

const pool = require("../config/database");
const adminController = require("../controllers/adminController"); // <--- Idagdag ito


const router = express.Router();

router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/dashboard.html"));
});

router.get("/organization", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/organization.html"));
});

router.get("/partner-request", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/partner-request.html"));
});

router.get("/user-management", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/user-management.html"));
});

router.get("/feedback", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/feedback.html"));
});

router.get("/notifications", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/notifications.html"));
});


// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login.html");
    });
});
/*
=================================================
GET ALL USERS
=================================================
*/
router.get("/users", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                a.account_id,
                a.email,
                a.role,
                a.status,
                a.email_verified,
                a.created_at,
                a.last_login,
                ad.first_name,
                ad.last_name,
                ad.phone_number,
                ad.profile_picture AS adopter_profile_picture,
                o.organization_name,
                o.contact_person,
                o.contact_number,
                o.city,
                o.province,
                o.profile_pic AS organization_profile_picture
            FROM accounts a
            LEFT JOIN adopters ad ON a.account_id = ad.account_id
            LEFT JOIN organizations o ON a.account_id = o.account_id
            WHERE a.role != 'admin'
            ORDER BY a.created_at DESC
        `);

        const users = rows.map(user => {
            let name = "Administrator";

            if (user.role === "organization") {
                name = user.organization_name || "Unnamed Organization";
            } else if (user.role === "adopter") {
                name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
            }

            const profilePicture = 
                user.adopter_profile_picture || 
                user.organization_profile_picture || 
                null;

            return {
                account_id: user.account_id,
                name,
                email: user.email,
                role: user.role,
                status: user.status,
                created_at: user.created_at,
                last_login: user.last_login,
                phone: user.role === "adopter" ? (user.phone_number || "N/A") : (user.contact_number || "N/A"),
                city: user.city || "",
                province: user.province || "",
                profile_picture: profilePicture,
                organization_name: user.organization_name || null,
                contact_person: user.contact_person || null
            };
        });

        res.json(users);

    } catch (err) {
        console.error("Get Users Error:", err);
        res.status(500).json({ message: "Database Error" });
    }
});
// Ruta para sa Profile Page view
router.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/profile.html"));
});

// Mga API Routes na nakakonekta sa controller
router.get("/current-user", adminController.getCurrentAdmin);
router.put("/profile/update", adminController.updateAdminProfile);
/*
=================================================
GET ALL PENDING ORGANIZATIONS
=================================================
*/
router.get("/partner-requests", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                o.organization_id,
                o.organization_name,
                o.organization_type,
                o.contact_person,
                o.contact_number,
                o.address,
                o.city,
                o.province,
                o.description,
                o.verification_status,
                a.email,
                a.created_at
            FROM organizations o
            JOIN accounts a ON a.account_id = o.account_id
            WHERE o.verification_status='Pending'
            ORDER BY a.created_at DESC
        `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database Error" });
    }
});

/*
=================================================
GET VERIFIED ORGANIZATIONS
=================================================
*/
router.get("/organizations", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                o.organization_id,
                o.organization_name,
                o.organization_type,
                o.contact_person,
                o.contact_number,
                o.address,
                o.city,
                o.province,
                o.description,
                o.verification_status,
                a.email,
                a.created_at
            FROM organizations o
            JOIN accounts a ON a.account_id = o.account_id
            WHERE o.verification_status='Approved'
            ORDER BY o.organization_name
        `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database Error" });
    }
});

// =================================================
// GET SINGLE ORGANIZATION + DOCUMENTS + PLATFORM ACTIVITY
// =================================================
router.get("/organization/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch organization basic information
        const [[organization]] = await pool.query(`
            SELECT
                o.organization_id,
                o.organization_name,
                o.organization_type,
                o.contact_person,
                o.contact_number,
                o.address,
                o.city,
                o.province,
                o.description,
                o.verification_status,
                a.account_id,
                a.email,
                a.created_at,
                a.status,
                a.last_login
            FROM organizations o
            INNER JOIN accounts a ON o.account_id = a.account_id
            WHERE o.organization_id = ?
        `, [id]);

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        // Fetch stats and documents in parallel
        const [
            [[animalStats]],
            [[donationStats]],
            [documents]
        ] = await Promise.all([
            pool.query(`
                SELECT
                    COUNT(*) AS total_animals,
                    SUM(CASE WHEN adoption_status = 'Adopted' THEN 1 ELSE 0 END) AS total_adoptions
                FROM animals
                WHERE organization_id = ?
            `, [id]),
            pool.query(`
                SELECT COALESCE(SUM(amount), 0) AS total_donations
                FROM cash_donations
                WHERE organization_id = ? AND status = 'Approved'
            `, [id]),
            pool.query(`
                SELECT document_id, document_name, file_path, uploaded_at
                FROM organization_documents
                WHERE organization_id = ?
                ORDER BY uploaded_at DESC
            `, [id])
        ]);

        // Combine response data
        organization.total_animals = Number(animalStats?.total_animals || 0);
        organization.total_adoptions = Number(animalStats?.total_adoptions || 0);
        organization.total_donations = Number(donationStats?.total_donations || 0);
        organization.documents = documents;

        res.json(organization);

    } catch (err) {
        console.error("Get Organization Details Error:", err);
        res.status(500).json({ message: "Database Error" });
    }
});
/*
=================================================
APPROVE ORGANIZATION
=================================================
*/
router.put("/approve/:id", async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const id = req.params.id;

        const [[organization]] = await connection.query(
            `SELECT account_id FROM organizations WHERE organization_id = ?`,
            [id]
        );

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        await connection.query(
            `UPDATE organizations SET verification_status = 'Approved' WHERE organization_id = ?`,
            [id]
        );

        await connection.query(
            `UPDATE accounts SET status = 'active', email_verified = 1 WHERE account_id = ?`,
            [organization.account_id]
        );

        await connection.commit();
        res.json({ success: true });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Database Error" });
    } finally {
        connection.release();
    }
});

/*
=================================================
REJECT ORGANIZATION
=================================================
*/
router.put("/reject/:id", async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const id = req.params.id;

        const [[organization]] = await connection.query(
            `SELECT account_id FROM organizations WHERE organization_id = ?`,
            [id]
        );

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        await connection.query(
            `UPDATE organizations SET verification_status = 'Rejected' WHERE organization_id = ?`,
            [id]
        );

        await connection.query(
            `UPDATE accounts SET status = 'rejected' WHERE account_id = ?`,
            [organization.account_id]
        );

        await connection.commit();
        res.json({ success: true });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Database Error" });
    } finally {
        connection.release();
    }
});

/*
=================================================
VIEW AND DONWLOAD DOCU
=================================================
*/
router.get("/document/view/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const [[doc]] = await pool.query(`
            SELECT * FROM organization_documents WHERE document_id = ?
        `, [id]);

        if (!doc) {
            return res.sendStatus(404);
        }

        res.sendFile(path.join(__dirname, "../uploads", doc.file_path));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database Error" });
    }
});

router.get("/document/download/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const [[doc]] = await pool.query(`
            SELECT * FROM organization_documents WHERE document_id = ?
        `, [id]);

        if (!doc) {
            return res.sendStatus(404);
        }

        res.download(path.join(__dirname, "../uploads", doc.file_path), doc.document_name);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database Error" });
    }
});

/*
=================================================
GET SINGLE USER
=================================================
*/

router.get("/users/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const [[user]] = await pool.query(`
            SELECT

                a.account_id,
                a.email,
                a.role,
                a.status,
                a.created_at,

                ad.first_name,
                ad.last_name,
                ad.profile_picture,

                o.organization_name,
                o.contact_person,
                o.contact_number,
                o.address,
                o.city,
                o.province,
                o.profile_pic AS organization_profile_picture

            FROM accounts a

            LEFT JOIN adopters ad
                ON a.account_id = ad.account_id

            LEFT JOIN organizations o
                ON a.account_id = o.account_id

            WHERE a.account_id=?

        `,[id]);

        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }

        user.name =
            user.role==="organization"
            ? user.organization_name
            : `${user.first_name || ""} ${user.last_name || ""}`.trim();

        user.profile_pic =
            user.role==="organization"
            ? user.organization_profile_picture
            : user.profile_picture;

        res.json(user);

    } catch(err){

        console.error(err);

        res.status(500).json({
            message:"Database Error"
        });

    }

});
router.put("/users/:id/status", async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body; // Dito tatanggapin kung suspended, banned, active, o disabled

        // I-validate kung valid status ang ipinasa
        const validStatuses = ['active', 'disabled', 'suspended', 'banned', 'pending', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status provided" });
        }

        const [[account]] = await pool.query(
            `SELECT account_id, role FROM accounts WHERE account_id = ?`,
            [id]
        );

        if (!account) {
            return res.status(404).json({ message: "User not found" });
        }

        if (account.role === "admin") {
            return res.status(403).json({ message: "Admin accounts cannot be modified here." });
        }

        await pool.query(
            `UPDATE accounts SET status = ? WHERE account_id = ?`,
            [status, id]
        );

        res.json({
            success: true,
            status: status
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Database Error"
        });
    }
});
/*
=================================================
SUSPEND USER
=================================================
*/

router.put("/users/:id/suspend", async(req,res)=>{

    try{

        const id=req.params.id;

        const [[account]] = await pool.query(
            `SELECT role FROM accounts WHERE account_id = ?`,
            [id]
        );

        if (!account) {
            return res.status(404).json({ message: "User not found" });
        }

        if (account.role === "admin") {
            return res.status(403).json({ message: "Admin accounts cannot be modified here." });
        }

        await pool.query(

            `UPDATE accounts
             SET status='suspended'
             WHERE account_id=?`,

            [id]

        );

        res.json({
            success:true
        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            message:"Database Error"
        });

    }

});
router.get("/dashboard/stats", async (req, res) => {
    try {
        // Bilang ng mga Approved Applications sa user_adoption_applications
        const [appRows] = await pool.query(`
            SELECT COUNT(*) AS totalApprovedApplications
            FROM user_adoption_applications
            WHERE status = 'Approved'
        `);
        const totalApprovedApplications = appRows[0]?.totalApprovedApplications || 0;

        // Total Organizations
        const [orgRows] = await pool.query(`
            SELECT COUNT(*) AS totalOrganizations
            FROM organizations
            WHERE verification_status = 'Approved'
        `);
        const totalOrganizations = orgRows[0]?.totalOrganizations || 0;

        // Total Active Users
        const [userRows] = await pool.query(`
            SELECT COUNT(*) AS totalActiveUsers
            FROM accounts
            WHERE status = 'active'
        `);
        const totalActiveUsers = userRows[0]?.totalActiveUsers || 0;

        // Total Pets
        const [petRows] = await pool.query(`
            SELECT COUNT(*) AS totalPets
            FROM animals
        `);
        const totalPets = petRows[0]?.totalPets || 0;

        res.json({
            success: true,
            totalApprovedApplications,
            totalOrganizations,
            totalActiveUsers,
            totalPets
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({
            success: false,
            message: "Database Error",
            error: err.message
        });
    }
});
router.put("/users/:id/ban", async (req, res) => {

    try {

        const id = req.params.id;

        const [[account]] = await pool.query(
            `SELECT role FROM accounts WHERE account_id = ?`,
            [id]
        );

        if (!account) {
            return res.status(404).json({ message: "User not found" });
        }

        if (account.role === "admin") {
            return res.status(403).json({ message: "Admin accounts cannot be modified here." });
        }

        await pool.query(
            `
            UPDATE accounts
            SET status='banned'
            WHERE account_id=?
            `,
            [id]
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database Error"
        });

    }

});
// =================================================
// GET TOP PERFORMING ORGANIZATIONS
// =================================================
router.get("/dashboard/top-organizations", async (req, res) => {
    try {
        const [rows] = await pool.query(`
             SELECT
                o.organization_id,
                o.organization_name,
                o.profile_pic,
                COUNT(DISTINCT CASE WHEN a.adoption_status = 'Adopted' THEN a.animal_id END) AS adoptions,
                COUNT(DISTINCT CASE WHEN a.adoption_status = 'Available' THEN a.animal_id END) AS active_pets,
                COALESCE((
                    SELECT SUM(cd.amount)
                    FROM cash_donations cd
                    WHERE cd.organization_id = o.organization_id AND cd.status = 'Approved'
                ), 0) AS total_donations
            FROM organizations o
            LEFT JOIN animals a ON o.organization_id = a.organization_id
            WHERE o.verification_status = 'Approved'
            GROUP BY 
                o.organization_id,
                o.organization_name,
                o.profile_pic
            ORDER BY 
                adoptions DESC,
                active_pets DESC,
                total_donations DESC
            LIMIT 3
        `);

        res.json({
            success: true,
            organizations: rows
        });

    } catch (err) {
        console.error("Top Organizations Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to load top organizations."
        });
    }
});

router.get("/feedback/list", adminController.getFeedback);
router.put("/feedback/:id/status", adminController.updateFeedbackStatus);

//settings route
router.get("/settings", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/settings.html"));
});
router.put("/settings/contact-info", adminController.updateContactInfo);

//user guide (org side)
router.post("/guide/sections", adminController.createGuideSection);
router.put("/guide/sections/reorder", adminController.reorderGuideSections);
router.put("/guide/sections/:id", adminController.updateGuideSection);
router.delete("/guide/sections/:id", adminController.deleteGuideSection);

//user guide (org side) - trash and restore
router.get("/guide/sections/trash", adminController.getTrashedGuideSections);
router.put("/guide/sections/:id/restore", adminController.restoreGuideSection);
router.delete("/guide/sections/:id/permanent", adminController.permanentlyDeleteGuideSection);
module.exports = router;

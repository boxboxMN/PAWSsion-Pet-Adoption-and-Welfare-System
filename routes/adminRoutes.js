const express = require("express");
const path = require("path");
const pool = require("../config/database");


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

router.get("/setting", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/setting.html"));
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

                CASE
                    WHEN a.role = 'admin'
                        THEN 'Administrator'

                    WHEN a.role = 'organization'
                        THEN o.organization_name

                    WHEN a.role = 'adopter'
                        THEN CONCAT(ad.first_name,' ',ad.last_name)

                    ELSE '-'
                END AS name

            FROM accounts a

            LEFT JOIN organizations o
                ON a.account_id = o.account_id

            LEFT JOIN adopters ad
                ON a.account_id = ad.account_id

            ORDER BY a.created_at DESC
        `);

        res.json(rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({
            message: "Database Error"
        });

    }
});
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

/*
=================================================
GET SINGLE ORGANIZATION + DOCUMENTS
=================================================
*/
router.get("/organization/:id", async (req, res) => {
    try {
        const id = req.params.id;

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
                a.email,
                a.created_at,
                a.status
            FROM organizations o
            JOIN accounts a ON o.account_id = a.account_id
            WHERE o.organization_id = ?
        `, [id]);

        if (!organization) {
            return res.status(404).json({
                message: "Organization not found"
            });
        }

        const [documents] = await pool.query(`
            SELECT
                document_id,
                document_name,
                file_path,
                uploaded_at
            FROM organization_documents
            WHERE organization_id = ?
        `, [id]);

        organization.documents = documents;
        res.json(organization);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Database Error"
        });
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

                ad.first_name,
                ad.last_name,
                ad.profile_picture,

                o.organization_name,
                o.contact_person,
                o.contact_number,
                o.city,
                o.province

            FROM accounts a

            LEFT JOIN adopters ad
                ON a.account_id = ad.account_id

            LEFT JOIN organizations o
                ON a.account_id = o.account_id

            ORDER BY a.created_at DESC
        `);

        const users = rows.map(user => {

            let name = "";

            if (user.role === "organization") {
                name = user.organization_name || "Unnamed Organization";
            } else {
                name =
                    `${user.first_name || ""} ${user.last_name || ""}`.trim();

                if (!name)
                    name = user.email;
            }

            return {
                account_id: user.account_id,
                name,
                email: user.email,
                role: user.role,
                status: user.status,
                created_at: user.created_at,

                phone: user.contact_number || "N/A",

                city: user.city || "",

                province: user.province || "",

                profile_picture: user.profile_picture,

                organization_name: user.organization_name,

                contact_person: user.contact_person
            };

        });

        res.json(users);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database Error"
        });

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
                o.province

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

        res.json(user);

    } catch(err){

        console.error(err);

        res.status(500).json({
            message:"Database Error"
        });

    }

});
/*
=================================================
ACTIVATE / DEACTIVATE USER
=================================================
*/

router.put("/users/:id/status", async (req,res)=>{

    try{

        const id=req.params.id;

        const [[account]]=await pool.query(

            `SELECT status
             FROM accounts
             WHERE account_id=?`,

            [id]

        );

        if(!account){

            return res.status(404).json({
                message:"User not found"
            });

        }

        const newStatus=
            account.status==="active"
            ? "disabled"
            : "active";

        await pool.query(

            `UPDATE accounts
             SET status=?
             WHERE account_id=?`,

            [newStatus,id]

        );

        res.json({

            success:true,
            status:newStatus

        });

    }catch(err){

        console.error(err);

        res.status(500).json({
            message:"Database Error"
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

        await pool.query(

            `UPDATE accounts
             SET status='disabled'
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
module.exports = router;
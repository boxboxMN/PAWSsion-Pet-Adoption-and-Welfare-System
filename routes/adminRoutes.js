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

            JOIN accounts a
                ON a.account_id = o.account_id

            WHERE o.verification_status='Pending'

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

            JOIN accounts a
                ON a.account_id=o.account_id

            WHERE o.verification_status='Approved'

            ORDER BY o.organization_name
        `);

        res.json(rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message:"Database Error"
        });

    }

});


/*
=================================================
GET SINGLE ORGANIZATION
=================================================
*/
router.get("/organization/:id", async (req,res)=>{

    try{

        const id=req.params.id;

        const [rows]=await pool.query(`

        SELECT

            o.*,
            a.email,
            a.created_at

        FROM organizations o

        JOIN accounts a
            ON a.account_id=o.account_id

        WHERE o.organization_id=?

        `,[id]);

        if(rows.length===0){

            return res.status(404).json({
                message:"Organization not found"
            });

        }

        res.json(rows[0]);

    }

    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Database Error"
        });

    }

});


/*
=================================================
APPROVE ORGANIZATION
=================================================
*/
router.put("/approve/:id", async (req,res)=>{

    const connection=await pool.getConnection();

    try{

        await connection.beginTransaction();

        const id=req.params.id;

        const [[organization]]=await connection.query(

            `SELECT account_id
             FROM organizations
             WHERE organization_id=?`,

            [id]

        );

        if(!organization){

            return res.status(404).json({
                message:"Organization not found"
            });

        }

        await connection.query(

            `UPDATE organizations
             SET verification_status='Approved'
             WHERE organization_id=?`,

            [id]

        );

        await connection.query(

            `UPDATE accounts
             SET
                status='active',
                email_verified=1
             WHERE account_id=?`,

            [organization.account_id]

        );

        await connection.commit();

        res.json({
            success:true
        });

    }

    catch(err){

        await connection.rollback();

        console.log(err);

        res.status(500).json({
            message:"Database Error"
        });

    }

    finally{

        connection.release();

    }

});


/*
=================================================
REJECT ORGANIZATION
=================================================
*/
router.put("/reject/:id", async (req,res)=>{

    const connection=await pool.getConnection();

    try{

        await connection.beginTransaction();

        const id=req.params.id;

        const [[organization]]=await connection.query(

            `SELECT account_id
             FROM organizations
             WHERE organization_id=?`,

            [id]

        );

        if(!organization){

            return res.status(404).json({
                message:"Organization not found"
            });

        }

        await connection.query(

            `UPDATE organizations
             SET verification_status='Rejected'
             WHERE organization_id=?`,

            [id]

        );

        await connection.query(

            `UPDATE accounts
             SET status='rejected'
             WHERE account_id=?`,

            [organization.account_id]

        );

        await connection.commit();

        res.json({
            success:true
        });

    }

    catch(err){

        await connection.rollback();

        console.log(err);

        res.status(500).json({
            message:"Database Error"
        });

    }

    finally{

        connection.release();

    }

});


module.exports = router;
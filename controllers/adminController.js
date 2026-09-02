//logic para sa lahat ng Admin modules.

const pool = require("../config/database");
const bcrypt = require("bcrypt")
/**
 * GET ALL PENDING ORGANIZATION REQUESTS
 * GET /admin/api/partner-requests
 */
exports.getPartnerRequests = async (req, res) => {
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

                a.account_id,
                a.email,
                a.created_at

            FROM organizations o

            INNER JOIN accounts a
                ON o.account_id = a.account_id

            WHERE o.verification_status = 'Pending'

            ORDER BY a.created_at DESC
        `);

        res.json({
            success: true,
            organizations: rows
        });

    } catch (err) {

        console.error("Partner Requests Error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to load partner requests."
        });

    }
};

/**
 * GET ALL APPROVED ORGANIZATIONS
 * GET /admin/api/organizations
 */
exports.getOrganizations = async (req, res) => {

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

                a.account_id,
                a.email,
                a.created_at

            FROM organizations o

            INNER JOIN accounts a
                ON o.account_id = a.account_id

            WHERE o.verification_status='Approved'

            ORDER BY o.organization_name ASC
        `);

        res.json({
            success: true,
            organizations: rows
        });

    } catch (err) {

        console.error("Organizations Error:", err);

        res.status(500).json({
            success: false,
            message: "Unable to load organizations."
        });

    }

};

exports.getUsers = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT

                a.account_id,
                a.email,
                a.role,
                a.status,
                a.created_at,
                a.last_login,

                CASE
                    WHEN a.role='adopter'
                        THEN CONCAT(ad.first_name,' ',ad.last_name)

                    WHEN a.role='organization'
                        THEN o.organization_name

                    ELSE 'Administrator'
                END AS name,

                CASE
                    WHEN a.role='adopter'
                        THEN ad.phone_number

                    WHEN a.role='organization'
                        THEN o.contact_number

                    ELSE NULL
                END AS phone,

                CASE
                    WHEN a.role='adopter'
                        THEN ad.profile_picture

                    WHEN a.role='organization'
                        THEN o.profile_pic

                    ELSE NULL
                END AS profile

            FROM accounts a

            LEFT JOIN adopters ad
                ON a.account_id = ad.account_id

            LEFT JOIN organizations o
                ON a.account_id = o.account_id

            ORDER BY a.created_at DESC
        `);

        res.json(rows);

    } catch(err){

        console.error(err);

        res.status(500).json({
            message:"Unable to load users."
        });

    }

};
exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // or set specific logic per route endpoint
        
        await pool.query("UPDATE accounts SET status = ? WHERE account_id = ?", [status, id]);
        
        res.json({ success: true, message: "Account status updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update status." });
    }
};
exports.getCurrentAdmin = async (req, res) => {
    try {
        const accountId = req.session?.accountId; // <--- Alisin ang underscore
        if (!accountId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const [[user]] = await pool.query(`
            SELECT account_id, email, role
            FROM accounts
            WHERE account_id = ?
        `, [accountId]);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.name = user.role === 'admin' ? "System Administrator" : user.email;

        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

exports.updateAdminProfile = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        
        if (!accountId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in again." });
        }

        const { email, password } = req.body; // Hindi na natin kailangan ang 'name' dito

        // 1. I-update ang email at updated_at timestamp lamang
        await pool.query(
            `UPDATE accounts SET email = ?, updated_at = NOW() WHERE account_id = ?`,
            [email, accountId]
        );

        // 2. I-update ang password_hash kung may inilagay na bago
        if (password && password.trim() !== "") {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            await pool.query(
                `UPDATE accounts SET password_hash = ?, updated_at = NOW() WHERE account_id = ?`,
                [hashedPassword, accountId]
            );
        }

        res.json({ success: true, message: "Profile updated successfully in the database!" });
    } catch (err) {
        console.error("Database Update Error:", err);
        res.status(500).json({ success: false, message: "Database Error: " + err.message });
    }
};

/**
 * GET ALL FEEDBACK (from organizations and adopters)
 * GET /admin/feedback/list
 */
exports.getFeedback = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                f.feedback_id AS id,
                accounts.email AS sender_email,
                CASE
                    WHEN f.submitted_by = 'organization' THEN 'Organization'
                    WHEN f.submitted_by = 'user' THEN 'Adopter'
                END AS sender_role,
                CASE
                    WHEN f.submitted_by = 'organization' THEN organizations.organization_name
                    WHEN f.submitted_by = 'user' THEN CONCAT(adopters.first_name, ' ', adopters.last_name)
                END AS sender_name,
                CASE
                    WHEN f.submitted_by = 'organization' THEN organizations.profile_pic
                    WHEN f.submitted_by = 'user' THEN adopters.profile_picture
                END AS sender_profile_picture,
                CONCAT(f.subject, ' — ', f.message) AS message,
                f.rating,
                f.status,
                f.previous_status,
                f.created_at AS date
            FROM feedback f
            JOIN accounts ON accounts.account_id = f.account_id
            LEFT JOIN organizations ON organizations.organization_id = f.organization_id
            LEFT JOIN adopters ON adopters.account_id = f.account_id
            ORDER BY f.created_at DESC
        `);

        res.json(rows);
    } catch (err) {
        console.error("Get Feedback Error:", err);
        res.status(500).json({ message: "Database Error" });
    }
};

/**
 * UPDATE FEEDBACK STATUS (resolve / archive)
 * PUT /admin/feedback/:id/status
 */
exports.updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body;

        const validActions = ["resolve", "unresolve", "archive", "unarchive"];
        if (!validActions.includes(action)) {
            return res.status(400).json({ success: false, message: "Invalid action provided." });
        }

        if (action === "archive") {
            const [[current]] = await pool.query(
                `SELECT status FROM feedback WHERE feedback_id = ?`,
                [id]
            );

            if (!current) {
                return res.status(404).json({ success: false, message: "Feedback not found." });
            }

            await pool.query(
                `UPDATE feedback SET previous_status = ?, status = 'archived' WHERE feedback_id = ?`,
                [current.status, id]
            );

            return res.json({ success: true, status: "archived", previous_status: current.status });
        }

        if (action === "unarchive") {
            const [[current]] = await pool.query(
                `SELECT previous_status FROM feedback WHERE feedback_id = ?`,
                [id]
            );

            if (!current) {
                return res.status(404).json({ success: false, message: "Feedback not found." });
            }

            const restoredStatus = current.previous_status || "pending";

            await pool.query(
                `UPDATE feedback SET status = ?, previous_status = NULL WHERE feedback_id = ?`,
                [restoredStatus, id]
            );

            return res.json({ success: true, status: restoredStatus, previous_status: null });
        }

            // action === "resolve" or "unresolve"
            const newStatus = action === "resolve" ? "resolved" : "pending";

            const [result] = await pool.query(
                   `UPDATE feedback SET status = ?, previous_status = NULL WHERE feedback_id = ?`,
                   [newStatus, id]
            );
       
            if (result.affectedRows === 0) {
                   return res.status(404).json({ success: false, message: "Feedback not found." });
            }
       
               res.json({ success: true, status: newStatus, previous_status: null });

    } catch (err) {
        console.error("Update Feedback Status Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};
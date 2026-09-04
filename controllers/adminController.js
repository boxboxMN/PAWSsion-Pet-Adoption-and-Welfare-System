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
                f.feedback_type,
                f.subject,
                f.message,
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

/**
 * GET SITE CONTACT INFO (public — used by org & user support pages)
 * GET /api/contact-info
 */
exports.getContactInfo = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT setting_key, setting_value FROM site_settings`);

        const info = {};
        rows.forEach(row => {
            info[row.setting_key] = row.setting_value;
        });

        res.json({ success: true, contactInfo: info });
    } catch (err) {
        console.error("Get Contact Info Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

/**
 * UPDATE SITE CONTACT INFO (admin only)
 * PUT /admin/settings/contact-info
 */
exports.updateContactInfo = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        if (!accountId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        let { support_email, support_phone, support_hours_days, support_hours_time } = req.body;

        // --- Sanitize ---
        if (support_email) support_email = support_email.trim();
        if (support_phone) support_phone = support_phone.replace(/\D/g, "").slice(0, 11);
        if (support_hours_days) support_hours_days = support_hours_days.trim();
        if (support_hours_time) support_hours_time = support_hours_time.trim();

        // --- Validate ---
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (support_email !== undefined && !emailPattern.test(support_email)) {
            return res.status(400).json({ success: false, message: "Invalid email address." });
        }

        const phPhonePattern = /^09\d{9}$/;
        if (support_phone !== undefined && !phPhonePattern.test(support_phone)) {
            return res.status(400).json({ success: false, message: "Phone number must be 11 digits starting with 09 (PH mobile format)." });
        }

        const validDays = ["Monday – Friday", "Monday – Saturday", "Monday – Sunday", "Saturday – Sunday"];
        if (support_hours_days !== undefined && !validDays.includes(support_hours_days)) {
            return res.status(400).json({ success: false, message: "Invalid support days selection." });
        }

        if (support_hours_time !== undefined && support_hours_time.trim() === "") {
            return res.status(400).json({ success: false, message: "Support time is required." });
        }

        const updates = { support_email, support_phone, support_hours_days, support_hours_time };

        for (const [key, value] of Object.entries(updates)) {
            if (value === undefined) continue;
            await pool.query(
                `UPDATE site_settings SET setting_value = ? WHERE setting_key = ?`,
                [value, key]
            );
        }

        res.json({ success: true, message: "Contact info updated successfully!" });
    } catch (err) {
        console.error("Update Contact Info Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

/**
 * GET GUIDE SECTIONS (public — used by support pages, and admin editor)
 * GET /api/guide?audience=organization
 */
exports.getGuideSections = async (req, res) => {
    try {
        const audience = req.query.audience || "organization";

        const [rows] = await pool.query(
            `SELECT section_id, title, badge_color, bullets, display_order
             FROM guide_sections
             WHERE audience = ? AND deleted_at IS NULL
             ORDER BY display_order ASC, section_id ASC`,
            [audience]
        );

        res.json({ success: true, sections: rows });
    } catch (err) {
        console.error("Get Guide Sections Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

/**
 * CREATE GUIDE SECTION (admin only)
 * POST /admin/guide/sections
 */
exports.createGuideSection = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        if (!accountId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { audience, title, badge_color, bullets } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: "Title is required." });
        }
        if (!bullets || !bullets.trim()) {
            return res.status(400).json({ success: false, message: "At least one bullet point is required." });
        }

        const [[maxOrder]] = await pool.query(
            `SELECT COALESCE(MAX(display_order), 0) AS maxOrder FROM guide_sections WHERE audience = ?`,
            [audience || "organization"]
        );

        await pool.query(
            `INSERT INTO guide_sections (audience, title, badge_color, bullets, display_order)
             VALUES (?, ?, ?, ?, ?)`,
            [audience || "organization", title.trim(), badge_color || "blue", bullets.trim(), maxOrder.maxOrder + 1]
        );

        res.status(201).json({ success: true, message: "Section added." });
    } catch (err) {
        console.error("Create Guide Section Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

/**
 * UPDATE GUIDE SECTION (admin only)
 * PUT /admin/guide/sections/:id
 */
exports.updateGuideSection = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        if (!accountId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { id } = req.params;
        const { title, badge_color, bullets, display_order } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: "Title is required." });
        }
        if (!bullets || !bullets.trim()) {
            return res.status(400).json({ success: false, message: "At least one bullet point is required." });
        }

        const [result] = await pool.query(
            `UPDATE guide_sections SET title = ?, badge_color = ?, bullets = ?, display_order = ? WHERE section_id = ?`,
            [title.trim(), badge_color || "blue", bullets.trim(), display_order || 0, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Section not found." });
        }

        res.json({ success: true, message: "Section updated." });
    } catch (err) {
        console.error("Update Guide Section Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

/**
 * DELETE GUIDE SECTION (admin only)
 * DELETE /admin/guide/sections/:id
 */
exports.deleteGuideSection = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        if (!accountId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { id } = req.params;

        const [result] = await pool.query(
            `UPDATE guide_sections SET deleted_at = NOW() WHERE section_id = ? AND deleted_at IS NULL`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Section not found." });
        }

        res.json({ success: true, message: "Section moved to Recycle Bin." });
    } catch (err) {
        console.error("Delete Guide Section Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

/**
 * GET TRASHED GUIDE SECTIONS (admin only)
 * GET /admin/guide/sections/trash?audience=organization
 */
exports.getTrashedGuideSections = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        if (!accountId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const audience = req.query.audience || "organization";

        await purgeExpiredGuideTrash();

        const [rows] = await pool.query(
            `SELECT section_id, title, badge_color, bullets, deleted_at,
                    DATEDIFF((deleted_at + INTERVAL 30 DAY), NOW()) AS days_left
             FROM guide_sections
             WHERE audience = ? AND deleted_at IS NOT NULL
             ORDER BY deleted_at DESC`,
            [audience]
        );

        res.json({ success: true, sections: rows });
    } catch (err) {
        console.error("Get Trashed Guide Sections Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

/**
 * RESTORE GUIDE SECTION FROM TRASH (admin only)
 * PUT /admin/guide/sections/:id/restore
 */
exports.restoreGuideSection = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        if (!accountId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { id } = req.params;

        const [result] = await pool.query(
            `UPDATE guide_sections SET deleted_at = NULL WHERE section_id = ? AND deleted_at IS NOT NULL`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Section not found in Recycle Bin." });
        }

        res.json({ success: true, message: "Section restored." });
    } catch (err) {
        console.error("Restore Guide Section Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

/**
 * RECYCLE BIN: Auto-purge guide sections trashed over 30 days
 */
async function purgeExpiredGuideTrash() {
    await pool.query(
        `DELETE FROM guide_sections
         WHERE deleted_at IS NOT NULL
         AND deleted_at < (NOW() - INTERVAL 30 DAY)`
    );
}

/**
 * PERMANENTLY DELETE GUIDE SECTION (admin only)
 * DELETE /admin/guide/sections/:id/permanent
 */
exports.permanentlyDeleteGuideSection = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        if (!accountId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { id } = req.params;

        const [result] = await pool.query(
            `DELETE FROM guide_sections WHERE section_id = ? AND deleted_at IS NOT NULL`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Section not found in Recycle Bin." });
        }

        res.json({ success: true, message: "Section permanently deleted." });
    } catch (err) {
        console.error("Permanently Delete Guide Section Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};

/**
 * REORDER GUIDE SECTIONS (admin only)
 * PUT /admin/guide/sections/reorder
 */
exports.reorderGuideSections = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        if (!accountId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { orderedIds } = req.body;

        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return res.status(400).json({ success: false, message: "orderedIds must be a non-empty array." });
        }

        for (let i = 0; i < orderedIds.length; i++) {
            await pool.query(
                `UPDATE guide_sections SET display_order = ? WHERE section_id = ?`,
                [i + 1, orderedIds[i]]
            );
        }

        res.json({ success: true, message: "Order updated." });
    } catch (err) {
        console.error("Reorder Guide Sections Error:", err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
};
//logic para sa lahat ng Admin modules.

const pool = require("../config/database");

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
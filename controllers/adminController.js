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
/**
 * GET DASHBOARD STATS
 * GET /admin/dashboard/stats
 */
exports.getDashboardStats = async (req, res) => {
    try {

        // Total organizations
        const [[organization]] = await pool.query(`
            SELECT COUNT(*) AS totalOrganizations
            FROM organizations
            WHERE verification_status = 'Approved'
        `);

        // Total active users (organizations + adopters)
        const [[users]] = await pool.query(`
            SELECT COUNT(*) AS totalActiveUsers
            FROM accounts
            WHERE status = 'active'
              AND role <> 'admin'
        `);

        res.json({
            totalOrganizations: organization.totalOrganizations,
            totalActiveUsers: users.totalActiveUsers
        });

    } catch (err) {

        console.error("Dashboard Stats Error:", err);

        res.status(500).json({
            message: "Failed to load dashboard statistics."
        });

    }
};
exports.getDashboardStats = async (req, res) => {
    try {

        const [[organizations]] = await pool.query(`
            SELECT COUNT(*) AS totalOrganizations
            FROM organizations
        `);

        const [[users]] = await pool.query(`
            SELECT COUNT(*) AS totalActiveUsers
            FROM accounts
            WHERE status='active'
        `);

        const [[orgThisMonth]] = await pool.query(`
            SELECT COUNT(*) AS organizationsThisMonth
            FROM organizations o
            JOIN accounts a ON o.account_id = a.account_id
            WHERE YEAR(a.created_at)=YEAR(CURDATE())
              AND MONTH(a.created_at)=MONTH(CURDATE())
        `);

        const [[usersThisMonth]] = await pool.query(`
            SELECT COUNT(*) AS usersThisMonth
            FROM accounts
            WHERE status='active'
              AND YEAR(created_at)=YEAR(CURDATE())
              AND MONTH(created_at)=MONTH(CURDATE())
        `);

        res.json({
            totalOrganizations: organizations.totalOrganizations,
            totalActiveUsers: users.totalActiveUsers,
            organizationsThisMonth: orgThisMonth.organizationsThisMonth,
            usersThisMonth: usersThisMonth.usersThisMonth
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
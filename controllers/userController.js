//logic para sa lahat ng User modules.
const pool = require("../config/database"); 
const bcrypt = require("bcrypt");

exports.getProfile = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) return res.status(401).json({ error: "Unauthorized" });

    try {
        
        const [rows] = await pool.query(
            `SELECT first_name, last_name, email, phone_number, profile_picture, created_at 
             FROM adopters 
             JOIN accounts ON adopters.account_id = accounts.account_id 
             WHERE adopters.account_id = ?`, 
            [accountId]
        );

        if (rows.length === 0) return res.status(404).json({ error: "Profile not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    const { fullName, email, mobile } = req.body;

   
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const connection = await pool.getConnection();
    try {
      
        await connection.beginTransaction();

        
        await connection.query(
            `UPDATE accounts SET email = ? WHERE account_id = ?`,
            [email, accountId]
        );

        
        await connection.query(
            `UPDATE adopters SET first_name = ?, last_name = ?, phone_number = ? WHERE account_id = ?`,
            [firstName, lastName, mobile, accountId]
        );

        await connection.commit();

        
        req.session.displayName = `${firstName} ${lastName}`.trim() || email;

        res.json({ success: true, message: "Profile updated successfully!" });
    } catch (error) {
        await connection.rollback();
        console.error("Update profile database error:", error);
        res.status(500).json({ error: "Database transaction failed during update" });
    } finally {
        connection.release();
    }
};

exports.updatePassword = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        
        const [users] = await pool.query(
            `SELECT password_hash FROM accounts WHERE account_id = ? LIMIT 1`,
            [accountId]
        );

        if (!users.length) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = users[0];

        
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Maling kasalukuyang password (Incorrect Current Password)" });
        }

        
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        
        await pool.query(
            `UPDATE accounts SET password_hash = ? WHERE account_id = ?`,
            [newPasswordHash, accountId]
        );

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.error("Update password database error:", error);
        res.status(500).json({ error: "Server error during password update" });
    }
};
exports.updateAvatar = async (req, res) => {
    
    const accountId = req.session?.accountId; 
    
    if (!accountId) {
        return res.status(401).json({ success: false, error: "Unauthorized access. Please re-login." });
    }

   
    if (!req.file) {
        return res.status(400).json({ success: false, error: "No image file provided or file type invalid." });
    }

    
    const profilePictureUrl = `/uploads/avatars/${req.file.filename}`;

    try {
      
        const queryText = `UPDATE adopters SET profile_picture = ? WHERE account_id = ?`;
        
        
        const [infoHeader] = await pool.query(queryText, [profilePictureUrl, accountId]);

      
        if (infoHeader && infoHeader.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Adopter profile record not found." });
        }

        return res.json({ 
            success: true, 
            message: "Profile picture saved successfully!",
            avatarUrl: profilePictureUrl 
        });

    } catch (error) {
        console.error("EXACT DATABASE CRASH ERROR:", error);
        
        return res.status(500).json({ 
            success: false, 
            error: "Internal Server Database Error: " + error.message 
        });
    }
};// ==========================================
// PET & ORGANIZATION FEEDS
// ==========================================

exports.getAvailablePets = async (req, res) => {
    try {
        const [pets] = await pool.query(`
            SELECT a.*, o.organization_name
            FROM animals a
            INNER JOIN organizations o ON a.organization_id = o.organization_id
            WHERE a.adoption_status = 'Available'
            ORDER BY a.created_at DESC
        `);

        res.json({ success: true, pets });
    } catch (err) {
        console.error("Get Available Pets Error:", err);
        res.status(500).json({ success: false, message: "Failed to load pets." });
    }
};

exports.getOrganizations = async (req, res) => {
    try {
        // Naka-LEFT JOIN na sa organization_payment_details para hindi mag-error sa missing column
        const [organizations] = await pool.query(`
            SELECT
                o.organization_id,
                o.organization_name,
                o.city,
                o.province,
                o.contact_number,
                o.description,
                o.profile_pic,
                p.gcash_name,
                p.gcash_number,
                p.qr_code
            FROM organizations o
            LEFT JOIN organization_payment_details p ON o.organization_id = p.organization_id
            WHERE o.verification_status = 'Approved'
        `);

        const formattedOrgs = organizations.map(org => {
            const profilePic = (org.profile_pic && org.profile_pic.trim() !== '')
                ? (org.profile_pic.startsWith('/') ? org.profile_pic : `/uploads/${org.profile_pic}`)
                : '/uploads/default-org.png';

            const qrCode = (org.qr_code && org.qr_code.trim() !== '' && org.qr_code !== '/uploads/qr/')
                ? (org.qr_code.startsWith('/') ? org.qr_code : `/uploads/qr/${org.qr_code}`)
                : '';

            return {
                ...org,
                profile_pic: profilePic,
                qr_code: qrCode
            };
        });

        res.json(formattedOrgs);
    } catch (err) {
        console.error("Get Organizations Error:", err);
        res.status(500).json({ success: false, message: "Failed to load organizations." });
    }
};

// ==========================================
// DONATION SUBMISSIONS (USER SIDE)
// ==========================================

exports.submitCashDonation = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ success: false, error: "Unauthorized access. Please login." });
    }

    const {
        organization_id,
        donor_name,
        donor_email,
        gcash_account_name,
        reference_number,
        amount
    } = req.body;

    if (!organization_id || !donor_name || !donor_email || !reference_number || !amount) {
        return res.status(400).json({ success: false, error: "Please fill in all required fields." });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, error: "Please upload your proof of payment (Receipt)." });
    }

    const receipt_path = `/uploads/receipts/${req.file.filename}`;

    try {
        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ?`,
            [accountId]
        );

        const adopter_id = adopterRows.length > 0 ? adopterRows[0].adopter_id : null;

        const [result] = await pool.query(
            `INSERT INTO cash_donations 
            (adopter_id, organization_id, donor_name, donor_email, gcash_account_name, reference_number, amount, receipt_path, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())`,
            [
                adopter_id,
                organization_id,
                donor_name,
                donor_email,
                gcash_account_name || donor_name,
                reference_number,
                amount,
                receipt_path
            ]
        );

        return res.json({
            success: true,
            message: "Thank you! Your cash donation has been submitted and is pending verification.",
            donationId: result.insertId
        });

    } catch (error) {
        console.error("Submit Cash Donation Error:", error);
        return res.status(500).json({ success: false, error: "Database error while processing donation: " + error.message });
    }
};



// ==========================================
// GET USER DONATIONS & HISTORY
// ==========================================

exports.getUserDonations = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ success: false, error: "Unauthorized access. Please login." });
    }

    try {
        const [adopterRows] = await pool.query(
            `SELECT a.adopter_id, acc.email 
             FROM adopters a 
             JOIN accounts acc ON a.account_id = acc.account_id 
             WHERE a.account_id = ?`,
            [accountId]
        );

        const adopterId = adopterRows.length > 0 ? adopterRows[0].adopter_id : null;
        const userEmail = adopterRows.length > 0 ? adopterRows[0].email : null;

        // 1. Fetch Cash Donations
        const [cashRows] = await pool.query(`
            SELECT 
                c.cash_donation_id AS id,
                c.created_at AS date,
                'Cash' AS type,
                o.organization_name AS organization,
                c.gcash_account_name,
                c.reference_number,
                c.amount,
                c.status,
                c.receipt_path,
                c.rejection_reason
            FROM cash_donations c
            LEFT JOIN organizations o ON c.organization_id = o.organization_id
            WHERE c.adopter_id = ? OR c.donor_email = ?
            ORDER BY c.created_at DESC
        `, [adopterId, userEmail]);

        // 2. Fetch In-Kind Donations (Direkta mula sa inkind_donations table)
        const [inkindRows] = await pool.query(`
            SELECT 
                i.inkind_donation_id AS id,
                i.created_at AS date,
                'In-Kind' AS type,
                o.organization_name AS organization,
                i.item_name,
                i.quantity,
                i.unit,
                i.location_image_path,
                i.status,
                i.rejection_reason
            FROM inkind_donations i
            LEFT JOIN organizations o ON i.organization_id = o.organization_id
            WHERE i.adopter_id = ? OR i.donor_email = ?
            ORDER BY i.created_at DESC
        `, [adopterId, userEmail]);

        // 3. Pagsamahin at i-sort ayon sa petsa
        const allDonations = [...cashRows, ...inkindRows].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        return res.json({
            success: true,
            donations: allDonations
        });

    } catch (error) {
        console.error("Get User Donations Error:", error);
        return res.status(500).json({ success: false, error: "Database error while fetching donation history: " + error.message });
    }
};

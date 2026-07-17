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
};
exports.getAvailablePets = async (req, res) => {
    try {

        const [pets] = await pool.query(`
            SELECT
                a.*,
                o.organization_name
            FROM animals a
            INNER JOIN organizations o
                ON a.organization_id = o.organization_id
            WHERE a.adoption_status = 'Available'
            ORDER BY a.created_at DESC
        `);

        res.json({
            success: true,
            pets
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to load pets."
        });

    }
};
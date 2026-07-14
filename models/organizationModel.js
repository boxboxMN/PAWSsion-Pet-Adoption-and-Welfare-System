//SQL queries para sa Organization.

const pool = require('../config/database');

const Organization = {
    // Function para makuha ang buong profile gamit ang account_id galing session
    getProfileByAccountId: async (accountId) => {
        const query = `
            SELECT 
                organization_name, 
                contact_number, 
                organization_type, 
                address, 
                city, 
                province,
                description,
                contact_person,
                profile_pic 
            FROM organizations 
            WHERE account_id = ? 
            LIMIT 1
        `;
        const [rows] = await pool.query(query, [accountId]);
        return rows[0]; // Ibabalik ang isang row ng data
    },

    // Get the current password for verification during change password
    getPasswordById: async (accountId) => {
        const query = `SELECT password_hash FROM accounts WHERE account_id = ? LIMIT 1`;
        const [rows] = await pool.query(query, [accountId]);
        console.log("Query result for accountId:", accountId, rows); // Debug log
        return rows[0] ? rows[0].password_hash : null;
    },

    //Update new password
    updatePassword: async (accountId, hashedNewPassword) => {
        const query = `UPDATE accounts SET password_hash = ? WHERE account_id = ?`;
        const [result] = await pool.query(query, [hashedNewPassword, accountId]);
        return result.affectedRows > 0;
    },

    // Bagong function para mag-update ng profile details at profile pic
    updateProfile: async (accountId, profileData) => {
        const { organization_name, contact_number, contact_person, address, city, province, description, profile_pic } = profileData;
        
        // Dynamic query: I-update lang ang profile_pic kung may bagong file na in-upload
        let query = `
            UPDATE organizations 
            SET 
                organization_name = ?, 
                contact_number = ?, 
                contact_person = ?, 
                address = ?, 
                city = ?, 
                province = ?, 
                description = ?
        `;
        
        const params = [organization_name, contact_number, contact_person, address, city, province, description];

        if (profile_pic) {
            query += `, profile_pic = ? `;
            params.push(profile_pic);
        }

        query += ` WHERE account_id = ?`;
        params.push(accountId);

        const [result] = await pool.query(query, params);
        return result.affectedRows > 0;
    }
};

module.exports = Organization;
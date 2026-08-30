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
                region,
                province,
                city, 
                barangay,
                zip_code,
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
        const { organization_name, contact_number, contact_person, address, region, province, city, barangay, zip_code, description, profile_pic } = profileData;
    
        // Dynamic query: I-update lang ang profile_pic kung may bagong file na in-upload
        let query = `
            UPDATE organizations 
            SET 
                organization_name = ?, 
                contact_number = ?, 
                contact_person = ?, 
                address = ?, 
                region = ?,
                province = ?, 
                city = ?, 
                barangay = ?,
                zip_code = ?,
                description = ?
        `;
        
        const params = [organization_name, contact_number, contact_person, address, region, province, city, barangay, zip_code, description];

        if (profile_pic) {
            query += `, profile_pic = ? `;
            params.push(profile_pic);
        }

        query += ` WHERE account_id = ?`;
        params.push(accountId);

        const [result] = await pool.query(query, params);
        return result.affectedRows > 0;
    },

    // Tulong na function: kunin ang tunay na organizations.organization_id gamit ang account_id (galing session)
    getOrganizationIdByAccountId: async (accountId) => {
        const [rows] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ? LIMIT 1`,
            [accountId]
        );
        if (!rows.length) {
            throw new Error("Organization not found for this account.");
        }
        return rows[0].organization_id;
    },

     // Kunin ang weekly availability ng organization; kung wala pang naka-set, i-seed ng defaults (Mon-Sat 8AM-6PM, Sunday closed)
     getAvailability: async (accountId) => {
        const organizationId = await Organization.getOrganizationIdByAccountId(accountId);

        const [rows] = await pool.query(
            `SELECT day_of_week, is_open, start_time, end_time FROM organization_availability WHERE organization_id = ? ORDER BY day_of_week`,
            [organizationId]
        );

        if (rows.length === 7) return rows;

        // Kulang o walang laman — gumawa ng default na 7 rows (Sun-Sat)
        const defaults = [];
        for (let day = 0; day <= 6; day++) {
            defaults.push({
                organization_id: organizationId,
                day_of_week: day,
                is_open: day === 0 ? 0 : 1, // Closed by default sa Sunday
                start_time: '08:00:00',
                end_time: '18:00:00'
            });
        }

        // I-insert ang defaults papunta sa DB para sa susunod na tawag
        for (const d of defaults) {
            await pool.query(
                `INSERT INTO organization_availability (organization_id, day_of_week, is_open, start_time, end_time) 
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE day_of_week = day_of_week`,
                [d.organization_id, d.day_of_week, d.is_open, d.start_time, d.end_time]
            );
        }

        const [seededRows] = await pool.query(
            `SELECT day_of_week, is_open, start_time, end_time FROM organization_availability WHERE organization_id = ? ORDER BY day_of_week`,
            [organizationId]
        );
        return seededRows;
    },

     // I-save ang bagong weekly availability (array ng 7 entries, isa per day)
     updateAvailability: async (accountId, days) => {
        const organizationId = await Organization.getOrganizationIdByAccountId(accountId);

        for (const d of days) {
            await pool.query(
                `INSERT INTO organization_availability (organization_id, day_of_week, is_open, start_time, end_time)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                    is_open = VALUES(is_open),
                    start_time = VALUES(start_time),
                    end_time = VALUES(end_time)`,
                [organizationId, d.day_of_week, d.is_open ? 1 : 0, d.start_time, d.end_time]
            );
        }
        return true;
    }
};

module.exports = Organization;
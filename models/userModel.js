//SQL queries para sa User.
const pool = require('../config/database');

// AdoptionModel.js
const AdoptionModel = {
    async checkUserApplication(userId, petId) {
        const [rows] = await pool.query(
            "SELECT application_id, status FROM user_adoption_applications WHERE adopter_id = ? AND animal_id = ?",
            [userId, petId]
        );
        return rows[0] || null;
    }
};

module.exports = AdoptionModel;
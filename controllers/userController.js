//logic para sa lahat ng User modules.
const pool = require("../config/database"); 
const bcrypt = require("bcrypt");
const AdoptionModel = require('../models/userModel');

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
// ==========================================
// PET & ORGANIZATION FEEDS
// ==========================================

exports.getAvailablePets = async (req, res) => {
    try {

        const [pets] = await pool.query(`
            SELECT
                a.*,
                o.organization_name,
                o.profile_pic
            FROM animals a
            INNER JOIN organizations o
                ON a.organization_id = o.organization_id
            WHERE a.adoption_status='Available'
            ORDER BY a.created_at DESC
        `);

        // Attach medical history
        for (const pet of pets) {

            const [medical] = await pool.query(`
                SELECT
                    medical_id,
                    treatment,
                    administered_date,
                    administered_by,
                    notes
                FROM animal_medical_history
                WHERE animal_id = ?
                ORDER BY administered_date DESC
            `, [pet.animal_id]);

            pet.medical_history = medical;
        }

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
exports.getOrganizations = async (req, res) => {
    try {
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
                p.qr_code,
                d.dropoff_address,
                d.dropoff_hours,
                d.dropoff_notes,
                d.dropoff_image
            FROM organizations o
            LEFT JOIN organization_payment_details p ON o.organization_id = p.organization_id
            LEFT JOIN organization_dropoff_details d ON o.organization_id = d.organization_id
            WHERE o.verification_status = 'Approved'
        `);

        const formattedOrgs = organizations.map(org => {
            const profilePic = (org.profile_pic && org.profile_pic.trim() !== '')
                ? (org.profile_pic.startsWith('/') ? org.profile_pic : `/uploads/${org.profile_pic}`)
                : '/uploads/default-org.png';

            const qrCode = (org.qr_code && org.qr_code.trim() !== '' && org.qr_code !== '/uploads/qr/')
                ? (org.qr_code.startsWith('/') ? org.qr_code : `/uploads/qr/${org.qr_code}`)
                : '';

            // --- PERPEKTONG FIX PARA SA DROPOFF IMAGE ---
            let dropoffImg = (org.dropoff_image && org.dropoff_image.trim() !== '') ? org.dropoff_image.trim() : '';

            if (dropoffImg && !dropoffImg.startsWith('/') && !dropoffImg.startsWith('http')) {
                // Kung ang filename ay may pamagat na "qr-", ilagay sa /uploads/qr/ folder
                if (dropoffImg.startsWith('qr-')) {
                    dropoffImg = `/uploads/qr/${dropoffImg}`;
                } else {
                    dropoffImg = `/uploads/${dropoffImg}`;
                }
            }

            return {
                ...org,
                profile_pic: profilePic,
                qr_code: qrCode,
                dropoff_image: dropoffImg
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

    try {
        // --- ADDED CONDITION: Check if GCash details exist for the org ---
        const [paymentRows] = await pool.query(
            `SELECT gcash_number, gcash_name FROM organization_payment_details WHERE organization_id = ?`,
            [organization_id]
        );

        if (!paymentRows.length || !paymentRows[0].gcash_number) {
            return res.status(400).json({ 
                success: false, 
                error: "This organization has not provided GCash payment details yet. Cash donations are currently disabled for this organization." 
            });
        }

        const receipt_path = `/uploads/receipts/${req.file.filename}`;

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
exports.submitInKindDonation = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ success: false, error: "Unauthorized access. Please login." });
    }

    const { organization_id, item_name, quantity } = req.body;

    if (!organization_id || !item_name || !quantity) {
        return res.status(400).json({ success: false, error: "Please fill in all required fields." });
    }

    try {
        // --- ADDED CONDITION: Check if Drop-off details exist for the org ---
        const [dropoffRows] = await pool.query(
            `SELECT dropoff_address FROM organization_dropoff_details WHERE organization_id = ?`,
            [organization_id]
        );

        if (!dropoffRows.length || !dropoffRows[0].dropoff_address) {
            return res.status(400).json({ 
                success: false, 
                error: "This organization has not set up drop-off location details yet. In-kind donations are currently disabled for this organization." 
            });
        }

        const [adopterRows] = await pool.query(
            `SELECT a.adopter_id, a.first_name, a.last_name, acc.email 
             FROM adopters a 
             JOIN accounts acc ON a.account_id = acc.account_id 
             WHERE a.account_id = ?`,
            [accountId]
        );

        if (!adopterRows.length) {
            return res.status(404).json({ success: false, error: "Adopter record not found." });
        }

        const adopter = adopterRows[0];
        const donorName = `${adopter.first_name} ${adopter.last_name}`.trim();

        const [result] = await pool.query(
            `INSERT INTO inkind_donations 
            (adopter_id, organization_id, donor_name, donor_email, item_name, quantity, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', NOW())`,
            [
                adopter.adopter_id,
                organization_id,
                donorName,
                adopter.email,
                item_name,
                quantity
            ]
        );

        return res.json({
            success: true,
            message: "In-kind donation request submitted successfully!",
            inkindDonationId: result.insertId
        });

    } catch (error) {
        console.error("Submit In-Kind Donation Error:", error);
        return res.status(500).json({ success: false, error: "Database error while submitting in-kind donation: " + error.message });
    }
};
// Idagdag ito sa userController.js kung wala pa:
exports.getOrgDropoffDetails = async (req, res) => {
    try {
        const { org_id } = req.params;
        const [rows] = await pool.query(
            `SELECT 
                o.organization_name, 
                d.dropoff_address, 
                d.dropoff_hours, 
                d.dropoff_notes, 
                d.dropoff_image 
             FROM organizations o
             LEFT JOIN organization_dropoff_details d ON o.organization_id = d.organization_id
             WHERE o.organization_id = ?`,
            [org_id]
        );

        if (!rows.length) {
            return res.status(404).json({ success: false, message: "Organization dropoff details not found." });
        }

        res.json({ success: true, dropoff: rows[0] });
    } catch (error) {
        console.error("Error fetching dropoff details:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
// user application pet id
exports.getPetById = async (req, res) => {
    try {
        const petId = req.params.id;

        const [rows] = await pool.query(`
            SELECT
                a.animal_id,
                a.name,
                a.species,
                a.gender,
                a.age,
                a.image_path,
                o.organization_name
            FROM animals a
            JOIN organizations o
                ON a.organization_id = o.organization_id
            WHERE a.animal_id = ?
        `, [petId]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Pet not found"
            });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};
//for user adoption application submission
exports.submitAdoptionApplication = async (req, res) => {
    try {
        // 1. Tama na: req.session.accountId ang gamitin
        const accountId = req.session?.accountId;

        if (!accountId) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized access. Please log in to submit an application.'
            });
        }

        // 2. Kunin ang totoong adopter_id mula sa adopters table
        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ?`,
            [accountId]
        );

        if (!adopterRows.length) {
            return res.status(404).json({
                status: 'error',
                message: 'Adopter profile record not found.'
            });
        }

        const adopterId = adopterRows[0].adopter_id;

        // 3. Kunin ang totoong uploaded filename galing kay Multer (req.file)
        const documentPath = req.file ? req.file.filename : null;

        const {
            animal_id,
            full_name,
            contact_number,
            email,
            full_address,
            civil_status,
            age,
            occupation,
            adoption_intent,
            emergency_name,
            emergency_phone,
            emergency_relation
        } = req.body;

        const [petRows] = await pool.query(
            `SELECT organization_id FROM animals WHERE animal_id = ?`,
            [animal_id]
        );

        if (!petRows.length) {
            return res.status(404).json({
                status: 'error',
                message: 'Selected pet not found.'
            });
        }

        const organizationId = petRows[0].organization_id;
        
        // 4. Save sa Database
        const query = `
            INSERT INTO user_adoption_applications (
                organization_id,
                adopter_id,
                animal_id,
                full_name,
                contact_number,
                email,
                full_address,
                civil_status,
                age,
                occupation,
                adoption_intent,
                emergency_name,
                emergency_phone,
                emergency_relation,
                document_path,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            organizationId,
            adopterId || null,
            animal_id ? parseInt(animal_id, 10) : null,
            full_name || null,
            contact_number || null,
            email || null,
            full_address || null,
            civil_status || null,
            age ? parseInt(age, 10) : null,
            occupation || null,
            adoption_intent || null,
            emergency_name || null,
            emergency_phone || null,
            emergency_relation || null,
            documentPath || null,
            'Under Review'
        ];

        await pool.query(query, values);

        return res.status(200).json({
            status: 'success',
            message: 'Application submitted successfully! Please wait for approval.'
        });

    } catch (error) {
        console.error('Error saving adoption application:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to submit application: ' + error.message
        });
    }
};

// Check if user has already applied for a specific pet
exports.checkAppliedStatus = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        const petId = req.params.petId;

        if (!accountId) {
            return res.json({ hasApplied: false });
        }

        // 1. Kunin muna ang totoong adopter_id mula sa adopters table
        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ?`,
            [accountId]
        );

        if (!adopterRows.length) {
            return res.json({ hasApplied: false });
        }

        const adopterId = adopterRows[0].adopter_id;

        // Query application with decline_reason included
        const [rows] = await pool.query(
            `SELECT application_id, status, decline_reason 
             FROM user_adoption_applications 
             WHERE adopter_id = ? AND animal_id = ? 
             ORDER BY created_at DESC LIMIT 1`,
            [adopterId, petId]
        );

        if (rows.length > 0) {
            return res.json({ 
                hasApplied: true, 
                status: rows[0].status,
                declineReason: rows[0].decline_reason || "No specific reason provided."
            });
        }

        return res.json({ hasApplied: false });
    } catch (error) {
        console.error("Error checking application status:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
// =====================================================
// GET CURRENT USER'S ADOPTION APPLICATIONS
exports.getUserApplications = async (req, res) => {
    try {
        // =====================================================
        // 1. CHECK LOGIN SESSION
        // =====================================================
        const accountId = req.session?.accountId;

        if (!accountId) {
            return res.status(401).json({ success: false, message: "You must be logged in." });
        }

        // =====================================================
        // 2. GET adopter_id USING account_id
        // =====================================================
        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ? LIMIT 1`,
            [accountId]
        );


        if (adopterRows.length === 0) {
            return res.status(404).json({ success: false, message: "Adopter profile not found." });
        }

        const adopterId = adopterRows[0].adopter_id;

        // =====================================================
        // 3. GET APPLICATIONS
        // =====================================================
        const [applications] = await pool.query(
            `
            SELECT
                app.application_id,
                app.adopter_id,
                app.animal_id,
                app.full_name,
                app.contact_number,
                app.email,
                app.full_address,
                app.civil_status,
                app.age,
                app.occupation,
                app.adoption_intent,
                app.emergency_name,
                app.emergency_phone,
                app.emergency_relation,
                app.document_path,
                app.status,
                app.decline_reason,
                app.created_at,
                app.updated_at,
                app.interview_date,
                app.interview_time,
                app.interview_method,
                app.interview_location_link,
                -- PET INFORMATION
                animal.name AS pet_name,
                animal.species AS species,
                animal.gender AS gender,
                animal.age AS pet_age,
                animal.image_path AS image_path,
                -- ORGANIZATION INFORMATION
                org.organization_id,
                org.organization_name,
                org.profile_pic
            FROM user_adoption_applications app
            INNER JOIN animals animal ON app.animal_id = animal.animal_id
            LEFT JOIN organizations org ON animal.organization_id = org.organization_id
            WHERE app.adopter_id = ?
            ORDER BY app.created_at DESC
            `,
            [adopterId]
        );

        // =====================================================
        // 5. SEND RESPONSE
        // =====================================================
        return res.status(200).json({ success: true, applications: applications });

    } catch (error) {
        console.error("Error fetching user adoption applications:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load adoption applications.",
            error: error.message
        });
    }
};
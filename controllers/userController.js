//logic para sa lahat ng User modules.
const pool = require("../config/database"); 
const bcrypt = require("bcrypt");
const validator = require('validator');
const AdoptionModel = require('../models/userModel');

exports.getProfile = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) return res.status(401).json({ error: "Unauthorized" });

    try {
        
        const [rows] = await pool.query(
            `SELECT 
                adopters.first_name, 
                adopters.last_name, 
                accounts.email, 
                accounts.role,
                adopters.phone_number, 
                adopters.birthday,
                adopters.civil_status,
                adopters.occupation,
                adopters.street_address,
                adopters.barangay,
                adopters.city,
                adopters.province,
                adopters.region,
                adopters.zip_code,
                adopters.profile_picture, 
                accounts.created_at
                FROM adopters 
             JOIN accounts ON adopters.account_id = accounts.account_id 
             WHERE adopters.account_id = ?`,
            [accountId]
        );

        if (rows.length === 0) return res.status(404).json({ error: "Profile not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    const firstName = (req.body.firstName || '').trim();
    const lastName = (req.body.lastName || '').trim();
    
    const email = (req.body.email || '')
        .trim()
        .toLowerCase();
    
    const mobile = (req.body.mobile || '')
        .trim()
        .replace(/\s+/g, '');
    
    const birthday = (req.body.birthday || '').trim();
    const civilStatus = (req.body.civilStatus || '').trim();
    const occupation = (req.body.occupation || '').trim();
    const streetAddress = (req.body.streetAddress || '').trim();
    const barangay = (req.body.barangay || '').trim();
    const city = (req.body.city || '').trim();
    const province = (req.body.province || '').trim();
    const region = (req.body.region || '').trim();
    const zipCode = (req.body.zipCode || '')
        .toString()
        .trim()
        .replace(/\D/g, '');

     if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: "First name, Last name, and Email are required." });
    }

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================
    const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!validator.isEmail(email) || !strictEmailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: "Please enter a valid email address."
        });
    }

    // ==========================================
    // MOBILE NUMBER VALIDATION
    // ==========================================
    const phoneRegex = /^(09\d{9}|\+639\d{9})$/;

    if (mobile && !phoneRegex.test(mobile)) {
        return res.status(400).json({
            success: false,
            error: "Please enter a valid Philippine mobile number."
        });
    }

    const [existingEmail] = await pool.query(
        `SELECT account_id 
         FROM accounts 
         WHERE LOWER(email) = LOWER(?) 
         AND account_id != ?
         LIMIT 1`,
        [email, accountId]
    );
    
    if (existingEmail.length > 0) {
        return res.status(409).json({
            success: false,
            error: "An account with this email already exists."
        });
    }

    const connection = await pool.getConnection();
    try {
      
        await connection.beginTransaction();

        
        await connection.query(
            `UPDATE accounts SET email = ? WHERE account_id = ?`,
            [email, accountId]
        );

        
        await connection.query(
            `UPDATE adopters SET 
                first_name = ?, 
                last_name = ?, 
                phone_number = ?, 
                birthday = ?, 
                civil_status = ?, 
                occupation = ?, 
                street_address = ?, 
                barangay = ?, 
                city = ?, 
                province = ?, 
                region = ?, 
                zip_code = ?
             WHERE account_id = ?`,
            [
                firstName,
                lastName,
                mobile || null,
                birthday || null,
                civilStatus || null,
                occupation || null,
                streetAddress || null,
                barangay || null,
                city || null,
                province || null,
                region || null,
                zipCode || null,
                accountId
            ]
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
};exports.getOrganizations = async (req, res) => {
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
                p.maya_name,
                p.maya_number,
                p.maya_qr_code,
                d.dropoff_location_name,
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

            // IDINAGDAG: Maya QR Code formatting katulad ng sa GCash
            const mayaQrCode = (org.maya_qr_code && org.maya_qr_code.trim() !== '' && org.maya_qr_code !== '/uploads/qr/')
                ? (org.maya_qr_code.startsWith('/') ? org.maya_qr_code : `/uploads/qr/${org.maya_qr_code}`)
                : '';

            let dropoffImg = (org.dropoff_image && org.dropoff_image.trim() !== '') ? org.dropoff_image.trim() : '';

            if (dropoffImg && !dropoffImg.startsWith('/') && !dropoffImg.startsWith('http')) {
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
                maya_qr_code: mayaQrCode, // Isinama na sa returned object
                dropoff_image: dropoffImg
            };
        });

        res.json(formattedOrgs);
    } catch (err) {
        console.error("Get Organizations Error:", err);
        res.status(500).json({ success: false, message: "Failed to load organizations." });
    }
};
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
        amount,
        payment_method // Sinasalo ang piniling payment method mula sa frontend (GCash o Maya)
    } = req.body;

    if (!organization_id || !donor_name || !donor_email || !reference_number || !amount) {
        return res.status(400).json({ success: false, error: "Please fill in all required fields." });
    }

    // --- VALIDATION: Remove negative amounts and enforce limits ---
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ success: false, error: "Donation amount must be greater than zero and cannot be negative." });
    }

    // --- VALIDATION: Ensure valid reference number format ---
    const cleanRefNum = reference_number.trim();
    const refRegex = /^[a-zA-Z0-9]{10,15}$/; // Standard reference numbers are alphanumeric lengths around 10-15
    if (!refRegex.test(cleanRefNum)) {
        return res.status(400).json({ success: false, error: "Please enter a valid reference number (typically 10-15 alphanumeric characters)." });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, error: "Please upload your proof of payment (Receipt)." });
    }

    try {
        // --- CHECK: Duplicate reference number to prevent reuse ---
        const [existingRef] = await pool.query(
            `SELECT cash_donation_id FROM cash_donations WHERE reference_number = ? LIMIT 1`,
            [cleanRefNum]
        );

        if (existingRef.length > 0) {
            return res.status(400).json({ success: false, error: "This reference number has already been submitted." });
        }

        // --- PAYMENT METHOD & DETAILS VALIDATION ---
        const [paymentRows] = await pool.query(
            `SELECT gcash_number, gcash_name, maya_number, maya_name FROM organization_payment_details WHERE organization_id = ?`,
            [organization_id]
        );

        // Tukuyin kung GCash o Maya ang ginamit (default sa GCash kung walang pumasok)
        const selectedMethod = payment_method ? payment_method.trim() : 'GCash';

        if (selectedMethod.toLowerCase() === 'maya') {
            if (!paymentRows.length || !paymentRows[0].maya_number) {
                return res.status(400).json({ 
                    success: false, 
                    error: "This organization has not provided Maya payment details yet. Maya donations are currently disabled for this organization." 
                });
            }
        } else {
            if (!paymentRows.length || !paymentRows[0].gcash_number) {
                return res.status(400).json({ 
                    success: false, 
                    error: "This organization has not provided GCash payment details yet. Cash donations are currently disabled for this organization." 
                });
            }
        }

        const receipt_path = `/uploads/receipts/${req.file.filename}`;

        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ?`,
            [accountId]
        );

        const adopter_id = adopterRows.length > 0 ? adopterRows[0].adopter_id : null;

        // --- INSERT SA DATABASE (Kasama ang payment_method kung mayroon ka ring kolum nito) ---
        const [result] = await pool.query(
            `INSERT INTO cash_donations 
            (adopter_id, organization_id, donor_name, donor_email, gcash_account_name, reference_number, amount, receipt_path, payment_method, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())`,
            [
                adopter_id,
                organization_id,
                donor_name,
                donor_email,
                gcash_account_name || donor_name,
                cleanRefNum,
                parsedAmount,
                receipt_path,
                selectedMethod
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

    const cleanItemName = item_name.trim();
    const cleanQuantity = quantity.trim();

    // Strict Server-Side Validation
    const gibberishPattern = /(.)\1{3,}/;
    const validItemPattern = /^[a-zA-Z0-9\sñÑ-]{3,}$/;
    const hasVowel = /[aeiouAEIOU]/.test(cleanItemName);
    const strictQuantityPattern = /^\d+(\s*[a-zA-Z]+)?$/;

    if (cleanItemName.length < 3 || /^[0-9]+$/.test(cleanItemName) || !hasVowel || gibberishPattern.test(cleanItemName) || !validItemPattern.test(cleanItemName)) {
        return res.status(400).json({ success: false, error: "Invalid item name format. Please enter a real item description." });
    }

    if (!strictQuantityPattern.test(cleanQuantity)) {
        return res.status(400).json({ success: false, error: "Invalid quantity format. Please include proper numbers and units (e.g., 5, 5kg, 3 packs)." });
    }

    try {
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
                cleanItemName,
                cleanQuantity
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

        // 4. BUOIN ANG IMMUTABLE JSON SNAPSHOT
        //For future reference, this snapshot can be used for auditing or historical purposes.
        const applicantSnapshot = {
            full_name: full_name || null,
            contact_number: contact_number || null,
            email: email || null,
            full_address: full_address || null,
            civil_status: civil_status || null,
            age: age ? parseInt(age, 10) : null,
            occupation: occupation || null,
            submitted_at: new Date().toISOString()
        };

        const snapshotJSON = JSON.stringify(applicantSnapshot);

        // 2. CHECK KUNG MAY EXISTING APPLICATION NA PARA SA PET NA ITO
        const [existingApp] = await pool.query(
            `SELECT application_id, status FROM user_adoption_applications 
             WHERE adopter_id = ? AND animal_id = ? 
             ORDER BY created_at DESC LIMIT 1`,
            [adopterId, animal_id]
        );

        // Gawing lowercase para iwas case-sensitivity issues (hal. 'declined' vs 'Declined')
        const currentStatus = existingApp.length > 0 ? (existingApp[0].status || '').trim().toLowerCase() : '';
        
        // KUNG MAY LALABAS AT STATUS AY DECLINED/REJECTED/CANCELLED -> UPDATE (RE-APPLY LOGIC)
        if (existingApp.length > 0 && ['declined', 'rejected', 'cancelled'].includes(currentStatus)) {
            
            // Kunin ang lumang document_path ng application kung walang bagong file na na-upload
            const [oldAppRows] = await pool.query(
                `SELECT document_path FROM user_adoption_applications WHERE application_id = ?`,
                [existingApp[0].application_id]
            );
            const oldDocumentPath = oldAppRows.length > 0 ? oldAppRows[0].document_path : null;
            const finalDocumentPath = documentPath || oldDocumentPath;

            const updateQuery = `
                UPDATE user_adoption_applications SET
                    organization_id = ?,
                    applicant_snapshot = ?,
                    adoption_intent = ?,
                    emergency_name = ?,
                    emergency_phone = ?,
                    emergency_relation = ?,
                    document_path = ?,
                    status = 'Under Review',
                    decline_reason = NULL,
                    created_at = NOW(),
                    updated_at = NOW()
                WHERE application_id = ?
            `;

            const updateValues = [
                organizationId,
                snapshotJSON,
                adoption_intent || null,
                emergency_name || null,
                emergency_phone || null,
                emergency_relation || null,
                finalDocumentPath,
                existingApp[0].application_id
            ];

            await pool.query(updateQuery, updateValues);

            // Clear stale interview data from the applicant's previous (declined) cycle -
            // application_interviews is a separate table joined on application_id, and
            // since re-apply reuses the same application_id, the old row would otherwise
            // stick around and show up as if it belonged to this new cycle.
            await pool.query(
                `DELETE FROM application_interviews WHERE application_id = ?`,
                [existingApp[0].application_id]
            );

            return res.status(200).json({
                status: 'success',
                message: 'Re-application submitted successfully! Your application status is now Under Review.'
            });
        }

        const insertQuery = `
            INSERT INTO user_adoption_applications (
                organization_id,
                adopter_id,
                animal_id,
                applicant_snapshot,
                adoption_intent,
                emergency_name,
                emergency_phone,
                emergency_relation,
                document_path,
                status,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const values = [
            organizationId,
            adopterId || null,
            animal_id ? parseInt(animal_id, 10) : null,
            snapshotJSON,
            adoption_intent || null,
            emergency_name || null,
            emergency_phone || null,
            emergency_relation || null,
            documentPath || null,
            'Under Review'
        ];

        await pool.query(insertQuery, values);

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
                app.applicant_snapshot,
                app.adoption_intent,
                app.emergency_name,
                app.emergency_phone,
                app.emergency_relation,
                app.document_path,
                app.status,
                app.decline_reason,
                COALESCE(app.updated_at, app.created_at) AS created_at,
                app.updated_at,
                i.interview_date,
                i.interview_time,
                i.interview_method,
                i.interview_location_link,
                i.meetup_location,
                -- RESCHEDULE INTERVIEW
                i.requested_interview_date,
                i.requested_interview_time,
                i.reschedule_reason,
                i.resched_status,
                -- PET INFORMATION
                animal.name AS pet_name,
                animal.species AS species,
                animal.gender AS gender,
                animal.age AS pet_age,
                animal.image_path AS image_path,
                animal.adoption_status AS pet_adoption_status,
                -- ORGANIZATION INFORMATION
                org.organization_id,
                org.organization_name,
                org.profile_pic
            FROM user_adoption_applications app
            INNER JOIN animals animal ON app.animal_id = animal.animal_id
            LEFT JOIN organizations org ON animal.organization_id = org.organization_id
            LEFT JOIN application_interviews i ON app.application_id = i.application_id
            WHERE app.adopter_id = ?
            ORDER BY COALESCE(app.updated_at, app.created_at) DESC
            `,
            [adopterId]
        );

        // MAP FUNCTION: I-parse ang JSON snapshot para madaling basahin sa Frontend
        const formattedApplications = applications.map(app => {
            let parsedSnapshot = {};
            try {
                parsedSnapshot = typeof app.applicant_snapshot === 'string' 
                    ? JSON.parse(app.applicant_snapshot) 
                    : (app.applicant_snapshot || {});
            } catch (e) {
                console.error("JSON parse error:", e);
            }

            return {
                ...app,
                full_name: parsedSnapshot.full_name || 'N/A',
                contact_number: parsedSnapshot.contact_number || 'N/A',
                email: parsedSnapshot.email || 'N/A',
                full_address: parsedSnapshot.full_address || 'N/A',
                civil_status: parsedSnapshot.civil_status || 'N/A',
                age: parsedSnapshot.age || 'N/A',
                petAdoptionStatus: app.pet_adoption_status || "Available",
                occupation: parsedSnapshot.occupation || 'N/A'
            };
        });

        // =====================================================
        // 5. SEND RESPONSE
        // =====================================================
        return res.status(200).json({ success: true, applications: formattedApplications });

    } catch (error) {
        console.error("Error fetching user adoption applications:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load adoption applications.",
            error: error.message
        });
    }
};

// =====================================================
// CANCEL ADOPTION APPLICATION (USER SIDE)
// =====================================================
exports.cancelAdoptionApplication = async (req, res) => {
    try {
        const accountId = req.session?.accountId;
        const applicationId = req.params.id;

        if (!accountId) {
            return res.status(401).json({ success: false, message: "Unauthorized access." });
        }

        // 1. Kuhanin muna ang adopter_id ng naka-login na user
        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ? LIMIT 1`,
            [accountId]
        );

        if (!adopterRows.length) {
            return res.status(404).json({ success: false, message: "Adopter profile not found." });
        }

        const adopterId = adopterRows[0].adopter_id;

        // 2. I-update lamang kapag ang application ay naka-'Under Review' pa at pagmamay-ari ng user
        const [result] = await pool.query(
            `UPDATE user_adoption_applications 
             SET status = 'Cancelled', updated_at = NOW() 
             WHERE application_id = ? AND adopter_id = ? AND status = 'Under Review'`,
            [applicationId, adopterId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Unable to cancel application. It may already be processed or not found." 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application cancelled successfully."
        });

    } catch (error) {
        console.error("Error cancelling application:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel application: " + error.message
        });
    }
};
// ==========================================
// KAMUSTAHAN MODULE (USER SIDE)
// ==========================================

exports.getApprovedAdoptedPets = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ success: false, error: "Unauthorized access." });
    }

    try {
        // I-log natin ang accountId para ma-check sa console
        console.log("Fetching pets for accountId:", accountId);

        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ? LIMIT 1`,
            [accountId]
        );

        if (!adopterRows.length) {
            console.log("No adopter record found for this account.");
            return res.status(404).json({ success: false, error: "Adopter profile not found." });
        }

        const adopterId = adopterRows[0].adopter_id;
        console.log("Found adopter_id:", adopterId);

        // BAGONG QUERY: Ginawang UPPER(status) para iwas case-sensitivity
        const [pets] = await pool.query(`
            SELECT DISTINCT
                a.animal_id,
                a.name,
                a.species,
                a.image_path,
                a.organization_id
            FROM user_adoption_applications app
            JOIN animals a ON app.animal_id = a.animal_id
            WHERE app.adopter_id = ? 
            AND UPPER(app.status) = 'APPROVED'
        `, [adopterId]);

        console.log("Pets found:", pets); // I-check sa console kung may laman ang pets array

        return res.json({
            success: true,
            pets: pets
        });

    } catch (error) {
        console.error("Get Approved Adopted Pets Error:", error);
        return res.status(500).json({ success: false, error: "Server error." });
    }
};
exports.submitKamustahanUpdate = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ success: false, error: "Unauthorized access." });
    }

    try {
        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ? LIMIT 1`,
            [accountId]
        );

        if (!adopterRows.length) {
            return res.status(404).json({ success: false, error: "Adopter profile not found." });
        }

        const adopterId = adopterRows[0].adopter_id;
        const { animal_id, organization_id, update_text } = req.body;
        const photoPath = req.file ? `/uploads/kamustahan/${req.file.filename}` : '';

        if (!animal_id || !organization_id || !update_text) {
            return res.status(400).json({ success: false, error: "Please fill in all required fields." });
        }

        // 1. Check if there is an active scheduled update ('For Update') for this pet
        const [scheduleRows] = await pool.query(`
            SELECT update_id, status, scheduled_date as target_schedule 
            FROM kamustahan_updates 
            WHERE adopter_id = ? AND animal_id = ? AND status = 'For Update'
            ORDER BY created_at DESC LIMIT 1
        `, [adopterId, animal_id]);

        if (!scheduleRows.length) {
            return res.status(400).json({ 
                success: false, 
                error: "No scheduled update found for this pet, or the update for the current schedule has already been submitted." 
            });
        }

        const currentSchedule = scheduleRows[0];
        const updateId = currentSchedule.update_id;

        // 2. Check if a scheduled_date actually exists and is valid in the database
        if (!currentSchedule.target_schedule) {
            return res.status(400).json({ 
                success: false, 
                error: "No schedule date has been set in the database for this pet yet. Please wait for the organization to set a schedule." 
            });
        }

        // 3. Format Philippine Time and the database target schedule accurately
        const phTimeOptions = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
        const formatter = new Intl.DateTimeFormat('en-CA', phTimeOptions);
        
        const phToday = formatter.format(new Date());
        const targetDateStr = formatter.format(new Date(currentSchedule.target_schedule));

        // Prevent 1970-01-01 or invalid empty database date traps
        if (targetDateStr === '1970-01-01' || !targetDateStr) {
            return res.status(400).json({ 
                success: false, 
                error: "The schedule date for this pet is not yet properly configured in the system." 
            });
        }

        if (targetDateStr !== phToday) {
            return res.status(400).json({ 
                success: false, 
                error: `It is not yet time or the correct date to update this pet. The scheduled date is on ${targetDateStr}.` 
            });
        }

        // 4. Update the record and set the upload timestamp
        await pool.query(`
            UPDATE kamustahan_updates 
            SET update_date = CURDATE(), 
                update_text = ?, 
                photos = ?, 
                status = 'Pending',
                created_at = NOW()
            WHERE update_id = ?
        `, [update_text, photoPath, updateId]);

        return res.json({
            success: true,
            message: "Kamustahan update successfully submitted!"
        });

    } catch (error) {
        console.error("Submit Kamustahan Error:", error);
        return res.status(500).json({ success: false, error: "Database error during submission." });
    }
};

exports.getKamustahanHistory = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ success: false, error: "Unauthorized access." });
    }

    try {
        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ? LIMIT 1`,
            [accountId]
        );

        if (!adopterRows.length) {
            return res.status(404).json({ success: false, error: "Adopter profile not found." });
        }

        const adopterId = adopterRows[0].adopter_id;

        const [updates] = await pool.query(`
            SELECT 
                k.update_id,
                k.update_date,
                k.update_text,
                k.photos,
                k.status,
                k.created_at,
                a.name AS pet_name
            FROM kamustahan_updates k
            JOIN animals a ON k.animal_id = a.animal_id
            WHERE k.adopter_id = ?
            ORDER BY k.created_at DESC
        `, [adopterId]);

        return res.json({
            success: true,
            updates: updates
        });

    } catch (error) {
        console.error("Get Kamustahan History Error:", error);
        return res.status(500).json({ success: false, error: "Failed to load kamustahan history." });
    }
};
// I-update din ang getKamustahanHistory para makuha ang created_at timestamp
exports.getKamustahanHistory = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ success: false, error: "Unauthorized access." });
    }

    try {
        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ? LIMIT 1`,
            [accountId]
        );

        if (!adopterRows.length) {
            return res.status(404).json({ success: false, error: "Adopter profile not found." });
        }

        const adopterId = adopterRows[0].adopter_id;

        const [updates] = await pool.query(`
            SELECT 
                k.update_id,
                k.update_date,
                k.update_text,
                k.photos,
                k.status,
                k.created_at,
                a.name AS pet_name
            FROM kamustahan_updates k
            JOIN animals a ON k.animal_id = a.animal_id
            WHERE k.adopter_id = ?
            ORDER BY k.created_at DESC
        `, [adopterId]);

        return res.json({
            success: true,
            updates: updates
        });

    } catch (error) {
        console.error("Get History Error:", error);
        return res.status(500).json({ success: false, error: "Failed to load history." });
    }
};

//functions for recent activities in user dashboard
exports.getUserRecentActivities = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ success: false, error: "Unauthorized access." });
    }

    try {
        // 1. Get adopter_id & email
        const [adopterRows] = await pool.query(
            `SELECT adopter_id, email FROM adopters 
             JOIN accounts ON adopters.account_id = accounts.account_id 
             WHERE adopters.account_id = ? LIMIT 1`,
            [accountId]
        );

        if (!adopterRows.length) {
            return res.status(404).json({ success: false, error: "Adopter profile not found." });
        }

        const { adopter_id, email } = adopterRows[0];

        // 2. Fetch Adoption Applications & Status Changes
        const [apps] = await pool.query(`
            SELECT 
                app.application_id AS id,
                'application' AS activity_type,
                app.status,
                a.name AS pet_name,
                a.species,
                i.interview_date,
                i.interview_time,
                COALESCE(app.updated_at, app.created_at) AS activity_date
            FROM user_adoption_applications app
            JOIN animals a ON app.animal_id = a.animal_id
            LEFT JOIN application_interviews i ON app.application_id = i.application_id
            WHERE app.adopter_id = ?
        `, [adopter_id]);

        // 3. Fetch Cash Donations
        const [cash] = await pool.query(`
            SELECT 
                c.cash_donation_id AS id,
                'donation_cash' AS activity_type,
                c.amount,
                o.organization_name,
                c.status,
                c.created_at AS activity_date
            FROM cash_donations c
            LEFT JOIN organizations o ON c.organization_id = o.organization_id
            WHERE c.adopter_id = ? OR c.donor_email = ?
        `, [adopter_id, email]);

        // 4. Fetch In-Kind Donations
        const [inkind] = await pool.query(`
            SELECT 
                i.inkind_donation_id AS id,
                'donation_inkind' AS activity_type,
                i.item_name,
                i.quantity,
                o.organization_name,
                i.status,
                i.created_at AS activity_date
            FROM inkind_donations i
            LEFT JOIN organizations o ON i.organization_id = o.organization_id
            WHERE i.adopter_id = ? OR i.donor_email = ?
        `, [adopter_id, email]);

        // 5. Fetch Kamustahan Updates
        const [kamustahan] = await pool.query(`
            SELECT 
                k.update_id AS id,
                'kamustahan' AS activity_type,
                k.status,
                a.name AS pet_name,
                k.created_at AS activity_date
            FROM kamustahan_updates k
            JOIN animals a ON k.animal_id = a.animal_id
            WHERE k.adopter_id = ?
        `, [adopter_id]);

        // Combine and sort newest first
        const allActivities = [...apps, ...cash, ...inkind, ...kamustahan]
            .filter(item => item.activity_date)
            .sort((a, b) => new Date(b.activity_date) - new Date(a.activity_date))
            .slice(0, 5); // Show top 10 most recent

        return res.json({ success: true, activities: allActivities });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return res.status(500).json({ success: false, error: "Database error fetching activities." });
    }
};

// ==========================================
// GET UPCOMING SCHEDULES / INTERVIEWS
// ==========================================
exports.getUserUpcomingSchedules = async (req, res) => {
    const accountId = req.session?.accountId;
    if (!accountId) {
        return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    try {
        const [adopterRows] = await pool.query(
            `SELECT adopter_id FROM adopters WHERE account_id = ? LIMIT 1`,
            [accountId]
        );

        if (!adopterRows.length) {
            return res.status(404).json({ success: false, message: "Adopter profile not found." });
        }

        const adopterId = adopterRows[0].adopter_id;

        const [schedules] = await pool.query(`
            SELECT 
                app.application_id,
                app.status AS application_status,
                i.interview_date,
                i.interview_time,
                i.interview_method,
                i.interview_location_link,
                i.resched_status,
                a.name AS pet_name,
                a.species,
                o.organization_name
            FROM user_adoption_applications app
            INNER JOIN application_interviews i ON app.application_id = i.application_id
            INNER JOIN animals a ON app.animal_id = a.animal_id
            LEFT JOIN organizations o ON app.organization_id = o.organization_id
            WHERE app.adopter_id = ? 
              AND app.status = 'Interview Scheduled'
              AND i.interview_date IS NOT NULL
              AND STR_TO_DATE(CONCAT(DATE_FORMAT(i.interview_date, '%Y-%m-%d'), ' ', COALESCE(i.interview_time, '23:59:59')), '%Y-%m-%d %H:%i:%s') >= NOW()
            ORDER BY i.interview_date ASC, i.interview_time ASC
        `, [adopterId]);

        return res.status(200).json({
            success: true,
            schedules
        });
    } catch (error) {
        console.error("Error fetching upcoming schedules:", error);
        return res.status(500).json({ success: false, message: "Server error fetching schedules." });
    }
}
exports.logout = (req, res) => {

    console.log("========== LOGOUT REQUEST ==========");

    if (!req.session) {

        console.log("No active session found.");

        res.clearCookie("connect.sid", {
            path: "/"
        });

        return res.json({
            success: true,
            message: "Already logged out."
        });
    }


    req.session.destroy((err) => {

        if (err) {

            console.error("LOGOUT SESSION DESTROY ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to logout."
            });

        }


        console.log("Session destroyed successfully.");


        res.clearCookie("connect.sid", {
            path: "/"
        });


        console.log("Session cookie cleared.");
        console.log("====================================");


        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });

    });
};
exports.getOrganizationById = async (req, res) => {
    try {
        const orgId = req.params.id;
        
        // I-JOIN ang organizations at accounts table para makuha ang email
        const [rows] = await pool.query(
            `SELECT 
                o.*, 
                accounts.email 
             FROM organizations o
             JOIN accounts ON o.account_id = accounts.account_id
             WHERE o.organization_id = ?`, 
            [orgId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Organization not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching organization profile:", err);
        res.status(500).json({ error: "Server error" });
    }
};
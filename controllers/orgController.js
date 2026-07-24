const pool = require("../config/database");

// ==========================================
// PET MANAGEMENT CONTROLLERS
// ==========================================

exports.addPet = async (req, res) => {
    try {
        const {
            name,
            species,
            gender,
            age,
            birth_date,
            color,
            behavior_description,
            health_status,
            vaccination_status,
            adoption_status,
            personality_tags,
            medical_history
        } = req.body;

        console.log("Received tags:", personality_tags);

        // Get organization using logged account
        const [org] = await pool.query(
            `
            SELECT organization_id
            FROM organizations
            WHERE account_id = ?
            `,
            [req.session.accountId]
        );
        console.log("Organization Query Result:", org);

        if (!org.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        const organization_id = org[0].organization_id;

        let image_path = null;
        if (req.file) {
            image_path = req.file.filename;
        }

        console.log("===== ADD PET REQUEST =====");
        console.log("Session:", req.session);
        console.log("Body:", req.body);
        console.log("File:", req.file);
        console.log("Organization ID:", organization_id);

        console.log("INSERTING PET...");

        const [result] = await pool.query(
            `
            INSERT INTO animals
            (
                organization_id,
                name,
                species,
                gender,
                age,
                birth_date,
                color,
                behavior_description,
                health_status,
                vaccination_status,
                adoption_status,
                image_path,
                personality_tags
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
                organization_id,
                name,
                species,
                gender,
                age,
                birth_date || null,
                color || null,
                behavior_description || null,
                health_status,
                vaccination_status,
                adoption_status,
                image_path,
                personality_tags || null
            ]
        );

        console.log("Insert Result:", result);

        // Get the newly inserted pet ID
        const animal_id = result.insertId;

        // Parse medical history from frontend
        const medicalHistory = medical_history
            ? JSON.parse(medical_history)
            : [];

        // Save each medical record
        for (const medical of medicalHistory) {
            await pool.query(
                `
                INSERT INTO animal_medical_history
                (
                    animal_id,
                    treatment,
                    administered_date,
                    administered_by
                )
                VALUES (?,?,?,?)
                `,
                [
                    animal_id,
                    medical.treatment,
                    medical.administered_date,
                    medical.administered_by
                ]
            );
        }

        res.json({
            success: true,
            message: "Pet added successfully"
        });

    } catch (error) {
        console.error("========== PET INSERT ERROR ==========");
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPets = async (req, res) => {
    try {
        const [org] = await pool.query(
            `
            SELECT organization_id
            FROM organizations
            WHERE account_id = ?
            `,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.json({
                success: false,
                message: "Organization not found"
            });
        }

        const organization_id = org[0].organization_id;

        const [pets] = await pool.query(
            `
            SELECT *
            FROM animals
            WHERE organization_id = ?
            ORDER BY animal_id DESC
            `,
            [organization_id]
        );

        res.json({
            success: true,
            pets
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Unable to load pets."
        });
    }
};

exports.getPetDetails = async (req, res) => {
    try {
        // Get pet information
        const [rows] = await pool.query(
            `
            SELECT *
            FROM animals
            WHERE animal_id = ?
            `,
            [req.params.id]
        );

        if (!rows.length) {
            return res.json({
                success: false,
                message: "Pet not found."
            });
        }

        // Get medical history
        const [medical] = await pool.query(
            `
            SELECT *
            FROM animal_medical_history
            WHERE animal_id = ?
            ORDER BY administered_date DESC
            `,
            [req.params.id]
        );

        // Attach medical history to the pet object
        rows[0].medical_history = medical;

        res.json({
            success: true,
            pet: rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

exports.updatePet = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            name,
            species,
            gender,
            age,
            birth_date,
            color,
            behavior_description,
            health_status,
            vaccination_status,
            adoption_status,
            personality_tags,
            medical_history
        } = req.body;

        let imageSQL = "";
        let values = [
            name,
            species,
            gender,
            age,
            birth_date || null,
            color || null,
            behavior_description || null,
            health_status,
            vaccination_status,
            adoption_status,
            personality_tags || null
        ];

        if (req.file) {
            imageSQL = ", image_path=?";
            values.push(req.file.filename);
        }

        values.push(id);

        await pool.query(
            `
            UPDATE animals
            SET
                name=?,
                species=?,
                gender=?,
                age=?,
                birth_date=?,
                color=?,
                behavior_description=?,
                health_status=?,
                vaccination_status=?,
                adoption_status=?,
                personality_tags=?
                ${imageSQL}
            WHERE animal_id=?
            `,
            values
        );

        await pool.query(
            `
            DELETE FROM animal_medical_history
            WHERE animal_id=?
            `,
            [id]
        );

        const medical = medical_history
            ? JSON.parse(medical_history)
            : [];

        for (const m of medical) {
            await pool.query(
                `
                INSERT INTO animal_medical_history
                (
                    animal_id,
                    treatment,
                    administered_date,
                    administered_by
                )
                VALUES (?,?,?,?)
                `,
                [
                    id,
                    m.treatment,
                    m.administered_date,
                    m.administered_by
                ]
            );
        }

        res.json({
            success: true,
            message: "Pet updated successfully."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.deletePet = async (req, res) => {
    try {
        const id = req.params.id;

        // Delete medical history first
        await pool.query(
            `
            DELETE FROM animal_medical_history
            WHERE animal_id = ?
            `,
            [id]
        );

        // Delete pet
        const [result] = await pool.query(
            `
            DELETE FROM animals
            WHERE animal_id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: "Pet not found."
            });
        }

        res.json({
            success: true,
            message: "Pet deleted successfully."
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
// ==========================================
// PAYMENT & QR DETAILS CONTROLLERS
// ==========================================

exports.getPaymentInfo = async (req, res) => {
    try {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        // Isinama ang d.* (Drop-off details) sa LEFT JOIN
        const [rows] = await pool.query(
            `
            SELECT 
                o.organization_id,
                o.organization_name,
                o.contact_number,
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
            WHERE o.account_id = ?
            `,
            [req.session.accountId]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Organization details not found."
            });
        }

        const orgData = rows[0];

        // Format Image URLs
        if (orgData.qr_code && !orgData.qr_code.startsWith('/') && !orgData.qr_code.startsWith('http')) {
            orgData.qr_code = `/uploads/qr/${orgData.qr_code}`;
        }
        if (orgData.dropoff_image && !orgData.dropoff_image.startsWith('/') && !orgData.dropoff_image.startsWith('http')) {
            orgData.dropoff_image = `/uploads/qr/${orgData.dropoff_image}`;
        }

        res.json({
            success: true,
            data: orgData
        });

    } catch (err) {
        console.error("Get Payment Info Error:", err);
        res.status(500).json({
            success: false,
            message: "Unable to load payment details."
        });
    }
};
exports.updatePaymentInfo = async (req, res) => {
    try {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        const { 
            gcash_name, 
            gcash_number, 
            contact_number, 
            dropoff_address, 
            dropoff_hours, 
            dropoff_notes 
        } = req.body;

        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organization_id = org[0].organization_id;

        // 1. Update contact number sa main organization table
        await pool.query(
            `UPDATE organizations SET contact_number = ? WHERE organization_id = ?`,
            [contact_number || null, organization_id]
        );

        // 2. Kunin ang files mula sa req.files
        let qrCodeFile = null;
        let dropoffImgFile = null;

        if (req.files) {
            if (req.files['qr_code'] && req.files['qr_code'][0]) {
                qrCodeFile = req.files['qr_code'][0].filename;
            }
            if (req.files['location_image'] && req.files['location_image'][0]) {
                dropoffImgFile = req.files['location_image'][0].filename;
            }
        }

        // 3. Upsert GCash / Payment Details
        await pool.query(
            `
            INSERT INTO organization_payment_details 
            (organization_id, gcash_name, gcash_number, qr_code)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                gcash_name = VALUES(gcash_name),
                gcash_number = VALUES(gcash_number),
                qr_code = COALESCE(VALUES(qr_code), qr_code)
            `,
            [
                organization_id, 
                gcash_name || null, 
                gcash_number || null, 
                qrCodeFile
            ]
        );

        // 4. Upsert Drop-off Details (Gagamitin ang totoong schema: dropoff_address, dropoff_hours, dropoff_notes, dropoff_image)
        await pool.query(
            `
            INSERT INTO organization_dropoff_details 
            (organization_id, dropoff_address, dropoff_hours, dropoff_notes, dropoff_image)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                dropoff_address = VALUES(dropoff_address),
                dropoff_hours = VALUES(dropoff_hours),
                dropoff_notes = VALUES(dropoff_notes),
                dropoff_image = COALESCE(VALUES(dropoff_image), dropoff_image)
            `,
            [
                organization_id,
                dropoff_address || null,
                dropoff_hours || null,
                dropoff_notes || null,
                dropoffImgFile
            ]
        );

        res.json({
            success: true,
            message: "Donation settings and In-Kind drop-off details saved successfully!"
        });

    } catch (err) {
        console.error("Update Payment Info Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update details: " + err.message
        });
    }
};
// ==========================================
// DONATION CONTROLLERS
// ==========================================

exports.getDonations = async (req, res) => {
    try {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        // 1. Get organization_id using session account ID
        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organization_id = org[0].organization_id;

        // 2. Fetch all cash donations for this organization
        const [donations] = await pool.query(
            `
            SELECT 
                cash_donation_id,
                donor_name,
                donor_email,
                gcash_account_name,
                reference_number,
                amount,
                receipt_path,
                status,
                created_at
            FROM cash_donations
            WHERE organization_id = ?
            ORDER BY created_at DESC
            `,
            [organization_id]
        );

        // 3. Calculate Total Approved Amount Metric
        const [totalMetric] = await pool.query(
            `
            SELECT COALESCE(SUM(amount), 0) AS total_amount 
            FROM cash_donations 
            WHERE organization_id = ? AND status = 'Approved'
            `,
            [organization_id]
        );

        res.json({
            success: true,
            totalDonations: totalMetric[0].total_amount,
            donations
        });

    } catch (err) {
        console.error("Get Donations Error:", err);
        res.status(500).json({
            success: false,
            message: "Unable to load donations list."
        });
    }
};

// ==========================================
// UPDATE DONATION STATUS & REASON
// ==========================================

exports.updateDonationStatus = async (req, res) => {
    try {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. Please log in again."
            });
        }

        const donationId = req.params.id;
        const { status, reason } = req.body;

        // 1. Fetch organization ID using the logged-in session account_id
        const [orgs] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!orgs || orgs.length === 0) {
            console.error(`No organization linked to account_id: ${req.session.accountId}`);
            return res.status(404).json({
                success: false,
                message: "Organization not found for this account."
            });
        }

        const organizationId = orgs[0].organization_id;

        // 2. Perform the update on cash_donations
        const [result] = await pool.query(
            `
            UPDATE cash_donations
            SET status = ?, rejection_reason = ?
            WHERE cash_donation_id = ? AND organization_id = ?
            `,
            [status, reason || null, donationId, organizationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Donation record not found or does not belong to your organization."
            });
        }

        return res.json({
            success: true,
            message: `Donation status updated to '${status}' successfully.`
        });

    } catch (err) {
        console.error("Update Donation Status Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update donation status: " + err.message
        });
    }
};

// ==========================================
// IN-KIND DONATION CONTROLLERS
// ==========================================

exports.addInKindDonation = async (req, res) => {
    try {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. Please log in."
            });
        }

        const { donor_name, donor_email, item_type, item_description, quantity, estimated_value } = req.body;

        // 1. Kunin ang organization_id gamit ang logged-in account
        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organization_id = org[0].organization_id;

        // 2. Kunin ang proof of donation / receipt image kung may file upload
        let proof_path = req.file ? req.file.filename : null;

        // 3. I-save sa database
        const [result] = await pool.query(
            `
            INSERT INTO inkind_donations 
            (
                organization_id, 
                donor_name, 
                donor_email, 
                item_type, 
                item_description, 
                quantity, 
                estimated_value, 
                proof_path, 
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
            `,
            [
                organization_id,
                donor_name,
                donor_email || null,
                item_type,
                item_description || null,
                quantity || 1,
                estimated_value || null,
                proof_path
            ]
        );

        res.json({
            success: true,
            message: "In-kind donation saved successfully!",
            donationId: result.insertId
        });

    } catch (err) {
        console.error("Add In-Kind Donation Error:", err);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred while saving: " + err.message
        });
    }
};
exports.getInKindDonations = async (req, res) => {
    try {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organization_id = org[0].organization_id;

        // 1. Fetch lahat ng in-kind donations para lumabas pa rin sa management table
        const [donations] = await pool.query(
            `
            SELECT * FROM inkind_donations
            WHERE organization_id = ?
            ORDER BY created_at DESC
            `,
            [organization_id]
        );

        // 2. APPROVED lang ang bibilangin (Hindi na kasama ang Pending at Rejected)
        const [countMetric] = await pool.query(
            `
            SELECT COUNT(*) AS total_inkind 
            FROM inkind_donations 
            WHERE organization_id = ? AND status = 'Approved'
            `,
            [organization_id]
        );

        res.json({
            success: true,
            totalInKind: countMetric[0].total_inkind,
            donations
        });

    } catch (err) {
        console.error("Get In-Kind Donations Error:", err);
        res.status(500).json({
            success: false,
            message: "Unable to load in-kind donations."
        });
    }
};

// ==========================================
// UPDATE IN-KIND DONATION STATUS
// ==========================================
exports.updateInKindDonationStatus = async (req, res) => {
    try {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        const donationId = req.params.id;
        const { status, reason } = req.body;

        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organization_id = org[0].organization_id;

        const [result] = await pool.query(
            `
            UPDATE inkind_donations
            SET status = ?, rejection_reason = ?
            WHERE inkind_donation_id = ? AND organization_id = ?
            `,
            [status, reason || null, donationId, organization_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "In-kind donation record not found."
            });
        }

        res.json({
            success: true,
            message: `In-kind donation status updated to '${status}' successfully.`
        });

    } catch (err) {
        console.error("Update In-Kind Donation Status Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update in-kind donation status: " + err.message
        });
    }
};

// ==========================================
// DROPOFF DETAILS CONTROLLERS
// ==========================================

exports.getDropoffInfo = async (req, res) => {
    try {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organization_id = org[0].organization_id;

        const [rows] = await pool.query(
            `SELECT * FROM organization_dropoff_details WHERE organization_id = ?`,
            [organization_id]
        );

        const dropoffData = rows[0] || {};

        // Format Dropoff Image URL kung mayroon
        if (dropoffData.dropoff_image && !dropoffData.dropoff_image.startsWith('/') && !dropoffData.dropoff_image.startsWith('http')) {
            dropoffData.dropoff_image = `/uploads/dropoff/${dropoffData.dropoff_image}`;
        }

        res.json({
            success: true,
            data: dropoffData
        });

    } catch (error) {
        console.error("Get Dropoff Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dropoff details." });
    }
};

exports.updateDropoffInfo = async (req, res) => {
    try {
        if (!req.session || !req.session.accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        const { dropoff_address, dropoff_hours, dropoff_notes } = req.body;

        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organization_id = org[0].organization_id;
        const dropoff_image = req.file ? req.file.filename : null;

        // Upsert sa organization_dropoff_details table
        await pool.query(
            `
            INSERT INTO organization_dropoff_details 
            (organization_id, dropoff_address, dropoff_hours, dropoff_notes, dropoff_image)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                dropoff_address = VALUES(dropoff_address),
                dropoff_hours = VALUES(dropoff_hours),
                dropoff_notes = VALUES(dropoff_notes),
                dropoff_image = COALESCE(VALUES(dropoff_image), dropoff_image)
            `,
            [
                organization_id,
                dropoff_address || null,
                dropoff_hours || null,
                dropoff_notes || null,
                dropoff_image
            ]
        );

        res.json({
            success: true,
            message: "Drop-off details updated successfully!"
        });

    } catch (error) {
        console.error("Update Dropoff Error:", error);
        res.status(500).json({ success: false, message: "Failed to update dropoff details." });
    }
};
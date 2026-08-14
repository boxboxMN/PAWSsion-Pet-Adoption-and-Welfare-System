const pool = require("../config/database");
const { generateEmbedding } = require("../services/embeddingService");

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
            color,
            pet_description,
            health_status,
            vaccination_status,
            adoption_status,
            personality_tags,
            medical_history
        } = req.body;

        console.log("Received tags:", personality_tags);

        if (!name || !species || !gender || !age) {
            return res.status(400).json({
                success: false,
                message: "Please fill out all required fields (Pet Name, Species, Gender, Age Group)."
            });
        }

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
                color,
                pet_description,
                health_status,
                vaccination_status,
                adoption_status,
                image_path,
                personality_tags
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
                organization_id,
                name,
                species,
                gender,
                age,
                color || null,
                pet_description || null,
                health_status || 'Healthy',
                vaccination_status || 'Unknown',
                adoption_status || 'Available',
                image_path,
                personality_tags || null
            ]
        );

        console.log("Insert Result:", result);

            // Get the newly inserted pet ID
            const animal_id = result.insertId;

            // KUNG 'ADOPTED' ANG PINILI, ISAVE DIN ANG ADOPTER DETAILS SA USER_ADOPTION_APPLICATIONS TABLE
            if (adoption_status === 'Adopted' && req.body.adopter_full_name) {

                const phPhoneRegex = /^09\d{9}$/;
                const contactNum = req.body.adopter_contact_number ? req.body.adopter_contact_number.trim() : '';
                const emergencyNum = req.body.adopter_emergency_phone ? req.body.adopter_emergency_phone.trim() : '';

                if (!phPhoneRegex.test(contactNum)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Contact Number. It must be an 11-digit Philippine mobile number starting with 09."
                    });
                }

                if (!phPhoneRegex.test(emergencyNum)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Emergency Phone Number. It must be an 11-digit Philippine mobile number starting with 09."
                    });
                }

                await pool.query(
                    `
                    INSERT INTO user_adoption_applications
                    (
                        adopter_id,
                        organization_id,
                        animal_id,
                        full_name,
                        contact_number,
                        email,
                        full_address,
                        civil_status,
                        age,
                        occupation,
                        emergency_name,
                        emergency_phone,
                        emergency_relation,
                        status
                    )
                    VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Approved')
                    `,
                    [
                        organization_id,
                        animal_id,
                        req.body.adopter_full_name,
                        req.body.adopter_contact_number,
                        req.body.adopter_email,
                        req.body.adopter_full_address,
                        req.body.adopter_civil_status,
                        req.body.adopter_age,
                        req.body.adopter_occupation,
                        req.body.adopter_emergency_name,
                        req.body.adopter_emergency_phone,
                        req.body.adopter_emergency_relation
                    ]
                );
            }

            // ============================
            // Generate embedding
            // ============================
            try {
                console.log("Generating embedding...");

                const embedding = await generateEmbedding(
                    pet_description || ""
                );

                console.log("Embedding generated.");

                // Save embedding
                await pool.query(
                    `
                    INSERT INTO animal_embeddings
                    (
                        animal_id,
                        embedding
                    )
                    VALUES (?, ?)
                    `,
                    [
                        animal_id,
                        JSON.stringify(embedding)
                    ]
                );

                console.log("Embedding saved.");

            } catch (embedErr) {
                console.warn("⚠️ Embedding service offline or skipped:", embedErr.message);
            }

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
            success: false,
            message: error.message || "Failed to add pet. Please make sure all required fields are complete."
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

// exports.getPetDetails = async (req, res) => {
//     try {
//         // Get pet information
//         const [rows] = await pool.query(
//             `
//             SELECT *
//             FROM animals
//             WHERE animal_id = ?
//             `,
//             [req.params.id]
//         );

//         if (!rows.length) {
//             return res.json({
//                 success: false,
//                 message: "Pet not found."
//             });
//         }

//         // Get medical history
//         const [medical] = await pool.query(
//             `
//             SELECT *
//             FROM animal_medical_history
//             WHERE animal_id = ?
//             ORDER BY administered_date DESC
//             `,
//             [req.params.id]
//         );

//         // Attach medical history to the pet object
//         rows[0].medical_history = medical;

//         res.json({
//             success: true,
//             pet: rows[0]
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };

//nasa taas yung lumang code neto nakacomment, if hindi to gumana, ibalik na lang sa lumang code
// para hindi makita or maedit ng ibang org ang pets na nasa ibang org (pets page)
exports.getPetDetails = async (req, res) => {
    try {
        // 1. Kunin muna ang org_id ng naka-login
        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.json({ success: false, message: "Organization not found." });
        }

        const organization_id = org[0].organization_id;

        // 2. Isama ang organization_id sa query check
        const [rows] = await pool.query(
            `SELECT * FROM animals WHERE animal_id = ? AND organization_id = ?`,
            [req.params.id, organization_id]
        );

        if (!rows.length) {
            return res.json({
                success: false,
                message: "Pet not found or unauthorized access."
            });
        }

        // Get medical history
        const [medical] = await pool.query(
            `SELECT 
                medical_id,
                animal_id,
                treatment,
                DATE_FORMAT(administered_date, '%Y-%m-%d') AS administered_date,
                administered_by
             FROM animal_medical_history 
             WHERE animal_id = ? 
             ORDER BY administered_date DESC`,
            [req.params.id]
        );

        rows[0].medical_history = medical;

        res.json({ success: true, pet: rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
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
            color,
            pet_description,
            health_status,
            vaccination_status,
            adoption_status,
            personality_tags,
            medical_history
        } = req.body;

        // =====================================================
        // GET LOGGED-IN ORGANIZATION
        // =====================================================

        const [organizations] = await pool.query(
            `
            SELECT organization_id
            FROM organizations
            WHERE account_id = ?
            `,
            [req.session.accountId]
        );

        if (!organizations.length) {
            return res.status(403).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organizationId = organizations[0].organization_id;

        // =====================================================
        // PREPARE UPDATE
        // =====================================================

        let imageSQL = "";

        const values = [
            name,
            species,
            gender,
            age,
            color || null,
            pet_description || null,
            health_status,
            vaccination_status,
            adoption_status,
            personality_tags || null
        ];

        // =====================================================
        // UPDATE IMAGE IF NEW IMAGE WAS UPLOADED
        // =====================================================

        if (req.file) {
            imageSQL = ", image_path=?";
            values.push(req.file.filename);
        }

        // =====================================================
        // ADD IDs FOR WHERE CLAUSE
        // =====================================================

        values.push(id);
        values.push(organizationId);

        // =====================================================
        // UPDATE PET
        // =====================================================

        const [result] = await pool.query(
            `
            UPDATE animals
            SET
                name=?,
                species=?,
                gender=?,
                age=?,
                color=?,
                pet_description=?,
                health_status=?,
                vaccination_status=?,
                adoption_status=?,
                personality_tags=?
                ${imageSQL}
            WHERE animal_id=?
              AND organization_id=?
            `,
            values
        );

        // =====================================================
        // CHECK IF PET EXISTS / BELONGS TO ORGANIZATION
        // =====================================================

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Pet not found or does not belong to your organization."
            });
        }

        // =====================================================
        // UPDATE PET EMBEDDING
        // =====================================================
        try {
            const embedding = await generateEmbedding(pet_description || "");

            await pool.query(
                `
                INSERT INTO animal_embeddings (animal_id, embedding)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE
                    embedding = VALUES(embedding),
                    updated_at = CURRENT_TIMESTAMP
                `,
                [id, JSON.stringify(embedding)]
            );
        } catch (embedErr) {
            console.warn("⚠️ Embedding service offline or skipped:", embedErr.message);
        }

        // =====================================================
        // UPDATE MEDICAL HISTORY
        // =====================================================

        const medical = medical_history ? JSON.parse(medical_history) : [];

        // Delete old records
        await pool.query(
            `
            DELETE FROM animal_medical_history
            WHERE animal_id = ?
            `,
            [id]
        );

        // Insert new records
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
                VALUES (?, ?, ?, ?)
                `,
                [
                    id,
                    m.treatment,
                    m.administered_date,
                    m.administered_by
                ]
            );
        }

        // =====================================================
        // SUCCESS
        // =====================================================

        res.json({
            success: true,
            message: "Pet updated successfully."
        });

    } catch (err) {
        console.error("UPDATE PET ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.deletePet = async (req, res) => {
    //dinagdag lang ang AND organization_id=?
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
            WHERE animal_id = ? AND organization_id = ?
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

// DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
    try {
        
        // CHECK LOGIN
        const accountId = req.session?.accountId;
        if (!accountId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        // GET LOGGED-IN ORGANIZATION
        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ? LIMIT 1`,
            [accountId]
        );
        if (!org.length) {
            return res.status(404).json({ success: false, message: "Organization not found." });
        }
        const organizationId = org[0].organization_id;

        // TOTAL PETS
        const [[petStats]] = await pool.query(
            `SELECT COUNT(*) AS totalPets FROM animals WHERE organization_id = ?`,
            [organizationId]
        );

        // PENDING ADOPTIONS
        const [[pendingStats]] = await pool.query(
            `
            SELECT COUNT(*) AS pendingAdoptions
            FROM user_adoption_applications app
            INNER JOIN animals animal ON app.animal_id = animal.animal_id
            WHERE animal.organization_id = ? AND app.status IN ('Under Review', 'Interview Scheduled')
            `,
            [organizationId]
        );

        // ADOPTED PETS
        const [[adoptedStats]] = await pool.query(
            `
            SELECT COUNT(DISTINCT app.animal_id) AS adoptedPets
            FROM user_adoption_applications app
            INNER JOIN animals animal ON app.animal_id = animal.animal_id
            WHERE animal.organization_id = ? AND app.status = 'Approved'
            `,
            [organizationId]
        );

        // CASH DONATIONS
        const [[cash]] = await pool.query(
            `SELECT IFNULL(SUM(amount), 0) AS cashTotal FROM cash_donations WHERE organization_id = ? AND status = 'Approved'`,
            [organizationId]
        );

        // IN-KIND DONATIONS
        const [[inkind]] = await pool.query(
            `SELECT COUNT(*) AS inkindTotal FROM inkind_donations WHERE organization_id = ? AND status = 'Approved'`,
            [organizationId]
        );

        // SEND DASHBOARD DATA
        res.json({
            success: true,
            stats: {
                totalPets: Number(petStats.totalPets || 0),
                pendingAdoptions: Number(pendingStats.pendingAdoptions || 0),
                adoptedPets: Number(adoptedStats.adoptedPets || 0),
                cashDonations: Number(cash.cashTotal || 0),
                inkindDonations: Number(inkind.inkindTotal || 0)
            }
        });

    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// RECENT ADOPTION APPLICATIONS
exports.getRecentApplications = async (req, res) => {
    try {
        // CHECK LOGIN
        const accountId = req.session?.accountId;

        if (!accountId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        // GET LOGGED-IN ORGANIZATION
        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ? LIMIT 1`,
            [accountId]
        );

        if (!org.length) {
            return res.status(404).json({ success: false, message: "Organization not found." });
        }

        const organizationId = org[0].organization_id;

        // GET RECENT APPLICATIONS
        const [applications] = await pool.query(
            `
            SELECT app.application_id, app.animal_id, app.adopter_id, app.full_name, app.email, app.contact_number, app.status, app.created_at, animal.name AS pet_name
            FROM user_adoption_applications app
            INNER JOIN animals animal ON app.animal_id = animal.animal_id
            WHERE animal.organization_id = ?
            ORDER BY app.created_at DESC
            LIMIT 4
            `,
            [organizationId]
        );

        // ACTION REQUIRED
        const [[actionRequired]] = await pool.query(
            `
            SELECT COUNT(*) AS count
            FROM user_adoption_applications app
            INNER JOIN animals animal ON app.animal_id = animal.animal_id
            WHERE animal.organization_id = ? AND app.status IN ('Under Review', 'Interview Scheduled')
            `,
            [organizationId]
        );

        res.json({
            success: true,
            applications,
            actionRequired: Number(actionRequired.count || 0)
        });

    } catch (err) {
        console.error("Recent applications error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to load recent applications.",
            details: err.message
        });
    }
};
// =====================================================
// NEWLY ADDED PETS
// =====================================================
exports.getNewestPets = async (req, res) => {
    try {
        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.json([]);
        }

        const organizationId = org[0].organization_id;

        const [pets] = await pool.query(
            `SELECT animal_id, name, species, age, image_path FROM animals WHERE organization_id = ? ORDER BY created_at DESC LIMIT 4`,
            [organizationId]
        );

        res.json(pets);

    } catch (err) {
        console.error(err);

        res.status(500).json({ error: "Failed to load newest pets." });
    }
};

// ORGANIZATION ANALYTICS
exports.getAnalyticsData = async (req, res) => {
    try {
        // =====================================================
        // CHECK LOGIN
        // =====================================================
        const accountId = req.session?.accountId;

        if (!accountId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized."
            });
        }

        // =====================================================
        // GET LOGGED-IN ORGANIZATION
        // =====================================================
        const [orgRows] = await pool.query(
            `
            SELECT
                organization_id,
                organization_name
            FROM organizations
            WHERE account_id = ?
            LIMIT 1
            `,
            [accountId]
        );

        if (!orgRows.length) {
            return res.status(404).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organizationId = orgRows[0].organization_id;
        const organizationName = orgRows[0].organization_name;

        // =====================================================
        // GET FILTER VALUES FIRST
        // =====================================================
        const period = ["day", "month", "year"].includes(req.query.period)
            ? req.query.period
            : "month";

        const requestedDate = req.query.date;

        // =====================================================
        // CREATE DATE RANGE
        // =====================================================
        let startDate;
        let endDate;
        let displayDate;

        if (period === "day") {
            // Expected: 2026-08-07
            const dateValue = requestedDate || new Date().toISOString().slice(0, 10);

            startDate = `${dateValue} 00:00:00`;

            const [year, month, day] = dateValue.split("-").map(Number);
            const nextDay = new Date(year, month - 1, day + 1);

            endDate =
                `${nextDay.getFullYear()}-` +
                `${String(nextDay.getMonth() + 1).padStart(2, "0")}-` +
                `${String(nextDay.getDate()).padStart(2, "0")} 00:00:00`;

            displayDate = dateValue;

        } else if (period === "year") {
            // Expected: 2026 or 2026-01-01
            const year = String(
                requestedDate || new Date().getFullYear()
            ).substring(0, 4);

            startDate = `${year}-01-01 00:00:00`;
            endDate = `${Number(year) + 1}-01-01 00:00:00`;

            displayDate = year;

        } else {
            // =================================================
            // MONTH
            // Expected: 2026-08
            // =================================================
            const monthValue =
                requestedDate ||
                new Date().toISOString().slice(0, 7);

            const [year, month] = monthValue
                .substring(0, 7)
                .split("-")
                .map(Number);

            startDate =
                `${year}-${String(month).padStart(2, "0")}-01 00:00:00`;

            const nextMonth = new Date(year, month, 1);

            endDate =
                `${nextMonth.getFullYear()}-` +
                `${String(nextMonth.getMonth() + 1).padStart(2, "0")}-` +
                `01 00:00:00`;

            displayDate =
                `${year}-${String(month).padStart(2, "0")}`;
        }

        // =====================================================
        // PET SUMMARY
        // CURRENT PET STATUS
        // Based on animals table
        // =====================================================
        const [[petSummary]] = await pool.query(
            `
            SELECT
                COUNT(*) AS totalPets,

                SUM(
                    CASE
                        WHEN adoption_status = 'Available'
                        THEN 1 ELSE 0
                    END
                ) AS availablePets,

                SUM(
                    CASE
                        WHEN adoption_status = 'Pending'
                        THEN 1 ELSE 0
                    END
                ) AS pendingPets,

                SUM(
                    CASE
                        WHEN adoption_status = 'Adopted'
                        THEN 1 ELSE 0
                    END
                ) AS adoptedPets,

                SUM(
                    CASE
                        WHEN adoption_status = 'Archived'
                        THEN 1 ELSE 0
                    END
                ) AS archivedPets

            FROM animals
            WHERE organization_id = ?
            `,
            [organizationId]
        );

        // =====================================================
        // AVAILABLE PETS BY SPECIES
        // Based on animals.species
        // =====================================================
        const [availablePetsBySpecies] = await pool.query(
            `
            SELECT
                species,
                COUNT(*) AS total
            FROM animals
            WHERE organization_id = ?
              AND adoption_status = 'Available'
            GROUP BY species
            ORDER BY species
            `,
            [organizationId]
        );

        // =====================================================
        // APPROVED ADOPTIONS
        // Based on:
        // user_adoption_applications.status = Approved
        // animals.organization_id
        // =====================================================
        let adoptionGroupFormat;

        if (period === "day") {
            adoptionGroupFormat = "%H:00";
        } else if (period === "year") {
            adoptionGroupFormat = "%Y-%m";
        } else {
            adoptionGroupFormat = "%Y-%m-%d";
        }

        const [adoptionChart] = await pool.query(
            `
            SELECT
                DATE_FORMAT(app.created_at, ?) AS label,
                COUNT(*) AS total
            FROM user_adoption_applications app

            INNER JOIN animals animal
                ON app.animal_id = animal.animal_id

            WHERE animal.organization_id = ?
              AND app.status = 'Approved'
              AND app.created_at >= ?
              AND app.created_at < ?

            GROUP BY label
            ORDER BY MIN(app.created_at)
            `,
            [
                adoptionGroupFormat,
                organizationId,
                startDate,
                endDate
            ]
        );

        // =====================================================
        // CASH DONATIONS
        // Based on:
        // cash_donations.status = Approved
        // cash_donations.amount
        // =====================================================
        let cashGroupFormat;

        if (period === "day") {
            cashGroupFormat = "%H:00";
        } else if (period === "year") {
            cashGroupFormat = "%Y-%m";
        } else {
            cashGroupFormat = "%Y-%m-%d";
        }

        const [[cashSummary]] = await pool.query(
            `
            SELECT
                COUNT(*) AS donationCount,
                COALESCE(SUM(amount), 0) AS totalAmount
            FROM cash_donations
            WHERE organization_id = ?
              AND status = 'Approved'
              AND created_at >= ?
              AND created_at < ?
            `,
            [
                organizationId,
                startDate,
                endDate
            ]
        );

        const [cashChart] = await pool.query(
            `
            SELECT
                DATE_FORMAT(created_at, ?) AS label,
                COALESCE(SUM(amount), 0) AS total
            FROM cash_donations
            WHERE organization_id = ?
              AND status = 'Approved'
              AND created_at >= ?
              AND created_at < ?
            GROUP BY label
            ORDER BY MIN(created_at)
            `,
            [
                cashGroupFormat,
                organizationId,
                startDate,
                endDate
            ]
        );

        // =====================================================
        // IN-KIND DONATIONS
        // Based on:
        // inkind_donations.status = Approved
        // inkind_donations.quantity
        // =====================================================
        const [[inKindSummary]] = await pool.query(
            `
            SELECT
                COUNT(*) AS donationRecords,
                COALESCE(SUM(quantity), 0) AS totalQuantity
            FROM inkind_donations
            WHERE organization_id = ?
              AND status = 'Approved'
              AND created_at >= ?
              AND created_at < ?
            `,
            [
                organizationId,
                startDate,
                endDate
            ]
        );

        const [inKindChart] = await pool.query(
            `
            SELECT
                DATE_FORMAT(created_at, ?) AS label,
                COALESCE(SUM(quantity), 0) AS quantity
            FROM inkind_donations
            WHERE organization_id = ?
              AND status = 'Approved'
              AND created_at >= ?
              AND created_at < ?
            GROUP BY label
            ORDER BY MIN(created_at)
            `,
            [
                cashGroupFormat,
                organizationId,
                startDate,
                endDate
            ]
        );

        // =====================================================
        // IN-KIND BY ITEM
        // =====================================================
        const [inKindItems] = await pool.query(
            `
            SELECT
                item_name AS label,
                SUM(quantity) AS quantity
            FROM inkind_donations
            WHERE organization_id = ?
              AND status = 'Approved'
              AND created_at >= ?
              AND created_at < ?
            GROUP BY item_name
            ORDER BY quantity DESC
            `,
            [
                organizationId,
                startDate,
                endDate
            ]
        );

        // =====================================================
        // FORMAT RESPONSE
        // =====================================================
        res.json({
            success: true,
            organization: {
                id: organizationId,
                name: organizationName
            },

            period: period,
            date: displayDate,
            range: {
                start: startDate,
                end: endDate
            },
            
            pets: {
                total: Number(petSummary.totalPets || 0),
                available: Number(petSummary.availablePets || 0),
                pending: Number(petSummary.pendingPets || 0),
                adopted: Number(petSummary.adoptedPets || 0),
                archived: Number(petSummary.archivedPets || 0)
            },
            availableBySpecies: availablePetsBySpecies.map(row => ({
                species: row.species,
                total: Number(row.total || 0)
            })),
            adoptions: {
                total: adoptionChart.reduce(
                    (sum, row) => sum + Number(row.total || 0),
                    0
                ),
                chart: adoptionChart.map(row => ({
                    label: row.label,
                    total: Number(row.total || 0)
                }))
            },
            cash: {
                total: Number(cashSummary.totalAmount || 0),
                count: Number(cashSummary.donationCount || 0),
                chart: cashChart.map(row => ({
                    label: row.label,
                    total: Number(row.total || 0)
                }))
            },
            inKind: {
                totalQuantity: Number(inKindSummary.totalQuantity || 0),
                records: Number(inKindSummary.donationRecords || 0),
                chart: inKindChart.map(row => ({
                    label: row.label,
                    quantity: Number(row.quantity || 0)
                })),
                items: inKindItems.map(row => ({
                    label: row.label,
                    quantity: Number(row.quantity || 0)
                }))
            }
        });

    } catch (err) {
        console.error("Analytics error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to load analytics.",
            details: err.message
        });
    }
};

// ==========================================
// ARCHIVE / UNARCHIVE PET CONTROLLER
// ==========================================
exports.archivePet = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, prevStatus} = req.body; // 'Archived' o 'Restore' / 'Available'[cite: 70]

        // 1. Check organization ownership
        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [req.session.accountId]
        );

        if (!org.length) {
            return res.status(403).json({
                success: false,
                message: "Organization not found."
            });
        }

        const organizationId = org[0].organization_id;

        if (status === 'Archived') {
            // KAPAG I-AARCHIVE
            await pool.query(
                `UPDATE animals SET adoption_status = 'Archived' WHERE animal_id = ? AND organization_id = ?`,
                [id, organizationId]
            );

            return res.json({
                success: true,
                message: "Pet has been archived successfully."
            });
        } else {
            // KAPAG I-UUNARCHIVE: Aalamin ang dating status mula sa applications table
            const [applications] = await pool.query(
                `SELECT status FROM user_adoption_applications 
                 WHERE animal_id = ? 
                 ORDER BY application_id DESC LIMIT 1`,
                [id]
            );

            let restoredStatus = prevStatus || 'Available';

            // Kung hindi naipasa o 'Archived' ang naipasa, tingnan sa applications table
            if (!prevStatus || prevStatus === 'Archived') {
                const [applications] = await pool.query(
                    `SELECT status FROM user_adoption_applications 
                     WHERE animal_id = ? 
                     ORDER BY application_id DESC LIMIT 1`,
                    [id]
                );

                if (applications.length > 0) {
                    const appStatus = (applications[0].status || '').toLowerCase();

                    // Kung may active application pa -> PENDING
                    if (appStatus.includes('review') || appStatus.includes('interview') || appStatus.includes('scheduled')) {
                        restoredStatus = 'Pending';
                    } else if (appStatus.includes('approved')) {
                        restoredStatus = 'Adopted';
                    }
                }
            }

            // I-UPDATE SA TOTOONG DATING STATUS (Pending o Available)
            await pool.query(
                `UPDATE animals SET adoption_status = ? WHERE animal_id = ? AND organization_id = ?`,
                [restoredStatus, id, organizationId]
            );

            return res.json({
                success: true,
                message: `Pet successfully restored with status: ${restoredStatus}.`
            });
        }

    } catch (err) {
        console.error("ARCHIVE PET ERROR:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ==========================================
// GET APPLICATION ID BY ANIMAL ID
// ==========================================
exports.getApplicationByAnimalId = async (req, res) => {
    try {
        const animalId = req.params.animalId;
        const accountId = req.session?.accountId;

        if (!accountId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        // Kunin ang organization_id
        const [org] = await pool.query(
            `SELECT organization_id FROM organizations WHERE account_id = ?`,
            [accountId]
        );

        if (!org.length) {
            return res.status(404).json({ success: false, message: "Organization not found." });
        }

        const organizationId = org[0].organization_id;

        // Kunin ang approved application ng animal na ito
        const [rows] = await pool.query(
            `
            SELECT app.application_id
            FROM user_adoption_applications app
            INNER JOIN animals a ON app.animal_id = a.animal_id
            WHERE app.animal_id = ? AND a.organization_id = ?
            ORDER BY app.application_id DESC
            LIMIT 1
            `,
            [animalId, organizationId]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "No adoption application found for this pet."
            });
        }

        res.json({
            success: true,
            application_id: rows[0].application_id
        });

    } catch (error) {
        console.error("Get Application By Animal Error:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
const pool = require("../config/database");
const { generateEmbedding } = require("../services/embeddingService");

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


        // get organization using logged account
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
                success:false,
                message:"Organization not found"
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
            const embedding = await generateEmbedding(
                behavior_description || ""
            );
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

    }catch (error) {

    console.error("========== PET INSERT ERROR ==========");
    console.error(error);

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};
//pets card
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
                success:false,
                message:"Organization not found"
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
            success:true,
            pets
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Unable to load pets."
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
        const embedding = await generateEmbedding(
            behavior_description || ""
        );
        await pool.query(
            `
            INSERT INTO animal_embeddings
            (
                animal_id,
                embedding
            )
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
            embedding = VALUES(embedding),
            updated_at = CURRENT_TIMESTAMP
            `,
            [
                id,
                JSON.stringify(embedding)
            ]
        );

        const medical = medical_history
            ? JSON.parse(medical_history)
            : [];

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

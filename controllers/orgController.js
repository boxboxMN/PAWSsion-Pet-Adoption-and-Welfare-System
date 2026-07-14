const pool = require("../config/database");

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
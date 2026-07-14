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
            adoption_status
        } = req.body;


        // get organization using logged account
        const [org] = await pool.query(
            `
            SELECT organization_id
            FROM organizations
            WHERE account_id = ?
            `,
            [req.session.accountId]
        );


        if (!org.length) {
            return res.status(404).json({
                success:false,
                message:"Organization not found"
            });
        }


        const organization_id = org[0].organization_id;


        let image_path = null;

        if(req.file){
            image_path = req.file.filename;
        }


        await pool.query(
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
                image_path
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
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
                image_path
            ]
        );


        res.json({
            success:true,
            message:"Pet added successfully"
        });


    } catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Something went wrong"
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
            return res.status(404).json({
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

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load pets."
        });

    }
};
exports.getPetDetails = async (req, res) => {

    try{

        const [rows] = await pool.query(
            "SELECT * FROM animals WHERE animal_id = ?",
            [req.params.id]
        );

        if(!rows.length){
            return res.json({
                success:false,
                message:"Pet not found."
            });
        }

        res.json({
            success:true,
            pet:rows[0]
        });

    }catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Server error"
        });

    }

};
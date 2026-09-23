const matchmakingService =
    require("../services/matchmakingService");


// ==========================================================
// REPAIR BEHAVIOR
// ==========================================================

exports.repairBehavior = async (req, res) => {

    try {

        const {
            behavior
        } = req.body;


        if (!behavior || !behavior.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a pet preference description."

            });
        }


        const result =
            await matchmakingService.repairBehavior(
                behavior
            );


        return res.json(result);


    } catch (error) {

        console.error(
            "========== BEHAVIOR REPAIR ERROR =========="
        );

        console.error(error);


        return res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Unable to process the pet preference."

        });
    }
};


// ==========================================================
// MATCH PETS
// ==========================================================

exports.matchPets = async (req, res) => {

    try {

        const {
            type,
            sex,
            age,
            behavior
        } = req.body;


        if (!type || !sex || !age || !behavior) {

            return res.status(400).json({

                success: false,

                message:
                    "Please complete all matchmaking fields."

            });
        }


        const result =
            await matchmakingService.matchPets({

                type,
                sex,
                age,
                behavior

            });


        return res.json({

            success: true,

            matches:
                result.matches,

            repairedBehavior:
                result.repairedBehavior

        });


    } catch (error) {

        console.error(
            "========== MATCHMAKING ERROR =========="
        );

        console.error(error);


        return res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Unable to generate matches."

        });
    }
};
const matchmakingService = require("../services/matchmakingService");

exports.matchPets = async (req, res) => {
    try {

        const {
            type,
            sex,
            age,
            behavior
        } = req.body;

        // Basic validation
        if (!type || !sex || !age || !behavior) {
            return res.status(400).json({
                success: false,
                message: "Please complete all matchmaking fields."
            });
        }

        // Run the matchmaking service
        const matches = await matchmakingService.matchPets({
            type,
            sex,
            age,
            behavior
        });

        res.json({
            success: true,
            matches
        });

    } catch (error) {

        console.error("========== MATCHMAKING ERROR ==========");
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message || "Unable to generate matches."
        });

    }
};
const axios = require("axios");

async function generateEmbedding(text) {

    try {

        const response = await axios.post(
            "http://localhost:5000/embedding",
            {
                text: text
            }
        );

        console.log("========================================");
        console.log("FLASK RESPONSE:");
        console.log(response.data);
        console.log("========================================");

        return {
            embedding: response.data.embedding,
            repairedText: response.data.repaired_text
        };

    } catch (error) {

        console.error("========================================");
        console.error("FLASK EMBEDDING ERROR");
        console.error("========================================");

        if (error.response) {

            console.error(
                "Status:",
                error.response.status
            );

            console.error(
                "Message:",
                error.response.data
            );

            // Pass Flask's message upward
            const flaskError = new Error(
                error.response.data.message ||
                "Invalid behavior description."
            );

            flaskError.status =
                error.response.status;

            flaskError.repairedText =
                error.response.data.repaired_text;

            throw flaskError;

        }

        throw error;
    }
}

module.exports = {
    generateEmbedding
};
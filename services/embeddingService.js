const axios = require("axios");

async function generateEmbedding(text) {
    const response = await axios.post(
        "http://localhost:5000/embedding",
        {
            text: text
        }
    );

    return response.data.embedding;
}

module.exports = {
    generateEmbedding
};
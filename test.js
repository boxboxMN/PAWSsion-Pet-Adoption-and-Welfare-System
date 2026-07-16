const { generateEmbedding } = require("./services/embeddingService");

async function test() {
    const embedding = await generateEmbedding(
        "Friendly playful sweet dog"
    );

    console.log("Embedding length:", embedding.length);
}

test();
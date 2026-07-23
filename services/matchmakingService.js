const pool = require("../config/database");
const { generateEmbedding } = require("./embeddingService");

// =========================================
// COSINE SIMILARITY
// =========================================
function cosineSimilarity(vecA, vecB) {

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// =========================================
// MATCH PETS
// =========================================
async function matchPets(preferences) {

    const {
        type,
        sex,
        age,
        behavior
    } = preferences;

    // Generate ONE embedding for the adopter's description
    const userEmbedding = await generateEmbedding(behavior);

    // Load pets together with their embeddings
    const [pets] = await pool.query(`
        SELECT
            a.animal_id,
            a.name,
            a.species,
            a.gender,
            a.age,
            a.color,
            a.behavior_description,
            a.personality_tags,
            a.image_path,
            ae.embedding
        FROM animals a
        INNER JOIN animal_embeddings ae
            ON a.animal_id = ae.animal_id
        WHERE
            a.adoption_status='Available'
            AND a.species=?
    `, [type]);

    const matches = [];

    for (const pet of pets) {

        // Convert JSON stored in MySQL
        const petEmbedding =
            typeof pet.embedding === "string"
                ? JSON.parse(pet.embedding)
                : pet.embedding;

        // Cosine similarity (-1 to 1)
        const similarity =
            cosineSimilarity(userEmbedding, petEmbedding);

        // Convert to 0-100
        const behaviorScore =
            ((similarity + 1) / 2) * 100;

        const sexScore =
            pet.gender === sex ? 100 : 0;

        const ageScore =
            pet.age === age ? 100 : 0;

        // Final weighted score
        const finalScore =
            (behaviorScore * 0.70) +
            (ageScore * 0.20) +
            (sexScore * 0.10);

        matches.push({

            animal_id: pet.animal_id,

            name: pet.name,

            species: pet.species,

            gender: pet.gender,

            age: pet.age,

            color: pet.color,

            image_path: pet.image_path,

            personality_tags: pet.personality_tags,

            behavior_description: pet.behavior_description,

            behaviorSimilarity:
                Number(behaviorScore.toFixed(2)),

            ageScore,

            sexScore,

            score:
                Number(finalScore.toFixed(2))

        });

    }

    // Highest score first
    matches.sort((a, b) => b.score - a.score);

    return matches;
}

module.exports = {
    matchPets
};
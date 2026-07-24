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

        // Convert to 0-1
        let behaviorSimilarity =
            (similarity + 1) / 2;
        
            console.log("====================================");
            console.log("Pet:", pet.name);
            console.log("Raw Cosine Similarity:", similarity.toFixed(4));
            console.log("Behavior Similarity BEFORE Boost:", (behaviorSimilarity * 100).toFixed(2) + "%");

        // -----------------------------------
        // Smooth Boost
        // -----------------------------------
        // Only boost if already a decent match.
        if (behaviorSimilarity >= 0.40) {

            // Increase by up to 25% of the remaining distance to 1.0
            behaviorSimilarity =
                behaviorSimilarity +
                ((1 - behaviorSimilarity) * 0.25);
        }
            console.log("Behavior Similarity AFTER Boost :", (behaviorSimilarity * 100).toFixed(2) + "%");

        // Binary indicator scores
        const sexScore =
            pet.gender === sex ? 1 : 0;

        const ageScore =
            pet.age === age ? 1 : 0;
            
            console.log("Sex Match :", sexScore === 1 ? "YES" : "NO");
            console.log("Age Match :", ageScore === 1 ? "YES" : "NO");

        // Weighted Sum Model
        const finalScore =
            (behaviorSimilarity * 0.70) +
            (ageScore * 0.20) +
            (sexScore * 0.10);

            console.log("Behavior Contribution :", (behaviorSimilarity * 0.70 * 100).toFixed(2) + "%");
            console.log("Age Contribution      :", (ageScore * 0.20 * 100).toFixed(2) + "%");
            console.log("Sex Contribution      :", (sexScore * 0.10 * 100).toFixed(2) + "%");
            console.log("------------------------------------");
            console.log("FINAL MATCH SCORE     :", (finalScore * 100).toFixed(2) + "%");
            console.log("====================================\n");
            
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
                Number((behaviorSimilarity * 100).toFixed(2)),

            ageScore:
                ageScore * 100,

            sexScore:
                sexScore * 100,

            score:
                Number((finalScore * 100).toFixed(2))

        });

    }

    // Highest score first
    matches.sort((a, b) => b.score - a.score);

    return matches;
}

module.exports = {
    matchPets
};
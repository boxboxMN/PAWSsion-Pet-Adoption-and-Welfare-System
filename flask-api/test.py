from sentence_transformers import SentenceTransformer

print("Loading model...")

model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

print("Model loaded successfully!")

# Test sentence
text = "Friendly playful sweet dog"

# Generate embedding
embedding = model.encode(text)

# Print embedding length
print(len(embedding))
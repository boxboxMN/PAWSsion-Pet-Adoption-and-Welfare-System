from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

print("Loading model...")

model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

print("Model loaded!")

@app.route("/embedding", methods=["POST"])
def get_embedding():
    # Get JSON from request
    data = request.get_json()

    # Get the text
    text = data.get("text", "")

    # Generate embedding
    embedding = model.encode(text).tolist()

    # Return JSON
    return jsonify({
        "embedding": embedding
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import wordninja
import re


app = Flask(__name__)


# ==========================================================
# LOAD MODEL
# ==========================================================

print("Loading model...")

model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

print("Model loaded!")
# ==========================================================
# REPAIR BEHAVIOR TEXT
# ==========================================================
def repair_behavior_text(text):
    text = str(text or "").strip()
    if not text:
        return ""
    # ------------------------------------------------------
    # NORMALIZE PUNCTUATION
    # ------------------------------------------------------
    text = text.replace(".", " ")
    text = text.replace(",", " ")
    text = text.replace("!", " ")
    text = text.replace("?", " ")
    text = text.replace(";", " ")
    text = text.replace(":", " ")
    # ------------------------------------------------------
    # SEPARATE CAMEL CASE
    # Example:
    # iWantAKindPet
    # becomes
    # i Want A Kind Pet
    # -----------------------------------------------------
    text = re.sub(
        r"([a-z])([A-Z])",
        r"\1 \2",
        text
    )
    # ------------------------------------------------------
    # WORDNINJA
    # ------------------------------------------------------
    words = wordninja.split(text)
    # ------------------------------------------------------
    # REBUILD TEXT
    # ------------------------------------------------------
    repaired = " ".join(words)
    repaired = " ".join(
        repaired.split()
    )
    # ------------------------------------------------------
    # NORMALIZE CAPITALIZATION
    # ------------------------------------------------------
    if repaired:
        repaired = repaired.lower()
        repaired = (
            repaired[0].upper()
            + repaired[1:]
        )
    return repaired

# ==========================================================
# REPAIR + VALIDATE
# ==========================================================
@app.route("/repair", methods=["POST"])
def repair_text():
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "message":
                    "No data received."
            }), 400
        text= data.get("text", "")
        if not str(text).strip():
            return jsonify({
                "success": False,
                "message":
                    "Please provide a pet preference description."
            }), 400
        # --------------------------------------------------
        # REPAIR
        # --------------------------------------------------
        repaired_text = repair_behavior_text(text)
        print("========================================")
        print("BEHAVIOR REPAIR")
        print("========================================")
        print("Original:", text)
        print("Repaired:", repaired_text)
        print("========================================")
        # --------------------------------------------------
        # WORD COUNT
        # --------------------------------------------------
        words = repaired_text.split()
        word_count = len(words)
        # --------------------------------------------------
        # MINIMUM 5 WORDS
        # --------------------------------------------------
        if word_count < 5:
            return jsonify({
                "success": False,
                "message":
                    "Please provide more meaningful details about the personality, behavior, and traits of your preferred pet.",
                "repaired_text":
                    repaired_text,
                "word_count":
                    word_count,
                "character_count":
                    len(repaired_text)
            }), 400
        # --------------------------------------------------
        # CHARACTER COUNT
        # --------------------------------------------------
        character_count =len(repaired_text)
        #--------------------------------------------------
        # MINIMUM 20 CHARACTERS
        # --------------------------------------------------
        if character_count < 20:
            return jsonify({
                "success": False,
                "message":
                    "Please provide a little more detail about the personality, behavior, and traits of your preferred pet.",
                "repaired_text":
                    repaired_text,
                "word_count":
                    word_count,
                "character_count":
                    character_count

            }), 400
        # --------------------------------------------------
        # VALID
        # --------------------------------------------------
        print("Behavior validation: PASSED")
        print("Word count:", word_count)
        print("Character count:", character_count)
        return jsonify({
            "success": True,
            "repaired_text":
                repaired_text,
            "word_count":
                word_count,
            "character_count":
                character_count
        })
    except Exception as error:
        print("========================================")
        print("REPAIR ERROR")
        print("========================================")
        print(error)
        print("========================================")
        return jsonify({
            "success": False,
            "message":
                "Unable to process the pet preference."
        }), 500
# ==========================================================
# EMBEDDING
# ==========================================================
@app.route("/embedding", methods=["POST"])
def get_embedding():

    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "message":
                    "No data received."

            }), 400
        text = data.get("text", "")
        if not str(text).strip():
            return jsonify({
                "success": False,
                "message":
                    "Text is required."
            }), 400
        # Text should already be repaired
        # and validated before reaching here.
        embedding = model.encode(text).tolist()
        print("========================================")
        print("EMBEDDING TEXT:")
        print(text)
        print("========================================")
        return jsonify({
            "success": True,
            "embedding":
                embedding,
            "repaired_text":
                text
        })
    except Exception as error:

        print("========================================")
        print("EMBEDDING ERROR")
        print("========================================")
        print(error)
        print("========================================")
        return jsonify({

            "success": False,

            "message":
                "Unable to generate embedding."

        }), 500


# ==========================================================
# RUN FLASK
# ==========================================================

if __name__ == "__main__":

    app.run(
        debug=False,
        port=5000
    )
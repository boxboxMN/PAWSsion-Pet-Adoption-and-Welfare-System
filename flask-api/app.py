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

print(
    "Model max sequence length:",
    model.max_seq_length
)


# ==========================================================
# TEXT HELPERS
# ==========================================================

def normalize_text(text):
    """
    Normalize whitespace and Unicode without changing
    the original capitalization yet.
    """

    text = str(text or "")

    # Unicode normalization
    text = text.strip()

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def count_words(text):
    """
    Count actual letter-based words.
    Supports letters with Unicode characters and
    apostrophes.
    """

    words = re.findall(
        r"\b\w+(?:['’]\w+)?\b",
        text,
        flags=re.UNICODE
    )

    return len(words)


def get_words(text):
    """
    Return words used for validation.
    """

    return re.findall(
        r"\b\w+(?:['’]\w+)?\b",
        text,
        flags=re.UNICODE
    )
# ============================================================
# GIBBERISH DETECTION
# ============================================================

# Legitimate short English / Tagalog / Taglish words.
# This is NOT a list of allowed descriptions.
# It only prevents normal short words from being marked as gibberish.
COMMON_SHORT_WORDS = {
    "a", "i", "an", "am", "as", "at", "be", "by", "do", "go",
    "he", "if", "in", "is", "it", "me", "my", "no", "of", "on",
    "or", "so", "to", "up", "us", "we",

    # Common Tagalog / Taglish
    "ako", "ang", "at", "ay", "ba", "dahil", "din", "doon",
    "ito", "iyan", "iyon", "ka", "kay", "ko", "kung", "may",
    "mo", "na", "ng", "ni", "o", "pa", "para", "sa", "si",
    "sila", "sino", "ito", "the"
}


def is_suspicious_word(word):
    """
    Detect whether ONE word looks like random/gibberish text.
    """

    word = word.lower().strip()

    # Remove apostrophes only for analysis
    clean = re.sub(r"['’]", "", word)

    if not clean:
        return False

    # Normal short words are allowed
    if clean in COMMON_SHORT_WORDS:
        return False

    # --------------------------------------------------------
    # 1. RANDOM SINGLE LETTERS
    # --------------------------------------------------------

    # Only a and i are normally valid standalone English words.
    if len(clean) == 1:
        return clean not in {"a", "i"}

    # --------------------------------------------------------
    # 2. VERY SHORT NON-WORDS
    # --------------------------------------------------------

    # Two-letter words that are not common words are suspicious.
    if len(clean) == 2:
        return True

    # Three-letter words with no vowel are highly suspicious.
    if len(clean) == 3:
        vowels = re.findall(
            r"[aeiouáéíóúàèìòùâêîôûäëïöü]",
            clean,
            re.IGNORECASE
        )

        if len(vowels) == 0:
            return True

    # --------------------------------------------------------
    # 3. FIVE OR MORE CONSONANTS IN A ROW
    # --------------------------------------------------------

    if re.search(
        r"[bcdfghjklmnpqrstvwxyz]{5,}",
        clean,
        re.IGNORECASE
    ):
        return True

    # --------------------------------------------------------
    # 4. REPETITIVE RANDOM PATTERNS
    # --------------------------------------------------------

    if re.fullmatch(
        r"(.{1,2})\1{3,}",
        clean,
        re.IGNORECASE
    ):
        return True

    # --------------------------------------------------------
    # 5. VOWEL / CONSONANT ANALYSIS
    # --------------------------------------------------------

    vowels = re.findall(
        r"[aeiouáéíóúàèìòùâêîôûäëïöü]",
        clean,
        re.IGNORECASE
    )

    consonants = re.findall(
        r"[bcdfghjklmnpqrstvwxyz]",
        clean,
        re.IGNORECASE
    )

    length = len(clean)
    vowel_count = len(vowels)
    consonant_count = len(consonants)

    # Long words with almost no vowels are suspicious.
    if length >= 5 and vowel_count == 0:
        return True

    if length >= 7 and vowel_count / length < 0.15:
        return True

    # Extremely consonant-heavy words
    if length >= 7 and consonant_count / length >= 0.75:
        return True

    # --------------------------------------------------------
    # 6. REPEATED CONSONANT PATTERNS
    # --------------------------------------------------------

    if re.search(
        r"[bcdfghjklmnpqrstvwxyz]{3,}[aeiou]{0,1}[bcdfghjklmnpqrstvwxyz]{3,}",
        clean,
        re.IGNORECASE
    ):
        return True

    return False


def looks_like_gibberish(text):
    """
    Detect whether the ENTIRE description looks like gibberish.

    Important:
    We don't reject based on one unusual word.
    We look at the overall quality of the sentence.
    """

    words = re.findall(
        r"\b[\w]+(?:['’][\w]+)?\b",
        text.lower(),
        re.UNICODE
    )

    if not words:
        return True

    total_words = len(words)

    suspicious_words = 0
    very_short_suspicious = 0
    meaningless_single_letters = 0

    for word in words:

        # ----------------------------------------------------
        # Single-letter garbage
        # ----------------------------------------------------

        if len(word) == 1 and word not in {"a", "i"}:
            meaningless_single_letters += 1
            suspicious_words += 1
            continue

        # ----------------------------------------------------
        # Suspicious short words
        # ----------------------------------------------------

        if len(word) <= 3 and word not in COMMON_SHORT_WORDS:
            very_short_suspicious += 1

        # ----------------------------------------------------
        # General word-level check
        # ----------------------------------------------------

        if is_suspicious_word(word):
            suspicious_words += 1

    suspicious_ratio = suspicious_words / total_words
    short_garbage_ratio = very_short_suspicious / total_words

    # ========================================================
    # HARD FAIL CONDITIONS
    # ========================================================

    # 1. Three or more random single-letter tokens
    if meaningless_single_letters >= 3:
        return True

    # 2. At least 3 suspicious short words
    if very_short_suspicious >= 3:
        return True

    # 3. More than 40% of the sentence is suspicious
    if total_words >= 5 and suspicious_ratio >= 0.40:
        return True

    # 4. More than 50% consists of suspicious 1-3 letter words
    if total_words >= 5 and short_garbage_ratio >= 0.50:
        return True

    # 5. At least 2 suspicious words in a short sentence
    if total_words <= 8 and suspicious_words >= 2:
        return True

    return False
# ==========================================================
# SANITIZE BEFORE REPAIR
# ==========================================================

def sanitize_before_repair(text):
    """
    Remove obvious technical noise before WordNinja.

    IMPORTANT:

    This does NOT try to decide whether the text is
    meaningful.

    It only prepares the text for repair.
    """

    text = normalize_text(text)

    if not text:
        return ""

    # ------------------------------------------------------
    # Remove numbers
    # ------------------------------------------------------

    text = re.sub(
        r"\d+",
        " ",
        text
    )

    # ------------------------------------------------------
    # Replace punctuation/symbols with spaces
    #
    # Keep apostrophes because:
    #
    # don't
    # can't
    # I'm
    #
    # can carry meaning.
    # ------------------------------------------------------

    text = re.sub(
        r"[^\w\s'’\-]",
        " ",
        text,
        flags=re.UNICODE
    )

    # ------------------------------------------------------
    # Remove hyphens as separators
    # ------------------------------------------------------

    text = re.sub(
        r"(?<=\w)-(?=\w)",
        " ",
        text
    )

    # ------------------------------------------------------
    # Normalize spaces
    # ------------------------------------------------------

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    # ------------------------------------------------------
    # Remove consecutive repeated words
    #
    # YAY YAY YAY YAY
    # becomes
    # YAY
    # ------------------------------------------------------

    words = text.split()

    cleaned_words = []

    for word in words:

        if (
            cleaned_words and
            cleaned_words[-1].lower() == word.lower()
        ):
            continue

        cleaned_words.append(word)

    text = " ".join(cleaned_words)

    return text.strip()


# ==========================================================
# REPAIR BEHAVIOR TEXT
# ==========================================================

def repair_behavior_text(text):

    text = normalize_text(text)

    if not text:
        return ""

    # ------------------------------------------------------
    # Normalize punctuation
    # ------------------------------------------------------

    text = text.replace(".", " ")
    text = text.replace(",", " ")
    text = text.replace("!", " ")
    text = text.replace("?", " ")
    text = text.replace(";", " ")
    text = text.replace(":", " ")

    # ------------------------------------------------------
    # Separate camelCase
    #
    # iWantAKindPet
    #
    # becomes approximately:
    #
    # i Want A Kind Pet
    # ------------------------------------------------------

    text = re.sub(
        r"([a-z])([A-Z])",
        r"\1 \2",
        text
    )

    # ------------------------------------------------------
    # Normalize spaces
    # ------------------------------------------------------

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    # ------------------------------------------------------
    # WORDNINJA
    # ------------------------------------------------------

    words = wordninja.split(text)

    # ------------------------------------------------------
    # Rebuild
    # ------------------------------------------------------

    repaired = " ".join(words)

    repaired = re.sub(
        r"\s+",
        " ",
        repaired
    ).strip()

    # ------------------------------------------------------
    # Normalize capitalization
    # ------------------------------------------------------

    if repaired:

        repaired = repaired.lower()

        repaired = (
            repaired[0].upper()
            + repaired[1:]
        )

    return repaired


# ==========================================================
# POST-REPAIR CLEANUP
# ==========================================================

def cleanup_repaired_text(text):

    text = normalize_text(text)

    if not text:
        return ""

    # Remove consecutive repeated words again because
    # WordNinja may produce fragments.
    words = text.split()

    cleaned_words = []

    for word in words:

        if (
            cleaned_words and
            cleaned_words[-1].lower() ==
            word.lower()
        ):
            continue

        cleaned_words.append(word)

    text = " ".join(cleaned_words)

    return text.strip()


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
                "message": "No data received."
            }), 400

        text = data.get("text", "")

        if not str(text).strip():
            return jsonify({
                "success": False,
                "message": "Please provide a pet preference description."
            }), 400

        # ----------------------------------------------------
        # Normalize + repair
        # ----------------------------------------------------

        sanitized_text = sanitize_before_repair(text)

        repaired_text = repair_behavior_text(sanitized_text)

        repaired_text = cleanup_repaired_text(repaired_text)

        if not repaired_text:
            return jsonify({
                "success": False,
                "message": "Please enter a meaningful pet preference description."
            }), 400

        # ----------------------------------------------------
        # Count words / characters
        # ----------------------------------------------------

        words = repaired_text.split()

        word_count = len(words)
        character_count = len(repaired_text)

        # ----------------------------------------------------
        # Minimum requirements
        # ----------------------------------------------------

        if word_count < 5:
            return jsonify({
                "success": False,
                "message": "Please provide at least 5 words.",
                "repaired_text": repaired_text,
                "word_count": word_count,
                "character_count": character_count
            }), 400

        if character_count < 20:
            return jsonify({
                "success": False,
                "message": "Please provide at least 20 characters.",
                "repaired_text": repaired_text,
                "word_count": word_count,
                "character_count": character_count
            }), 400

        # ----------------------------------------------------
        # Maximum requirements
        # ----------------------------------------------------

        if word_count > 80:
            return jsonify({
                "success": False,
                "message": "Please keep your description below 80 words.",
                "word_count": word_count,
                "character_count": character_count
            }), 400

        if character_count > 500:
            return jsonify({
                "success": False,
                "message": "Please keep your description below 500 characters.",
                "word_count": word_count,
                "character_count": character_count
            }), 400

        # ====================================================
        # IMPORTANT: GIBBERISH CHECK
        # ====================================================

        if looks_like_gibberish(repaired_text):
            return jsonify({
                "success": False,
                "message": "Your description appears to contain random or meaningless text. Please describe the type of pet you are looking for.",
                "repaired_text": repaired_text,
                "word_count": word_count,
                "character_count": character_count
            }), 400

        # ----------------------------------------------------
        # Everything passed
        # ----------------------------------------------------

        return jsonify({
            "success": True,
            "repaired_text": repaired_text,
            "word_count": word_count,
            "character_count": character_count
        }), 200

    except Exception as e:

        print("Repair error:", e)

        return jsonify({
            "success": False,
            "message": "Unable to process your description."
        }), 500
# ==========================================================
# EMBEDDING
# ==========================================================

@app.route(
    "/embedding",
    methods=["POST"]
)
def get_embedding():

    try:

        data = request.get_json()

        if not data:

            return jsonify({

                "success":
                    False,

                "message":
                    "No data received."

            }), 400


        text = data.get(
            "text",
            ""
        )


        if not str(text).strip():

            return jsonify({

                "success":
                    False,

                "message":
                    "Text is required."

            }), 400


        # ==================================================
        # FINAL BASIC SAFETY CHECK
        # ==================================================
        #
        # The /repair endpoint should already have validated
        # this text.
        #
        # This is simply another safety layer.
        # ==================================================

        text = normalize_text(text)


        if not text:

            return jsonify({

                "success":
                    False,

                "message":
                    "Text is required."

            }), 400


        # ==================================================
        # TOKEN COUNT
        # ==================================================

        encoded = model.tokenizer(
            text,
            add_special_tokens=True,
            truncation=False
        )

        token_count = len(
            encoded["input_ids"]
        )


        # ==================================================
        # MODEL TOKEN LIMIT
        # ==================================================
        #
        # Your model has max_seq_length = 128.
        #
        # We reject anything that exceeds it rather than
        # silently allowing the model to truncate the text.
        # ==================================================

        if token_count > 128:

            return jsonify({

                "success":
                    False,

                "message":
                    "Your description is too detailed for the matching model. Please shorten it.",

                "token_count":
                    token_count

            }), 400


        # ==================================================
        # GENERATE EMBEDDING
        # ==================================================

        embedding = model.encode(
            text
        ).tolist()


        # ==================================================
        # LOG
        # ==================================================

        print(
            "========================================"
        )

        print(
            "EMBEDDING TEXT:"
        )

        print(
            text
        )

        print(
            "Token count:",
            token_count
        )

        print(
            "Embedding dimensions:",
            len(embedding)
        )

        print(
            "========================================"
        )


        return jsonify({

            "success":
                True,

            "embedding":
                embedding,

            "repaired_text":
                text,

            "token_count":
                token_count

        })


    except Exception as error:

        print(
            "========================================"
        )

        print(
            "EMBEDDING ERROR"
        )

        print(
            "========================================"
        )

        print(error)

        print(
            "========================================"
        )

        return jsonify({

            "success":
                False,

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
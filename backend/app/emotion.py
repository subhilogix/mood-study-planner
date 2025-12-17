# import torch
# from transformers import AutoTokenizer, AutoModelForSequenceClassification
# import torch.nn.functional as F


# # ---------------------------------------------------------
# # Load emotion model (DistilBERT fine-tuned on emotions)
# # ---------------------------------------------------------

# MODEL_NAME = "bhadresh-savani/distilbert-base-uncased-emotion"

# tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
# model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)


# LABELS = [
#     "sadness",
#     "joy",
#     "love",
#     "anger",
#     "fear",
#     "surprise"
# ]


# # ---------------------------------------------------------
# # Function used by journal + mood
# # ---------------------------------------------------------
# def analyze_emotion_text(text: str):
#     """
#     Returns:
#     {
#         "label": "sadness",
#         "score": 0.92
#     }
#     """
#     try:
#         inputs = tokenizer(text, return_tensors="pt", truncation=True)
#         outputs = model(**inputs)
#         probs = F.softmax(outputs.logits, dim=1)

#         score, index = torch.max(probs, dim=1)

#         emotion_label = LABELS[index.item()]
#         emotion_score = round(score.item(), 4)

#         return {
#             "label": emotion_label,
#             "score": emotion_score
#         }

#     except Exception as e:
#         print("Emotion model error:", e)
#         return {
#             "label": None,
#             "score": None
#         }
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# ---------------------------------------------------------
# Reduce CPU & memory usage (important for Render)
# ---------------------------------------------------------
torch.set_num_threads(1)

# ---------------------------------------------------------
# Model configuration
# ---------------------------------------------------------
MODEL_NAME = "bhadresh-savani/distilbert-base-uncased-emotion"

LABELS = [
    "sadness",
    "joy",
    "love",
    "anger",
    "fear",
    "surprise"
]

# ---------------------------------------------------------
# Lazy-loaded globals (DO NOT load at import time)
# ---------------------------------------------------------
_tokenizer = None
_model = None


def _load_model():
    """
    Load model & tokenizer only once (on first request)
    """
    global _tokenizer, _model

    if _tokenizer is None or _model is None:
        print("Loading emotion model...")

        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
        _model.eval()  # inference mode

        print("Emotion model loaded successfully")

    return _tokenizer, _model


# ---------------------------------------------------------
# Main emotion analysis function
# ---------------------------------------------------------
def analyze_emotion_text(text: str):
    """
    Returns:
    {
        "label": "sadness",
        "score": 0.92
    }
    """

    if not text or not text.strip():
        return {
            "label": None,
            "score": None
        }

    try:
        tokenizer, model = _load_model()

        with torch.no_grad():
            inputs = tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                padding=True,
                max_length=128
            )

            outputs = model(**inputs)
            probs = F.softmax(outputs.logits, dim=1)

            score, index = torch.max(probs, dim=1)

        emotion_label = LABELS[index.item()]
        emotion_score = round(score.item(), 4)

        return {
            "label": emotion_label,
            "score": emotion_score
        }

    except Exception as e:
        print("Emotion model error:", e)
        return {
            "label": None,
            "score": None
        }

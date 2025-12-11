import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F


# ---------------------------------------------------------
# Load emotion model (DistilBERT fine-tuned on emotions)
# ---------------------------------------------------------

MODEL_NAME = "bhadresh-savani/distilbert-base-uncased-emotion"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)


LABELS = [
    "sadness",
    "joy",
    "love",
    "anger",
    "fear",
    "surprise"
]


# ---------------------------------------------------------
# Function used by journal + mood
# ---------------------------------------------------------
def analyze_emotion_text(text: str):
    """
    Returns:
    {
        "label": "sadness",
        "score": 0.92
    }
    """
    try:
        inputs = tokenizer(text, return_tensors="pt", truncation=True)
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

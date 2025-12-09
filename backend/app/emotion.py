from functools import lru_cache
from typing import Dict

from transformers import pipeline


@lru_cache(maxsize=1)
def get_emotion_pipeline():
    """
    Lazy-load the HuggingFace DistilBERT sentiment model.
    """
    return pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english",
    )


def analyze_text(text: str) -> Dict[str, float | str]:
    pipe = get_emotion_pipeline()
    result = pipe(text)[0]  # {'label': 'POSITIVE', 'score': 0.999...}
    return {
        "label": result["label"],
        "score": float(result["score"]),
    }

from fastapi import APIRouter
from ..emotion import analyze_emotion_text
from ..models import EmotionRequest, EmotionResponse

router = APIRouter(prefix="/emotion", tags=["emotion"])


@router.post("/", response_model=EmotionResponse)
def analyze_emotion(payload: EmotionRequest):
    """
    Analyze emotion using the DistilBERT emotion classifier.
    """
    result = analyze_emotion_text(payload.text)

    return EmotionResponse(
        label=result["label"],
        score=result["score"]
    )

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from ..database import get_session
from ..models import Mood
from ..chat_ai import generate_study_wellness_reply, build_mood_context_text

router = APIRouter(prefix="/chat", tags=["chat"])


# -------- Request / Response Models -------- #

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    mood_context: Optional[str] = None


# -------- CHAT ROUTE -------- #

@router.post("/", response_model=ChatResponse)
def chat_with_ai(
    payload: ChatRequest,
    session: Session = Depends(get_session),
):
    """
    GPT/Gemini-powered chat with mood awareness.
    Always returns a valid ChatResponse.
    """

    # Get most recent mood entry
    latest_mood: Optional[Mood] = session.exec(
        select(Mood).order_by(Mood.date.desc(), Mood.created_at.desc())
    ).first()

    # Build mood context if available
    mood_context = None
    if latest_mood:
        mood_context = build_mood_context_text(
            mood_label=latest_mood.mood,
            mood_note=latest_mood.note,
            emotion_label=latest_mood.emotion_label,
            emotion_score=latest_mood.emotion_score,
        )

    # Always generate a reply — even if no mood exists
    try:
        reply_text = generate_study_wellness_reply(
            user_message=payload.message,
            mood_context=mood_context,
        )
    except Exception as e:
        print("AI Chat Error:", e)
        raise HTTPException(500, "AI failed to generate reply")

    return ChatResponse(
        reply=reply_text,
        mood_context=mood_context,
    )

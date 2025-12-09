from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select

from ..database import get_session
from ..models import Mood
from ..chat_ai import (
    generate_study_wellness_reply,
    build_mood_context_text,
)

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    mood_context: Optional[str] = None


@router.post("/", response_model=ChatResponse)
def chat_with_ai(
    payload: ChatRequest,
    session: Session = Depends(get_session),
):
    """
    Chat endpoint using OpenAI.
    It reads the latest mood (if any) and passes it as context
    to the AI so responses can be mood-aware.
    """
    # Find the most recent mood entry (if any)
    latest_mood: Optional[Mood] = session.exec(
        select(Mood).order_by(Mood.date.desc(), Mood.created_at.desc())
    ).first()

    mood_context: Optional[str] = None
    if latest_mood:
        mood_context = build_mood_context_text(
            mood_label=latest_mood.mood,
            mood_note=latest_mood.note,
            emotion_label=latest_mood.emotion_label,
            emotion_score=latest_mood.emotion_score,
        )

    reply_text = generate_study_wellness_reply(
        user_message=payload.message,
        mood_context=mood_context,
    )

    return ChatResponse(reply=reply_text, mood_context=mood_context)

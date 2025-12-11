from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import (
    JournalEntry,
    JournalCreate,
    JournalRead,
)
from app.emotion import analyze_emotion_text
from app.chat_ai import generate_reflection_text


router = APIRouter(prefix="/journal", tags=["journal"])


# ---------------------------------------------------------
# GET ALL JOURNAL ENTRIES
# ---------------------------------------------------------
@router.get("/", response_model=list[JournalRead])
def get_all_entries(session: Session = Depends(get_session)):
    entries = session.exec(
        select(JournalEntry).order_by(JournalEntry.created_at.desc())
    ).all()
    return entries


# ---------------------------------------------------------
# CREATE NEW JOURNAL ENTRY
# ---------------------------------------------------------
@router.post("/", response_model=JournalRead)
def create_entry(payload: JournalCreate, session: Session = Depends(get_session)):

    # Run ML emotion model
    emotion = None
    if payload.content:
        emotion = analyze_emotion_text(payload.content)

    emotion_label = emotion["label"] if emotion else None
    emotion_score = emotion["score"] if emotion else None

    # Generate AI reflection (Gemini)
    reflection = generate_reflection_text(payload.content, emotion_label)

    entry = JournalEntry(
        date=payload.date,
        content=payload.content,
        mood_id=payload.mood_id,
        emotion_label=emotion_label,
        emotion_score=emotion_score,
        ai_reflection=reflection,
        is_favorite=False
    )

    session.add(entry)
    session.commit()
    session.refresh(entry)

    return entry


# ---------------------------------------------------------
# TOGGLE FAVORITE
# ---------------------------------------------------------
@router.patch("/{entry_id}/favorite", response_model=JournalRead)
def toggle_favorite(entry_id: int, session: Session = Depends(get_session)):

    entry = session.get(JournalEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    entry.is_favorite = not entry.is_favorite
    session.add(entry)
    session.commit()
    session.refresh(entry)

    return entry


# ---------------------------------------------------------
# DELETE ENTRY
# ---------------------------------------------------------
@router.delete("/{entry_id}")
def delete_entry(entry_id: int, session: Session = Depends(get_session)):

    entry = session.get(JournalEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    session.delete(entry)
    session.commit()

    return {"status": "deleted"}

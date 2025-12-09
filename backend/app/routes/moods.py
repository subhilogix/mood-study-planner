from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from ..models import Mood, MoodCreate, MoodRead

router = APIRouter(prefix="/mood", tags=["mood"])


@router.get("/", response_model=List[MoodRead])
def list_moods(session: Session = Depends(get_session)):
    moods = session.exec(select(Mood).order_by(Mood.date.desc())).all()
    return moods


@router.post(
    "/", response_model=MoodRead, status_code=status.HTTP_201_CREATED
)
def create_mood(payload: MoodCreate, session: Session = Depends(get_session)):
    mood = Mood.from_orm(payload)
    session.add(mood)
    session.commit()
    session.refresh(mood)
    return mood


@router.get("/{mood_id}", response_model=MoodRead)
def get_mood(mood_id: int, session: Session = Depends(get_session)):
    mood = session.get(Mood, mood_id)
    if not mood:
        raise HTTPException(status_code=404, detail="Mood not found")
    return mood


@router.delete("/{mood_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_mood(mood_id: int, session: Session = Depends(get_session)):
    mood = session.get(Mood, mood_id)
    if not mood:
        raise HTTPException(status_code=404, detail="Mood not found")
    session.delete(mood)
    session.commit()
    return {"ok": True}

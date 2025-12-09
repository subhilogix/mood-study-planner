from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from ..models import JournalEntry, JournalCreate, JournalRead

router = APIRouter(prefix="/journal", tags=["journal"])


@router.get("/", response_model=List[JournalRead])
def list_journal_entries(session: Session = Depends(get_session)):
    entries = session.exec(
        select(JournalEntry).order_by(JournalEntry.date.desc())
    ).all()
    return entries


@router.post(
    "/", response_model=JournalRead, status_code=status.HTTP_201_CREATED
)
def create_journal_entry(
    payload: JournalCreate, session: Session = Depends(get_session)
):
    entry = JournalEntry.from_orm(payload)
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


@router.get("/{entry_id}", response_model=JournalRead)
def get_journal_entry(entry_id: int, session: Session = Depends(get_session)):
    entry = session.get(JournalEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_journal_entry(
    entry_id: int, session: Session = Depends(get_session)
):
    entry = session.get(JournalEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    session.delete(entry)
    session.commit()
    return {"ok": True}

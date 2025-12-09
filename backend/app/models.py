from datetime import datetime, date
from typing import Optional, List

from sqlmodel import SQLModel, Field, Relationship


# ---------- Mood models ----------

class MoodBase(SQLModel):
    date: date
    mood: str  # e.g. "happy", "sad", "stressed"
    note: Optional[str] = None
    emotion_label: Optional[str] = None
    emotion_score: Optional[float] = None


class Mood(MoodBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    journal_entries: List["JournalEntry"] = Relationship(back_populates="mood_ref")


class MoodCreate(MoodBase):
    pass


class MoodRead(MoodBase):
    id: int
    created_at: datetime


# ---------- Task models ----------

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    is_completed: bool = False
    mood_tag: Optional[str] = None  # e.g. "low_energy", "high_focus"


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(TaskBase):
    pass


class TaskRead(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    is_completed: Optional[bool] = None
    mood_tag: Optional[str] = None


# ---------- Journal models ----------

class JournalBase(SQLModel):
    date: date
    content: str
    mood_id: Optional[int] = Field(default=None, foreign_key="mood.id")
    emotion_label: Optional[str] = None
    emotion_score: Optional[float] = None


class JournalEntry(JournalBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    mood_ref: Optional[Mood] = Relationship(back_populates="journal_entries")


class JournalCreate(JournalBase):
    pass


class JournalRead(JournalBase):
    id: int
    created_at: datetime


# ---------- Emotion API models ----------

class EmotionRequest(SQLModel):
    text: str


class EmotionResponse(SQLModel):
    label: str
    score: float

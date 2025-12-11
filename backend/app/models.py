from datetime import datetime, date
from typing import Optional, List

from sqlmodel import SQLModel, Field, Relationship


# ======================================================
#                     MOOD MODELS
# ======================================================

class MoodBase(SQLModel):
    date: date
    mood: str
    note: Optional[str] = None

    # ML emotion fields
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



# ======================================================
#                     TASK MODELS
# ======================================================

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    due_datetime: Optional[datetime] = None     # <-- FINAL (date + time)
    is_completed: bool = False
    mood_tag: Optional[str] = None              # e.g. low_energy, focus_mode


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
    due_datetime: Optional[datetime] = None
    is_completed: Optional[bool] = None
    mood_tag: Optional[str] = None



# ======================================================
#                    JOURNAL MODELS
# ======================================================

class JournalBase(SQLModel):
    date: date
    content: str
    mood_id: Optional[int] = Field(default=None, foreign_key="mood.id")

    # Emotion ML model results
    emotion_label: Optional[str] = None
    emotion_score: Optional[float] = None


class JournalEntry(JournalBase, table=True):
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # NEW FIELDS
    is_favorite: bool = Field(default=False)
    ai_reflection: Optional[str] = None

    mood_ref: Optional["Mood"] = Relationship(back_populates="journal_entries")


class JournalCreate(JournalBase):
    pass


class JournalRead(JournalBase):
    id: int
    created_at: datetime
    is_favorite: bool
    ai_reflection: Optional[str]



# ======================================================
#               EMOTION ANALYSIS MODELS
# ======================================================

class EmotionRequest(SQLModel):
    text: str


class EmotionResponse(SQLModel):
    label: str
    score: float
# ======================================================
#                     USER / AUTH MODELS
# ======================================================

from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    email: str


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
     # GOOGLE TOKENS
    google_access_token: Optional[str] = None
    google_refresh_token: Optional[str] = None
    google_token_expiry: Optional[datetime] = None

class UserCreate(UserBase):
  password: str


class UserRead(UserBase):
  id: int
  created_at: datetime


class LoginRequest(SQLModel):
  email: str
  password: str


class Token(SQLModel):
  access_token: str
  token_type: str = "bearer"

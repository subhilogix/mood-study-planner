from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import create_db_and_tables
from .routes import health, emotion_routes, moods, tasks, journal, chat, auth
from . import google_calendar  # ← ONLY correct import

from .scheduler import start_scheduler

app = FastAPI(
    title="Mood Study Planner API",
    version="1.2.0",
    description=(
        "Backend for Mood Study Planner — mood tracking + study planner + "
        "Google Calendar integration + AI chat (study + wellness + mood-aware)."
    ),
)

# Startup events
@app.on_event("startup")
def startup_event():
    start_scheduler()
    create_db_and_tables()


# CORS
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(health.router)
app.include_router(emotion_routes.router)
app.include_router(moods.router)
app.include_router(tasks.router)
app.include_router(journal.router)
app.include_router(chat.router)
app.include_router(auth.router)

# ✔ Only one router for Google Calendar
app.include_router(google_calendar.router)


@app.get("/")
def root():
    return {
        "message": "Mood Study Planner API",
        "docs": "/docs",
        "redoc": "/redoc",
    }

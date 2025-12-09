import os
from typing import Dict, Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

router = APIRouter(prefix="/google-calendar", tags=["google-calendar"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI", "http://localhost:8000/google-calendar/callback"
)
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")

SCOPES = ["https://www.googleapis.com/auth/calendar.events"]

# In-memory tokens
CALENDAR_TOKENS: Dict[str, Optional[str]] = {
    "access_token": None,
    "refresh_token": None,
    "token_uri": None,
    "client_id": None,
    "client_secret": None,
    "scopes": None,
    "expiry": None,
}

OAUTH_STATE: Optional[str] = None


# -----------------------------
# OAuth Flow
# -----------------------------
def create_flow(state: Optional[str] = None) -> Flow:
    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }
    kwargs = {"redirect_uri": GOOGLE_REDIRECT_URI}
    if state:
        kwargs["state"] = state

    return Flow.from_client_config(client_config, scopes=SCOPES, **kwargs)


def tokens_available() -> bool:
    return bool(CALENDAR_TOKENS.get("access_token"))


# -----------------------------
# Event CREATE request model
# -----------------------------
class CalendarEventCreate(BaseModel):
    title: str
    description: str = ""
    date: str              # YYYY-MM-DD
    start_time: str        # HH:MM
    duration_minutes: int  # Duration (minutes)


# -----------------------------
# Helpers
# -----------------------------
def build_datetime_rfc3339(date: str, time: str) -> str:
    """Convert YYYY-MM-DD + HH:MM → RFC3339 datetime with timezone"""
    return f"{date}T{time}:00+05:30"


def get_calendar_service():
    if not tokens_available():
        raise HTTPException(
            status_code=400,
            detail="Google Calendar not connected. Please connect in Settings.",
        )

    creds = Credentials(
        token=CALENDAR_TOKENS["access_token"],
        refresh_token=CALENDAR_TOKENS["refresh_token"],
        token_uri=CALENDAR_TOKENS["token_uri"],
        client_id=CALENDAR_TOKENS["client_id"],
        client_secret=CALENDAR_TOKENS["client_secret"],
        scopes=CALENDAR_TOKENS["scopes"].split()
        if CALENDAR_TOKENS.get("scopes")
        else SCOPES,
    )

    return build("calendar", "v3", credentials=creds)


# -----------------------------
# Status + OAuth URLs
# -----------------------------
@router.get("/status")
def google_calendar_status():
    return {"connected": tokens_available()}


@router.get("/auth-url")
def google_calendar_auth_url():
    global OAUTH_STATE

    flow = create_flow()
    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )

    OAUTH_STATE = state
    return {"auth_url": auth_url}


@router.get("/callback")
def google_calendar_callback(state: str = Query(...), code: str = Query(...)):
    global CALENDAR_TOKENS, OAUTH_STATE

    if OAUTH_STATE and state != OAUTH_STATE:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")

    flow = create_flow(state=state)
    flow.fetch_token(code=code)
    credentials = flow.credentials

    CALENDAR_TOKENS = {
        "access_token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": " ".join(credentials.scopes or []),
        "expiry": credentials.expiry.isoformat() if credentials.expiry else None,
    }

    OAUTH_STATE = None

    return RedirectResponse(url=f"{FRONTEND_BASE_URL}/settings")


# -----------------------------
# CREATE EVENT — FIXED VERSION
# -----------------------------
@router.post("/events")
def create_calendar_event(event: CalendarEventCreate):
    """
    Create a Google Calendar event with correct DATE + TIME + TIMEZONE.
    This prevents Google from placing it on today's date.
    """

    service = get_calendar_service()

    # Build start datetime
    start_dt_str = build_datetime_rfc3339(event.date, event.start_time)

    # Compute end datetime
    start_raw = datetime.strptime(
        f"{event.date} {event.start_time}", "%Y-%m-%d %H:%M"
    )
    end_raw = start_raw + timedelta(minutes=event.duration_minutes)
    end_time = end_raw.strftime("%H:%M")
    end_dt_str = build_datetime_rfc3339(event.date, end_time)

    event_body = {
        "summary": event.title,
        "description": event.description,
        "start": {
            "dateTime": start_dt_str,
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": end_dt_str,
            "timeZone": "Asia/Kolkata",
        },
    }

    created = service.events().insert(calendarId="primary", body=event_body).execute()

    return {
        "status": "success",
        "event_id": created.get("id"),
        "event_link": created.get("htmlLink"),
        "start": start_dt_str,
        "end": end_dt_str,
    }

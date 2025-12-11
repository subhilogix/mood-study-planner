from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date
from sqlmodel import Session, select
from .database import engine
from .models import Mood

scheduler = BackgroundScheduler()

def reset_daily_mood():
    """Runs every midnight to remove today's mood entry."""
    today = date.today()

    with Session(engine) as session:
        existing = session.exec(
            select(Mood).where(Mood.date == today)
        ).all()

        if existing:
            for mood in existing:
                session.delete(mood)
            session.commit()

    print("✔ Daily mood reset completed:", today)


def start_scheduler():
    """Start the background scheduler."""
    scheduler.add_job(reset_daily_mood, "cron", hour=0, minute=0)
    scheduler.start()

import os
from typing import Optional

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ----------------------------
# Configure Gemini
# ----------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    # This block requires indentation after the 'if' statement
    print("WARNING: GEMINI_API_KEY not found in .env — AI features will not work.")

genai.configure(api_key=GEMINI_API_KEY)

# Load Gemini model
model = genai.GenerativeModel("models/gemini-2.5-flash")


# -----------------------------------------------------
# Build short mood context to help the AI respond better
# -----------------------------------------------------
def build_mood_context_text(
    mood_label: Optional[str],
    mood_note: Optional[str],
    emotion_label: Optional[str],
    emotion_score: Optional[float]
) -> str:
    """
    Converts the user's latest mood entry into a readable text snippet
    for prompting the model.
    """
    # Block starts here
    if not (mood_label or mood_note or emotion_label):
        return "No recent mood entries are available."

    parts = []

    if mood_label:
        parts.append(f"Mood logged: {mood_label}")

    if mood_note:
        parts.append(f"Note: '{mood_note}'")

    if emotion_label:
        score_str = f"{emotion_score:.2f}" if emotion_score else "N/A"
        parts.append(f"Emotion detected: {emotion_label} (score {score_str})")

    return " | ".join(parts)


# -----------------------------------------------------
# Chat response generator — Study Buddy
# -----------------------------------------------------
def generate_study_wellness_reply(
    user_message: str,
    mood_context: Optional[str] = None
) -> str:
    """
    Generates a short, friendly, aligned Study Buddy chat reply.
    """
    # Block starts here
    SYSTEM_PROMPT = """
You are Study Buddy — a warm, concise academic support assistant.

Rules:
- Keep messages short (1–3 sentences).
- Friendly, supportive, never heavy or emotional.
- Give clear, simple study advice.
- Minimal emojis (0–1).
- Keep alignment clean; avoid long paragraphs.

Mood logic:
- If user seems stressed → encourage tiny steps.
- If neutral → give small structured guidance.
- If positive → encourage focus or small challenges.
"""

    if mood_context:
        SYSTEM_PROMPT += f"\nConsider this mood context: {mood_context}\n"

    prompt = f"""
{SYSTEM_PROMPT}

User: {user_message}
Assistant:
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        if not text:
            return "Let's take one small step. What would you like to work on? 😊"

        return text

    except Exception as e:
        print("Gemini API error:", e)
        return "I'm here with you. Let's try again in a simple step. 💜"


# -----------------------------------------------------
# Journal AI reflection generator
# -----------------------------------------------------
def generate_reflection_text(
    journal_text: str,
    emotion_label: Optional[str] = None
) -> str:
    """
    Generates a short reflective insight for a journal entry.
    Used after saving a journal entry.
    """
    # Block starts here
    SYSTEM_PROMPT = """
You are a gentle journal reflection assistant.
Your job is to provide a short, warm reflection (2–3 sentences max).

Rules:
- Never sound like therapy.
- Be encouraging and neutral.
- Offer a small insight or observation.
- If an emotion is provided, reflect on it softly.
- Tone should stay supportive, simple, and not too deep.
"""

    EMOTION_NOTE = (
        f"\nEmotion detected: {emotion_label}\n"
        if emotion_label else ""
    )

    prompt = f"""
{SYSTEM_PROMPT}

Journal Entry:
{journal_text}

{EMOTION_NOTE}

Write the reflection:
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        if not text:
            return "Thanks for writing that. It sounds meaningful. Keep noticing your thoughts gently."

        return text

    except Exception as e:
        print("Gemini API error (reflection):", e)
        return "Thanks for sharing. Keep being kind to yourself while you reflect. 🌿"
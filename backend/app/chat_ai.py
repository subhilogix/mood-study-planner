import os
from typing import Optional

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env — Chat AI will not work.")

# Configure Gemini client
genai.configure(api_key=GEMINI_API_KEY)

# Load Gemini model (fast + smart + affordable)
model = genai.GenerativeModel("models/gemini-2.5-flash")


# --------------------------------------------
# Build mood context text for prompt
# --------------------------------------------
def build_mood_context_text(
    mood_label: Optional[str],
    mood_note: Optional[str],
    emotion_label: Optional[str],
    emotion_score: Optional[float],
) -> str:
    """
    Convert the latest mood entry into short contextual text for the AI.
    """
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


# --------------------------------------------
# Generate short, clean Study Buddy response
# --------------------------------------------
def generate_study_wellness_reply(
    user_message: str,
    mood_context: Optional[str] = None,
) -> str:
    """
    Generate a short, friendly, study-support response using Gemini.
    """

    SYSTEM_PROMPT = """
You are Study Buddy — a friendly, concise academic support companion.

Guidelines:
- Keep responses short: 1–3 sentences max.
- Be warm, encouraging, and student-friendly.
- Avoid long paragraphs.
- Avoid overly emotional or heavy therapy-like responses.
- Keep tone light, supportive, and practical.
- Focus on study help, clarity, next steps, and simple explanations.
- Use simple language. No jargon.
- Use emojis sparingly (0–1 per message).
- Always reply in a clean, aligned format for chat bubbles.

Mood rules:
- If mood = stressed/tired/sad → be gentle, suggest small steps.
- If mood = neutral → give simple structured guidance.
- If mood = positive → suggest focused sessions or small challenges.
"""

    # Build full prompt
    if mood_context:
        SYSTEM_PROMPT += f"\nUse this mood context: {mood_context}\n"

    prompt = f"""
{SYSTEM_PROMPT}

User: {user_message}
Assistant:
"""

    # Gemini call
    try:
        response = model.generate_content(prompt)
        reply = response.text.strip()

        # Safety fallback
        if not reply:
            return (
                "Let's keep it simple. Try picking one small task to start with. "
                "What would you like to focus on first?"
            )

        return reply

    except Exception as e:
        print("Gemini API error:", e)
        return "I'm here for you. Let's try again with one small step. 💜"

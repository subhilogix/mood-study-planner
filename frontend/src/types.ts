// =====================================
//              MOOD
// =====================================

export interface MoodEntry {
  id: number;
  date: string;                     // YYYY-MM-DD
  mood: string;
  note?: string | null;

  // Emotion ML fields
  emotion_label?: string | null;
  emotion_score?: number | null;

  created_at: string;               // ISO timestamp
}


// =====================================
//              TASKS
// =====================================

export interface Task {
  id: number;
  title: string;
  description?: string | null;

  // NEW — backend uses due_datetime
  due_datetime?: string | null;     // ISO datetime like "2025-01-12T14:30"

  is_completed: boolean;
  mood_tag?: string | null;

  created_at: string;
  updated_at: string;
}


// =====================================
//              JOURNAL
// =====================================

export interface JournalEntry {
  id: number;
  date: string;                     // YYYY-MM-DD
  content: string;

  mood_id?: number | null;

  // Emotion model results
  emotion_label?: string | null;
  emotion_score?: number | null;

  created_at: string;

  // NEW FIELDS — AI features
  is_favorite: boolean;
  ai_reflection?: string | null;
}


// =====================================
//              EMOTION
// =====================================

export interface EmotionResponse {
  label: string;
  score: number;
}


// =====================================
//              CHAT
// =====================================

export interface ChatResponse {
  reply: string;
  mood_context?: string | null;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  createdAt: string;                // ISO timestamp
}
export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

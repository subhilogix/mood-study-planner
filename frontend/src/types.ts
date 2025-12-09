export interface MoodEntry {
  id: number;
  date: string;
  mood: string;
  note?: string | null;
  emotion_label?: string | null;
  emotion_score?: number | null;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  due_date?: string | null;
  is_completed: boolean;
  mood_tag?: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  content: string;
  mood_id?: number | null;
  emotion_label?: string | null;
  emotion_score?: number | null;
  created_at: string;
}

export interface EmotionResponse {
  label: string;
  score: number;
}

export interface ChatResponse {
  reply: string;
  mood_context?: string | null;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  createdAt: string;
}

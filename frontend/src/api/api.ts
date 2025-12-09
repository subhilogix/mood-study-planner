import {
  EmotionResponse,
  JournalEntry,
  MoodEntry,
  Task,
  ChatResponse
} from "../types";

const BASE_URL = "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }
  return res.json() as Promise<T>;
}

export const api = {
  // ------------------------------
  // HEALTH
  // ------------------------------
  async health(): Promise<{ status: string }> {
    const res = await fetch(`${BASE_URL}/health`);
    return handleResponse(res);
  },

  // ------------------------------
  // MOODS
  // ------------------------------
  async getMoods(): Promise<MoodEntry[]> {
    const res = await fetch(`${BASE_URL}/mood/`);
    return handleResponse(res);
  },

  async createMood(payload: {
    date: string;
    mood: string;
    note?: string;
    emotion_label?: string;
    emotion_score?: number;
  }): Promise<MoodEntry> {
    const res = await fetch(`${BASE_URL}/mood/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // ------------------------------
  // TASKS
  // ------------------------------
  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${BASE_URL}/tasks/`);
    return handleResponse(res);
  },

  async createTask(payload: {
    title: string;
    description?: string;
    due_date?: string | null;
    mood_tag?: string | null;
  }): Promise<Task> {
    const res = await fetch(`${BASE_URL}/tasks/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async updateTask(
    id: number,
    payload: Partial<
      Pick<Task, "title" | "description" | "due_date" | "mood_tag" | "is_completed">
    >
  ): Promise<Task> {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // ------------------------------
  // JOURNAL
  // ------------------------------
  async getJournal(): Promise<JournalEntry[]> {
    const res = await fetch(`${BASE_URL}/journal/`);
    return handleResponse(res);
  },

  async createJournal(payload: {
    date: string;
    content: string;
    mood_id?: number | null;
    emotion_label?: string;
    emotion_score?: number;
  }): Promise<JournalEntry> {
    const res = await fetch(`${BASE_URL}/journal/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // ------------------------------
  // EMOTION ANALYSIS
  // ------------------------------
  async analyzeEmotion(text: string): Promise<EmotionResponse> {
    const res = await fetch(`${BASE_URL}/emotion/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    return handleResponse(res);
  },

  // ------------------------------
  // GOOGLE CALENDAR
  // ------------------------------
  async getGoogleCalendarStatus(): Promise<{ connected: boolean }> {
    const res = await fetch(`${BASE_URL}/google-calendar/status`);
    return handleResponse(res);
  },

  async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
    const res = await fetch(`${BASE_URL}/google-calendar/auth-url`);
    return handleResponse(res);
  },
    async deleteTask(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete task");
    }
  },


  // ⭐ UPDATED TO MATCH NEW BACKEND ⭐
  async createCalendarEvent(payload: {
    title: string;
    description: string;
    date: string;               // "YYYY-MM-DD"
    start_time: string;         // "HH:MM"
    duration_minutes: number;   // number of minutes
  }): Promise<{
    status: string;
    event_id: string;
    event_link: string;
    start: string;
    end: string;
  }> {
    const res = await fetch(`${BASE_URL}/google-calendar/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // ------------------------------
  // CHAT
  // ------------------------------
  async chat(message: string): Promise<ChatResponse> {
    const res = await fetch(`${BASE_URL}/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    return handleResponse(res);
  }
};

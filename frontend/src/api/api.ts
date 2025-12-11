import {
  EmotionResponse,
  JournalEntry,
  MoodEntry,
  Task,
  ChatResponse,
} from "../types";

const BASE_URL = "http://localhost:8000";

// ------------------------------
// TOKEN STORAGE
// ------------------------------
const TOKEN_KEY = "mindstudy_token";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }
  return res.json() as Promise<T>;
}

// =====================================================
// API OBJECT
// =====================================================
export const api = {
  // ------------------------------
  // AUTH
  // ------------------------------
  async signup(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async login(email: string, password: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse<{ access_token: string }>(res);
    localStorage.setItem(TOKEN_KEY, data.access_token);

    return { success: true };
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { ...authHeader() },
    });
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
      body: JSON.stringify(payload),
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
    description?: string | null;
    due_datetime?: string | null;
    mood_tag?: string | null;
  }): Promise<Task> {
    const res = await fetch(`${BASE_URL}/tasks/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async updateTask(
    id: number,
    payload: Partial<
      Pick<
        Task,
        "title" | "description" | "due_datetime" | "mood_tag" | "is_completed"
      >
    >
  ): Promise<Task> {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteTask(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(await res.text());
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
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteJournal(id: number) {
    const res = await fetch(`${BASE_URL}/journal/${id}`, {
      method: "DELETE",
    });
    return handleResponse(res);
  },

  async updateJournal(id: number, data: any) {
    const res = await fetch(`${BASE_URL}/journal/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async reflectOnJournal(id: number): Promise<{ reflection: string }> {
    const res = await fetch(`${BASE_URL}/journal/${id}/reflect`, {
      method: "POST",
    });
    return handleResponse(res);
  },

  // ------------------------------
  // EMOTION ANALYSIS  ✅ THIS WAS MISSING
  // ------------------------------
  async analyzeEmotion(text: string): Promise<EmotionResponse> {
    const res = await fetch(`${BASE_URL}/emotion/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return handleResponse(res);
  },

  // ------------------------------
  // GOOGLE CALENDAR (correct backend paths)
  // ------------------------------
  async getGoogleCalendarStatus(): Promise<{ connected: boolean }> {
    const res = await fetch(`${BASE_URL}/google-calendar/status`);
    return handleResponse(res);
  },

  async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
    const res = await fetch(`${BASE_URL}/google-calendar/auth-url`);
    return handleResponse(res);
  },

  async disconnectGoogleCalendar(): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/google-calendar/disconnect`, {
    method: "POST",
    headers: { ...authHeader() }
  });
  return handleResponse(res);
},


  async createCalendarEvent(payload: {
    title: string;
    description: string;
    date: string;
    start_time: string;
    duration_minutes: number;
  }) {
    const res = await fetch(`${BASE_URL}/google-calendar/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      body: JSON.stringify({ message }),
    });
    return handleResponse(res);
  },
};

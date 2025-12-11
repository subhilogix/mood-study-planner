import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import { api } from "../api/api";
import { ChatMessage, JournalEntry, MoodEntry, Task } from "../types";

interface AppContextValue {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  moods: MoodEntry[];
  tasks: Task[];
  journal: JournalEntry[];
  loading: boolean;
  calendarConnected: boolean;

  refreshAll: () => void;

  addMood: (mood: string, note?: string) => Promise<void>;
  addTask: (data: {
    title: string;
    description?: string;
    due_datetime?: string | null;
    mood_tag?: string | null;
  }) => Promise<void>;

  toggleTaskCompleted: (id: number) => Promise<void>;

  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("mindstudy_token");
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await api.login(email, password);

      if (result.success) {
        setIsLoggedIn(true);
        return true;
      }
      return false;

    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("mindstudy_token");
    setIsLoggedIn(false);
  };

  // DATA STATES
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // FETCH ALL DATA
  const refreshAll = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const [moodsRes, tasksRes, journalRes, calStatus] = await Promise.all([
        api.getMoods(),
        api.getTasks(),
        api.getJournal(),
        api.getGoogleCalendarStatus().catch(() => ({ connected: false }))
      ]);

      setMoods(moodsRes);
      setTasks(tasksRes);
      setJournal(journalRes);
      setCalendarConnected(calStatus.connected);
    } catch (e) {
      console.error("Failed to load data:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) refreshAll();
  }, [isLoggedIn]);

  // MOODS
  const addMood = async (mood: string, note?: string) => {
    const today = new Date().toISOString().slice(0, 10);

    let emotion;
    if (note) {
      try {
        emotion = await api.analyzeEmotion(note);
      } catch {}
    }

    const created = await api.createMood({
      date: today,
      mood,
      note,
      emotion_label: emotion?.label,
      emotion_score: emotion?.score
    });

    setMoods((prev) => [created, ...prev]);
  };

  // TASKS
  const addTask = async (data: {
    title: string;
    description?: string;
    due_datetime?: string | null;
    mood_tag?: string | null;
  }) => {
    const created = await api.createTask(data);
    setTasks((prev) => [created, ...prev]);
  };

  const toggleTaskCompleted = async (id: number) => {
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return;

    const updated = await api.updateTask(id, {
      is_completed: !existing.is_completed
    });

    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  // CHAT
  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      createdAt: new Date().toISOString()
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const res = await api.chat(text);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "assistant",
          text: res.reply,
          createdAt: new Date().toISOString()
        }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "assistant",
          text: "AI is currently offline.",
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,

        moods,
        tasks,
        journal,
        loading,
        calendarConnected,

        refreshAll,
        addMood,
        addTask,
        toggleTaskCompleted,

        chatMessages,
        sendChatMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be inside AppProvider");
  return ctx;
};

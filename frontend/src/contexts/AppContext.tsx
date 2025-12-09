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
  moods: MoodEntry[];
  tasks: Task[];
  journal: JournalEntry[];
  loading: boolean;
  calendarConnected: boolean;

  // Actions
  refreshAll: () => void;
  addMood: (
    mood: string,
    note?: string
  ) => Promise<void>;
  addTask: (data: {
    title: string;
    description?: string;
    due_date?: string | null;
    mood_tag?: string | null;
  }) => Promise<void>;
  toggleTaskCompleted: (id: number) => Promise<void>;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const refreshAll = async () => {
    try {
      setLoading(true);
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
    } catch (err) {
      console.error("Failed initial load", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const addMood = async (mood: string, note?: string) => {
    const today = new Date().toISOString().slice(0, 10);
    let emotion;
    if (note && note.trim().length > 0) {
      try {
        emotion = await api.analyzeEmotion(note);
      } catch (err) {
        console.error("Emotion analysis failed", err);
      }
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

  const addTask = async (data: {
    title: string;
    description?: string;
    due_date?: string | null;
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
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        text: res.reply,
        createdAt: new Date().toISOString()
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallback: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        text:
          "I’m having trouble reaching the MindStudy brain right now, but you can still try a tiny step: pick one simple topic and focus for 15 minutes. 🌱",
        createdAt: new Date().toISOString()
      };
      setChatMessages((prev) => [...prev, fallback]);
    }
  };

  const value: AppContextValue = {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

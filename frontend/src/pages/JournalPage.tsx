import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../api/api";
import JournalEntryCard from "../components/journal/JournalEntryCard";
import { JournalEntry } from "../types";

// --- DARK MODE COLOR DEFINITIONS (Re-defined for clarity) ---
// Card Background (Main White Cards): Lighter than app background
const CARD_BG_DARK = "dark:bg-[#2C2435]"; 
// Card Background (Soft/Accent Cards/Buttons): Lighter than main cards
const CARD_SOFT_BG_DARK = "dark:bg-[#362C47]";
// Text Color: Bright white for main content
const TEXT_BRIGHT = "dark:text-white"; 
// Text Color: Bright, slightly muted purple for titles/labels
const TEXT_MUTED_PURPLE = "dark:text-[#D9C8FF]"; 
// Muted text for descriptions
const TEXT_MUTED = "dark:text-[#B8A2E0]";
// Border color for inputs/dividers
const BORDER_DARK = "dark:border-[#4A3C60]";
// Background for input fields (Soft background)
const INPUT_BG_DARK = "dark:bg-[#362C47]";
// Text color for input fields
const INPUT_TEXT_DARK = "dark:text-white";
//-------------------------------------------------------------

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadEntries = async () => {
    setLoading(true);
    const data = await api.getJournal();
    // Sort by ID descending to show latest first
    setEntries(data.sort((a, b) => b.id - a.id)); 
    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSaving(true);

    // 1 - call ML for emotion
    const emotion = await api.analyzeEmotion(content);

    // 2 - Save journal entry
    await api.createJournal({
      date,
      content,
      emotion_label: emotion.label,
      emotion_score: emotion.score,
    });

    setContent("");
    setSaving(false);
    loadEntries();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold text-mind-textMain ${TEXT_MUTED_PURPLE} drop-shadow-sm flex items-center gap-2`}>
          Reflect & Journal
        </h1>
        <p className={`text-sm text-mind-textSoft ${TEXT_MUTED} mt-1`}>
          Write freely. MindStudy gently analyzes your emotional tone using ML.
        </p>
      </div>

      {/* Write Entry Card */}
      <Card className={CARD_BG_DARK}>
        <CardHeader>
          <CardTitle className={TEXT_BRIGHT}>New Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Input is assumed to handle dark mode via shared component (but included classes for safety) */}
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className={`${INPUT_BG_DARK} ${INPUT_TEXT_DARK} ${BORDER_DARK}`} // Added dark theme classes
            />

            {/* Textarea - Custom styling applied here */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Today I felt..."
              className={`w-full min-h-[120px] rounded-xl border border-mind-border bg-mind-bg p-3 text-sm text-mind-textMain focus:ring-1 focus:ring-mind-primary 
                ${INPUT_BG_DARK} ${INPUT_TEXT_DARK} ${BORDER_DARK} placeholder:${TEXT_MUTED}`} // Added dark theme classes
            ></textarea>

            {/* Button is assumed to handle dark mode via shared component */}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Entry"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* History Card (Your Entries) */}
      {/* Used the softer background for the outer container holding the list */}
      <Card className={CARD_SOFT_BG_DARK}> 
        <CardHeader>
          <CardTitle className={TEXT_BRIGHT}>Your Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className={`text-sm text-mind-textSoft ${TEXT_MUTED}`}>Loading…</p>
          ) : entries.length === 0 ? (
            <p className={`text-sm text-mind-textSoft ${TEXT_MUTED}`}>Nothing written yet.</p>
          ) : (
            // JournalEntryCard already updated to handle dark mode
            entries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} onUpdated={loadEntries} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalPage;
import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { api } from "../api/api";

const JournalPage: React.FC = () => {
  const { journal, moods } = useAppContext();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const latestMood = moods[0];
      await api.createJournal({
        date: today,
        content: text.trim(),
        mood_id: latestMood?.id ?? null
      });
      setText("");
      // optional: we could call refreshAll, but leaving simple for now
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-mind-textMain">
          Gentle Journal
        </h1>
        <p className="text-sm text-mind-textSoft">
          A soft place to pour thoughts without judgment. No rules, no grades.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Write a few kind words to yourself</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={5}
            placeholder="You can write about your day, your feelings, or nothing specific at all..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save entry"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-mind-cardSoft">
        <CardHeader>
          <CardTitle>Recent entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-mind-textSoft">
          {journal.length === 0 && (
            <p className="text-xs text-mind-textMuted">
              No entries yet. You can start with just one sentence.
            </p>
          )}
          {journal.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl bg-white/70 p-3 border border-mind-border"
            >
              <div className="mb-1 text-[11px] text-mind-textMuted">
                {entry.date}
              </div>
              <p className="text-sm text-mind-textMain whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalPage;

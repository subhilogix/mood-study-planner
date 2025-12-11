import React, { useState } from "react";
import { Button } from "../ui/Button";
import { useAppContext } from "../../contexts/AppContext";
import { Textarea } from "../ui/Textarea";

const moods = [
  { id: "sad", label: "Sad", emoji: "😢" },
  { id: "okay", label: "Okay", emoji: "🙂" },
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "stressed", label: "Stressed", emoji: "😖" }
];

const MoodSelector: React.FC = () => {
  const { addMood } = useAppContext();
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleSave = async () => {
    if (!selected) return;
    await addMood(selected, note.trim() || undefined);
    setNote("");
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-mind-textSoft">
        How are you arriving to your study session today?
      </p>
      <div className="flex flex-wrap gap-2">
        {moods.map((m) => (
          <Button
            key={m.id}
            size="sm"
            variant={selected === m.id ? "primary" : "outline"}
            onClick={() => setSelected(m.id)}
          >
            <span className="mr-1">{m.emoji}</span>
            {m.label}
          </Button>
        ))}
      </div>
      {/* <Textarea
        rows={3}
        placeholder="Optional: add a tiny note about your mood..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      /> */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={!selected}
        >
          Save mood
        </Button>
      </div>
    </div>
  );
};

export default MoodSelector;

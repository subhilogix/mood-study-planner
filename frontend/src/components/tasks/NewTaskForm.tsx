import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { useAppContext } from "../../contexts/AppContext";

const NewTaskForm: React.FC = () => {
  const { addTask } = useAppContext();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [moodTag, setMoodTag] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask({
      title: title.trim(),
      description: desc.trim() || undefined,
      due_date: due || null,
      mood_tag: moodTag || null
    });
    setTitle("");
    setDesc("");
    setDue("");
    setMoodTag("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="Name your task gently (e.g., revise Chapter 3)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        rows={2}
        placeholder="Optional: add a short description..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs text-mind-textSoft">
            Soft due date
          </label>
          <Input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs text-mind-textSoft">
            Energy tag
          </label>
          <Select
            value={moodTag}
            onChange={(e) => setMoodTag(e.target.value)}
          >
            <option value="">Choose...</option>
            <option value="low_energy">Low energy</option>
            <option value="medium_focus">Medium focus</option>
            <option value="high_focus">High focus</option>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Add task</Button>
      </div>
    </form>
  );
};

export default NewTaskForm;

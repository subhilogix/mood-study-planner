import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { useAppContext } from "../../contexts/AppContext";

const NewTaskForm: React.FC = () => {
  const { addTask } = useAppContext();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [moodTag, setMoodTag] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let due_datetime: string | null = null;

    if (date) {
      due_datetime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
    }

    await addTask({
      title: title.trim(),
      description: undefined,
      due_datetime,
      mood_tag: moodTag || null
    });

    setTitle("");
    setDate("");
    setTime("");
    setMoodTag("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="
          bg-white dark:bg-[#2C2435]
          border-mind-border dark:border-[#4A3C60]
          text-mind-textMain dark:text-[#E9DFFF]
          placeholder:text-mind-textMuted dark:placeholder:text-[#C9B5E8]
        "
      />

      {/* Date + Time */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-1">
          <label className="text-xs text-mind-textSoft dark:text-[#C9B5E8]">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              bg-white dark:bg-[#2C2435]
              border-mind-border dark:border-[#4A3C60]
              text-mind-textMain dark:text-[#E9DFFF]
              placeholder:text-mind-textMuted dark:placeholder:text-[#C9B5E8]
            "
          />
        </div>

        <div className="flex-1 space-y-1">
          <label className="text-xs text-mind-textSoft dark:text-[#C9B5E8]">
            Time
          </label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="
              bg-white dark:bg-[#2C2435]
              border-mind-border dark:border-[#4A3C60]
              text-mind-textMain dark:text-[#E9DFFF]
              placeholder:text-mind-textMuted dark:placeholder:text-[#C9B5E8]
            "
          />
        </div>
      </div>

      {/* Energy Tag */}
      <div className="space-y-1">
        <label className="text-xs text-mind-textSoft dark:text-[#C9B5E8]">
          Energy Tag
        </label>

        <Select
  value={moodTag}
  onChange={(e) => setMoodTag(e.target.value)}
  className="
    rounded-full
    bg-white dark:bg-[#2C2435]
    border-mind-border dark:border-[#4A3C60]
    text-mind-textMain dark:text-[#E9DFFF]
    placeholder:text-mind-textMuted dark:placeholder:text-[#C9B5E8]
    py-2
  "
>
  <option value="">Choose…</option>
  <option value="low_energy">Low Energy</option>
  <option value="medium_focus">Medium Focus</option>
  <option value="high_focus">High Focus</option>
</Select>

      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="
            bg-mind-primaryDeep dark:bg-[#7A5BDB]
            text-mind-textMain dark:text-white 
            hover:opacity-90
          "
        >
          Add Task
        </Button>
      </div>
    </form>
  );
};

export default NewTaskForm;

import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Task } from "../../types";
import { api } from "../../api/api";
import { Trash2 } from "lucide-react";

// Format datetime
function formatDateTime(iso: string) {
  try {
    const dt = new Date(iso);
    return dt.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch {
    return iso;
  }
}

const TaskList: React.FC = () => {
  const { tasks, toggleTaskCompleted } = useAppContext();

  const pending = tasks.filter((t) => !t.is_completed);
  const completed = tasks.filter((t) => t.is_completed);

  const addToCalendar = async (task: Task) => {
    try {
      let date = "";
      let start_time = "";

      if (task.due_datetime) {
        const dt = new Date(task.due_datetime);
        date = dt.toISOString().split("T")[0];
        start_time = `${String(dt.getHours()).padStart(2, "0")}:${String(
          dt.getMinutes()
        ).padStart(2, "0")}`;
      } else {
        date = task.due_datetime || new Date().toISOString().split("T")[0];
        const now = new Date();
        start_time = `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;
      }

      const duration_minutes = 25;

      const res = await api.createCalendarEvent({
        title: task.title,
        description:
          task.description ||
          "Study session created from Mood Study Planner task.",
        date,
        start_time,
        duration_minutes
      });

      if ((res as any).event_link) window.open((res as any).event_link, "_blank");
      else alert("Event created in Google Calendar.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Could not create Google Calendar event.");
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!window.confirm("Remove this task from your planner?")) return;

    try {
      await api.deleteTask(taskId);
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Could not remove task.");
    }
  };

  // RENDER GROUP
  const renderGroup = (label: string, list: Task[]) => (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide 
          text-mind-textSoft dark:text-[#C9B5E8]">
          {label}
        </span>
        <span className="text-xs text-mind-textMuted dark:text-[#A795C9]">
          {list.length}
        </span>
      </div>

      {/* Container */}
      <div className="
        rounded-2xl 
        bg-mind-cardSoft/60 
        dark:bg-[#1F1B24] 
        border border-mind-border/40 
        dark:border-[#3A314D]
        p-3 space-y-3 min-h-[120px]
      ">
        {list.map((task) => (
          <Card
            key={task.id}
            className="
              w-full 
              bg-[#f9f5f0] 
              dark:bg-[#251f2f] 
              border-mind-border/70 
              dark:border-[#3A314D]
              rounded-2xl shadow-sm
            "
          >
            {/* Header */}
            <CardHeader className="pb-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <CardTitle
                  className="text-sm text-mind-textMain dark:text-[#E9DFFF]"
                >
                  {task.title}
                </CardTitle>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={task.is_completed ? "outline" : "primary"}
                    onClick={() => toggleTaskCompleted(task.id)}
                    className="
                      text-xs dark:border-[#4A3C60] 
                      dark:text-white dark:bg-[#7A5BDB55]
                    "
                  >
                    {task.is_completed ? "Mark as not done" : "Mark done"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCalendar(task)}
                    className="
                      text-xs 
                      dark:border-[#4A3C60] 
                      dark:text-[#D9C8FF]
                    "
                  >
                    Add to Calendar
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="
                      text-xs text-red-500 hover:text-red-600
                      dark:hover:text-red-400
                    "
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Body */}
            <CardContent className="pt-1">
              {task.description && (
                <p className="text-xs text-mind-textSoft dark:text-[#C9B5E8] mb-2">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 text-[11px]">
                {task.due_datetime && (
                  <span
                    className="
                      rounded-full bg-white/70 
                      dark:bg-[#3A314D] 
                      dark:text-[#D9C8FF]
                      px-2 py-0.5 border border-mind-border/60 
                      dark:border-[#4A3C60]
                    "
                  >
                    Due {formatDateTime(task.due_datetime)}
                  </span>
                )}

                {!task.due_datetime && task.due_datetime && (
                  <span
                    className="
                      rounded-full bg-white/70 
                      dark:bg-[#3A314D] 
                      dark:text-[#D9C8FF]
                      px-2 py-0.5 border border-mind-border/60 
                      dark:border-[#4A3C60]
                    "
                  >
                    Soft due {task.due_datetime}
                  </span>
                )}

                {task.mood_tag && (
                  <span
                    className="
                      rounded-full bg-mind-primary/30 px-2 py-0.5 
                      text-mind-textMain dark:text-[#E9DFFF] 
                      dark:bg-[#7A5BDB33]
                    "
                  >
                    {task.mood_tag.replace("_", " ")}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty state */}
        {list.length === 0 && (
          <p className="text-xs text-mind-textMuted dark:text-[#A795C9]">
            Nothing here yet. Add a tiny task when you're ready.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {renderGroup("Active Tasks", pending)}
      {renderGroup("Completed", completed)}
    </div>
  );
};

export default TaskList;

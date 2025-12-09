import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Task } from "../../types";
import { api } from "../../api/api";
import { Trash2 } from "lucide-react";

const TaskList: React.FC = () => {
  const { tasks, toggleTaskCompleted } = useAppContext();

  const pending = tasks.filter((t) => !t.is_completed);
  const completed = tasks.filter((t) => t.is_completed);

  // ---- Add to Google Calendar (fixed version) ----
  const addToCalendar = async (task: Task) => {
    try {
      const date = task.due_date
        ? task.due_date
        : new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const start_time = `${hh}:${mm}`;
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

      if (res.event_link) {
        window.open(res.event_link, "_blank");
      } else {
        alert("Event created in Google Calendar.");
      }
    } catch (err: any) {
      console.error(err);
      alert(
        err.message ||
          "Could not create calendar event. Check Google Calendar connection in Settings."
      );
    }
  };

  // ---- Delete task ----
  const deleteTask = async (taskId: number) => {
    const confirm = window.confirm("Remove this task from your planner?");
    if (!confirm) return;

    try {
      await api.deleteTask(taskId);
      // simplest reliable refresh for now
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Could not remove task.");
    }
  };

  const renderGroup = (label: string, list: Task[]) => (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-mind-textSoft">
          {label}
        </span>
        <span className="text-xs text-mind-textMuted">{list.length}</span>
      </div>

      <div className="rounded-2xl bg-mind-cardSoft/60 p-3 space-y-3 min-h-[120px]">
        {list.map((task) => (
          <Card
            key={task.id}
            className="w-full bg-[#f9f5f0] border-mind-border/70 rounded-2xl shadow-sm"
          >
            <CardHeader className="pb-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <CardTitle className="text-sm text-mind-textMain">
                  {task.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                  <Button
                    size="sm"
                    variant={task.is_completed ? "outline" : "primary"}
                    onClick={() => toggleTaskCompleted(task.id)}
                    className="text-xs"
                  >
                    {task.is_completed ? "Mark as not done" : "Mark done"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCalendar(task)}
                    className="text-xs"
                  >
                    Add to Calendar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              {task.description && (
                <p className="text-xs text-mind-textSoft mb-2">
                  {task.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-[11px] text-mind-textMuted">
                {task.due_date && (
                  <span className="rounded-full bg-white/70 px-2 py-0.5 border border-mind-border/70">
                    Soft due {task.due_date}
                  </span>
                )}
                {task.mood_tag && (
                  <span className="rounded-full bg-mind-primary/30 px-2 py-0.5 text-mind-textMain">
                    {task.mood_tag.replace("_", " ")}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {list.length === 0 && (
          <p className="text-xs text-mind-textMuted">
            Nothing here yet. Add a tiny task when you&apos;re ready.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {renderGroup("Active tasks", pending)}
      {renderGroup("Completed", completed)}
    </div>
  );
};

export default TaskList;

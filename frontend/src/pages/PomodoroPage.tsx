import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAppContext } from "../contexts/AppContext";
import { X, ListTodo } from "lucide-react";

type Mode = "work" | "break";

const PomodoroPage: React.FC = () => {
  const { tasks } = useAppContext();

  const [mode, setMode] = useState<Mode>("work");
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(1);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [customTask, setCustomTask] = useState("");
  const [activeTask, setActiveTask] = useState<string>("No task selected yet");

  // Whenever mode or durations change and timer is not running, reset secondsLeft
  useEffect(() => {
    if (isRunning) return;
    if (mode === "work") {
      setSecondsLeft(workMinutes * 60);
    } else {
      setSecondsLeft(breakMinutes * 60);
    }
  }, [mode, workMinutes, breakMinutes, isRunning]);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Session finished
          if (mode === "work") {
            setMode("break");
            return breakMinutes * 60;
          } else {
            setMode("work");
            setCycle((prevCycle) => prevCycle + 1);
            return workMinutes * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, workMinutes, breakMinutes]);

  const formattedTime = () => {
    const mins = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const secs = (secondsLeft % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode("work");
    setCycle(1);
    setSecondsLeft(workMinutes * 60);
  };

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const progress =
    totalSeconds > 0
      ? Math.min(
          100,
          Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100)
        )
      : 0;

  const modeLabel = mode === "work" ? "Focus session" : "Break time";
  const modeHint =
    mode === "work"
      ? "Gently focus on your chosen task. No need to be perfect."
      : "Rest, stretch, or breathe. Your brain is still working for you.";

  const openTaskModal = () => {
    setShowTaskModal(true);
    setSelectedTaskId(null);
    setCustomTask("");
  };

  const confirmTaskSelection = () => {
    if (customTask.trim()) {
      setActiveTask(customTask.trim());
    } else if (selectedTaskId != null) {
      const t = tasks.find((t) => t.id === selectedTaskId);
      if (t) setActiveTask(t.title);
    }
    setShowTaskModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-mind-textMain flex items-center gap-2">
          <span className="text-3xl">⏱️</span>
          Gentle Focus Timer
        </h1>
        <p className="text-sm text-mind-textSoft">
          Short, kind sprints that respect your energy—no pressure, just
          presence.
        </p>
      </div>

      {/* Main Pomodoro Card */}
      <Card className="bg-white/90">
        <CardHeader className="pb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Pomodoro Session</CardTitle>
            <p className="text-xs text-mind-textSoft">
              Adjust your session, pick a task, and start a gentle focus block.
            </p>
          </div>

          {/* Duration Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-mind-textSoft">Focus (mins)</span>
              <Input
                type="number"
                min={1}
                max={90}
                value={workMinutes}
                onChange={(e) =>
                  setWorkMinutes(Math.max(1, Number(e.target.value) || 1))
                }
                disabled={isRunning}
                className="w-16 h-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-mind-textSoft">Break (mins)</span>
              <Input
                type="number"
                min={1}
                max={60}
                value={breakMinutes}
                onChange={(e) =>
                  setBreakMinutes(Math.max(1, Number(e.target.value) || 1))
                }
                disabled={isRunning}
                className="w-16 h-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-mind-textSoft">Cycle</span>
              <span className="rounded-full bg-mind-cardSoft px-2 py-0.5 text-[11px] text-mind-textMain">
                {cycle}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-[1.4fr,1.6fr] items-center">
          {/* Left: Timer */}
          <div className="flex flex-col items-center gap-4">
            {/* Progress circle */}
            <div className="relative flex items-center justify-center">
              <div
                className="flex items-center justify-center rounded-full shadow-soft"
                style={{
                  width: "190px",
                  height: "190px",
                  background: `conic-gradient(#C7B3F0 ${progress *
                    3.6}deg, #F3EDE4 ${progress * 3.6}deg)`,
                }}
              >
                <div className="flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full bg-mind-bg border border-mind-border/70">
                  <div className="text-xs uppercase tracking-wide text-mind-textSoft">
                    {modeLabel}
                  </div>
                  <div className="mt-1 text-3xl font-semibold text-mind-textMain">
                    {formattedTime()}
                  </div>
                  <div className="mt-1 text-[11px] text-mind-textMuted">
                    Cycle {cycle}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <Button
                onClick={() => setIsRunning((prev) => !prev)}
                variant="primary"
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>

            <p className="text-xs text-mind-textSoft text-center max-w-xs">
              {modeHint}
            </p>
          </div>

          {/* Right: Active task & info */}
          <div className="space-y-4">
            {/* Active Task */}
            <div className="rounded-2xl border border-mind-border bg-mind-cardSoft px-4 py-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-mind-textSoft">
                  Active task
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-1 text-xs"
                  type="button"
                  onClick={openTaskModal}
                >
                  <ListTodo className="h-3 w-3" />
                  Choose task
                </Button>
              </div>
              <p className="text-sm text-mind-textMain">
                {activeTask || "No task selected yet"}
              </p>
              <p className="mt-1 text-[11px] text-mind-textMuted">
                This is the task MindStudy will gently nudge you to focus on
                during this session.
              </p>
            </div>

            {/* Info block */}
            <div className="rounded-2xl border border-mind-border bg-mind-bg px-4 py-3 text-xs text-mind-textSoft space-y-1">
              <p>
                • Try doing just <span className="font-semibold">one</span> full
                focus block before judging your productivity.
              </p>
              <p>
                • If you feel overwhelmed, it&apos;s okay to pause or shorten
                the session—your well-being matters more than the timer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal for selecting/creating task */}
      {showTaskModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-soft border border-mind-border">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-mind-textMain">
                Choose or create a task
              </h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-mind-textSoft hover:text-mind-textMain"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
              <p className="text-xs text-mind-textSoft">
                Pick from tasks you&apos;ve already added in the Planner, or
                create a new one just for this session.
              </p>

              {tasks.length === 0 && (
                <p className="text-xs text-mind-textMuted">
                  You don&apos;t have any tasks yet. You can create one below or
                  add tasks from the Planner page.
                </p>
              )}

              {tasks.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-mind-textSoft">
                    Existing tasks
                  </div>
                  <div className="space-y-1">
                    {tasks.map((t) => (
                      <label
                        key={t.id}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-mind-border bg-mind-cardSoft px-2 py-1 text-xs text-mind-textMain hover:bg-mind-primary/20"
                      >
                        <input
                          type="radio"
                          name="task"
                          value={t.id}
                          checked={selectedTaskId === t.id}
                          onChange={() => setSelectedTaskId(t.id)}
                        />
                        <div>
                          <div className="font-medium">{t.title}</div>
                          {t.description && (
                            <div className="text-[11px] text-mind-textSoft">
                              {t.description}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-mind-border/60 space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-mind-textSoft">
                  Or create a new focus task
                </div>
                <Input
                  placeholder="e.g., Revise Unit 3, write summary notes"
                  value={customTask}
                  onChange={(e) => {
                    setCustomTask(e.target.value);
                    if (selectedTaskId !== null) setSelectedTaskId(null);
                  }}
                />
                <p className="text-[11px] text-mind-textMuted">
                  This won&apos;t overwrite your Planner tasks. It&apos;s just
                  for this session.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setShowTaskModal(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                type="button"
                onClick={confirmTaskSelection}
              >
                Use this task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroPage;

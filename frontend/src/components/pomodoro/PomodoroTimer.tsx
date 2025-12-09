import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

const PomodoroTimer: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (mode === "work") {
            setMode("break");
            return BREAK_MINUTES * 60;
          } else {
            setMode("work");
            return WORK_MINUTES * 60;
          }
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, mode]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const reset = () => {
    setMode("work");
    setSecondsLeft(WORK_MINUTES * 60);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-full border border-mind-border bg-mind-cardSoft px-4 py-1 text-xs text-mind-textSoft">
        {mode === "work"
          ? "Focus gently for a short sprint."
          : "Breathe. This is your rest."}
      </div>
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-mind-primary/40 shadow-soft">
        <div className="text-3xl font-semibold text-mind-textMain">
          {minutes}:{seconds}
        </div>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => setIsRunning((prev) => !prev)}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PomodoroTimer;

import React from "react";
import { useNavigate } from "react-router-dom";
import MoodSelector from "../components/mood/MoodSelector";
import QuoteCard from "../components/cards/QuoteCard";
import EnergyScoreCard from "../components/cards/EnergyScoreCard";
import MoodTrendChart from "../components/charts/MoodTrendChart";
import { useAppContext } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const HomePage: React.FC = () => {
  const { moods, tasks, loading } = useAppContext();
  const latestMood = moods[0];
  const navigate = useNavigate();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning!" : hour < 18 ? "Good afternoon!" : "Good evening!";

  // Tasks due today (or all if none set)
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.due_date === today && !t.is_completed);

  return (
    <div className="space-y-5">
      {/* Top greeting */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-mind-textMain">
            {greeting} 👋
          </h1>
          <p className="text-sm text-mind-textSoft">
            Let&apos;s make today feel a little lighter and more manageable.
          </p>
        </div>
        {latestMood && (
          <div className="rounded-full bg-mind-primary/60 px-4 py-1 text-xs text-mind-textMain">
            <span className="mr-1">Status:</span>
            <span className="font-semibold capitalize">{latestMood.mood}</span>
          </div>
        )}
      </div>

      {/* Quote row */}
      <Card className="bg-white">
        <CardContent className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-mind-textSoft">
              Today&apos;s quote
            </p>
            {/* Re-use our quote card content */}
            <div className="text-sm text-mind-textMain">
              “Don&apos;t wait for opportunity. Create it.”
            </div>
            <p className="text-xs text-mind-textMuted">— Unknown</p>
          </div>
          <div className="hidden md:block w-px self-stretch bg-mind-border/60" />
          <div className="md:w-64">
            <QuoteCard />
          </div>
        </CardContent>
      </Card>

      {/* Mood selector row */}
      <Card className="bg-mind-cardSoft">
        <CardHeader className="pb-1">
          <CardTitle>How are you feeling?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-mind-textSoft">
            Quick check-in to personalize your study plan.
          </p>
          <MoodSelector />
          <p className="text-xs text-mind-textMuted">
            Take a deep breath. We&apos;ll plan something manageable. 🌿
          </p>
        </CardContent>
      </Card>

      {/* Energy + Mood trend row */}
      <div className="grid gap-4 md:grid-cols-[1.3fr,1.7fr]">
        <EnergyScoreCard latestMood={latestMood} />
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Mood Trend</CardTitle>
            <span className="text-[11px] text-mind-textSoft">Last 7 days</span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-xs text-mind-textSoft">
                Loading your mood history...
              </p>
            ) : (
              <MoodTrendChart moods={moods} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <button
              onClick={() => navigate("/planner")}
              className="flex items-center justify-between rounded-2xl border border-mind-border bg-mind-cardSoft px-4 py-3 text-sm text-mind-textMain shadow-soft hover:bg-mind-primary/30 transition"
            >
              <div>
                <div className="font-medium">Import Calendar</div>
                <div className="text-xs text-mind-textSoft">
                  Pull gentle blocks from your schedule.
                </div>
              </div>
              <span className="text-lg">📅</span>
            </button>

            <button
              onClick={() => navigate("/pomodoro")}
              className="flex items-center justify-between rounded-2xl border border-mind-border bg-mind-cardSoft px-4 py-3 text-sm text-mind-textMain shadow-soft hover:bg-mind-primary/30 transition"
            >
              <div>
                <div className="font-medium">Start Pomodoro</div>
                <div className="text-xs text-mind-textSoft">
                  25 minutes of kind, focused effort.
                </div>
              </div>
              <span className="text-lg">⏱️</span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-between rounded-2xl border border-mind-border bg-mind-cardSoft px-4 py-3 text-sm text-mind-textMain shadow-soft hover:bg-mind-primary/30 transition"
            >
              <div>
                <div className="font-medium">View Insights</div>
                <div className="text-xs text-mind-textSoft">
                  See how your mood and tasks dance together.
                </div>
              </div>
              <span className="text-lg">📊</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Today's schedule */}
      <Card className="bg-white">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle>Today&apos;s Schedule</CardTitle>
          <button
            onClick={() => navigate("/planner")}
            className="text-xs text-mind-primaryDeep hover:underline"
          >
            View all
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-mind-border bg-mind-bg px-4 py-6 text-center">
              <div className="text-2xl text-mind-textSoft">📅</div>
              <p className="text-sm font-medium text-mind-textMain">
                No schedule yet for today.
              </p>
              <p className="text-xs text-mind-textSoft">
                Import from calendar or add gentle tasks in the Planner.
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate("/planner")}
              >
                Import Calendar
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-2xl border border-mind-border bg-mind-cardSoft px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium text-mind-textMain">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-mind-textSoft">
                        {task.description}
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-mind-textMuted">
                    Soft due today
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;

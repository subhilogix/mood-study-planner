import React from "react";
import { useNavigate } from "react-router-dom";
import MoodSelector from "../components/mood/MoodSelector";
import QuoteCard from "../components/cards/QuoteCard";
import EnergyScoreCard from "../components/cards/EnergyScoreCard";
import MoodTrendChart from "../components/charts/MoodTrendChart";
import { useAppContext } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

// --- DARK MODE COLOR DEFINITIONS ---
// Card Background (Main White Cards): Lighter than app background
const CARD_BG_DARK = "dark:bg-[#2C2435]"; 
// Card Background (Soft/Accent Cards/Buttons): Lighter than main cards
const CARD_SOFT_BG_DARK = "dark:bg-[#362C47]";
// Text Color: Bright white for main text elements (Title, Main Content)
const TEXT_BRIGHT = "dark:text-white"; 
// Text Color: Bright, slightly muted purple for secondary titles/labels (Used for quote headings)
const TEXT_MUTED_PURPLE = "dark:text-[#D9C8FF]"; 
// Muted text for descriptions
const TEXT_MUTED = "dark:text-[#B8A2E0]";
//-------------------------------------

const HomePage: React.FC = () => {
  const { moods, tasks, loading } = useAppContext();
  const latestMood = moods[0];
  const navigate = useNavigate();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning!" : hour < 18 ? "Good afternoon!" : "Good evening!";

  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.due_datetime === today && !t.is_completed);

  return (
    // Increased overall vertical spacing from space-y-5 to space-y-6
    <div className="space-y-6">
      {/* Top greeting */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold 
            text-mind-textMain 
            dark:text-[#D9C8FF] 
            drop-shadow-sm flex items-center gap-2">
            {greeting} 👋
          </h1>

          <p className={`text-sm text-mind-textSoft ${TEXT_MUTED} mt-1`}>
            Let&apos;s make today feel a little lighter and more manageable.
          </p>
        </div>

        {latestMood && (
          <div className="rounded-full bg-mind-primary/60 px-4 py-1 text-xs text-mind-textMain dark:text-gray-900 dark:bg-purple-300">
            <span className="mr-1">Status:</span>
            <span className="font-semibold capitalize">{latestMood.mood}</span>
          </div>
        )}
      </div>

      {/* Quote row */}
      <Card className={`bg-white ${CARD_BG_DARK}`}>
        {/* Increased vertical padding from py-4 to py-5 */}
        <CardContent className="flex flex-col gap-2 py-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            {/* APPLIED TEXT_MUTED_PURPLE for Today's Quote Heading */}
            <p className={`text-xs uppercase tracking-wide text-mind-textSoft ${TEXT_MUTED_PURPLE}`}>
              Today&apos;s quote
            </p>

            <div className={`text-sm text-mind-textMain ${TEXT_BRIGHT}`}>
              “Don&apos;t wait for opportunity. Create it.”
            </div>
          </div>

          <div className="hidden md:block w-px self-stretch bg-mind-border/60 dark:bg-[#4A3C60]" />

          <div className="md:w-64">
            <QuoteCard />
          </div>
        </CardContent>
      </Card>

      {/* Mood selector row */}
      <Card className={`bg-mind-cardSoft ${CARD_BG_DARK}`}>
        {/* Increased CardHeader padding from pb-1 to pb-2 */}
        <CardHeader className="pb-2">
          <CardTitle className={TEXT_BRIGHT}>How are you feeling?</CardTitle>
        </CardHeader>

        {/* Increased spacing within CardContent from space-y-3 to space-y-4 */}
        <CardContent className="space-y-4">
          <p className={`text-xs text-mind-textSoft ${TEXT_BRIGHT}`}>
            Quick check-in to personalize your study plan.
          </p>

          <MoodSelector />

          <p className={`text-xs text-mind-textMuted ${TEXT_MUTED}`}>
            Take a deep breath. We&apos;ll plan something manageable. 🌿
          </p>
        </CardContent>
      </Card>

      {/* Energy + Mood trend row */}
      <div className="grid gap-4 md:grid-cols-[1.3fr,1.7fr]">
        <EnergyScoreCard latestMood={latestMood} />

        <Card className={CARD_BG_DARK}>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className={TEXT_BRIGHT}>Mood Trend</CardTitle>
            <span className={`text-[11px] text-mind-textSoft ${TEXT_BRIGHT}`}>
              Last 7 days
            </span>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className={`text-xs text-mind-textSoft ${TEXT_BRIGHT}`}>
                Loading your mood history...
              </p>
            ) : (
              <MoodTrendChart moods={moods} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className={`bg-white ${CARD_BG_DARK}`}>
        <CardHeader className="pb-2">
          <CardTitle className={TEXT_BRIGHT}>Quick Actions</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">

            {/* Import Calendar */}
            <button
              onClick={() => navigate("/planner")}
              className={`flex items-center justify-between rounded-2xl border border-mind-border dark:border-[#4A3C60] 
                bg-mind-cardSoft ${CARD_SOFT_BG_DARK} px-4 py-3 text-sm 
                text-mind-textMain ${TEXT_BRIGHT} shadow-soft hover:bg-mind-primary/30 dark:hover:bg-[#4A3C60]/50 transition`}
            >
              <div>
                <div className="font-medium">Import Calendar</div>
                <div className={`text-xs text-mind-textSoft ${TEXT_MUTED}`}>
                  Pull gentle blocks from your schedule.
                </div>
              </div>
              <span className="text-lg">📅</span>
            </button>

            {/* Pomodoro */}
            <button
              onClick={() => navigate("/pomodoro")}
              className={`flex items-center justify-between rounded-2xl border border-mind-border dark:border-[#4A3C60] 
                bg-mind-cardSoft ${CARD_SOFT_BG_DARK} px-4 py-3 text-sm 
                text-mind-textMain ${TEXT_BRIGHT} shadow-soft hover:bg-mind-primary/30 dark:hover:bg-[#4A3C60]/50 transition`}
            >
              <div>
                <div className="font-medium">Start Pomodoro</div>
                <div className={`text-xs text-mind-textSoft ${TEXT_MUTED}`}>
                  25 minutes of kind, focused effort.
                </div>
              </div>
              <span className="text-lg">⏱️</span>
            </button>

            {/* Insights */}
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center justify-between rounded-2xl border border-mind-border dark:border-[#4A3C60] 
                bg-mind-cardSoft ${CARD_SOFT_BG_DARK} px-4 py-3 text-sm 
                text-mind-textMain ${TEXT_BRIGHT} shadow-soft hover:bg-mind-primary/30 dark:hover:bg-[#4A3C60]/50 transition`}
            >
              <div>
                <div className="font-medium">View Insights</div>
                <div className={`text-xs text-mind-textSoft ${TEXT_MUTED}`}>
                  See how your mood and tasks dance together.
                </div>
              </div>
              <span className="text-lg">📊</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card className={`bg-white ${CARD_BG_DARK}`}>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className={TEXT_BRIGHT}>
            Today&apos;s Schedule
          </CardTitle>

          <button
            onClick={() => navigate("/planner")}
            className="text-xs text-mind-primaryDeep hover:underline"
          >
            View all
          </button>
        </CardHeader>

        <CardContent className="space-y-3">
          {todayTasks.length === 0 ? (
            // Increased vertical padding from py-6 to py-8
            <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed 
              border-mind-border dark:border-[#4A3C60] bg-mind-bg ${CARD_SOFT_BG_DARK} px-4 py-8 text-center`}>
              <div className={`text-2xl text-mind-textSoft ${TEXT_BRIGHT}`}>📅</div>

              <p className={`text-sm font-medium text-mind-textMain ${TEXT_BRIGHT}`}>
                No schedule yet for today.
              </p>

              <p className={`text-xs text-mind-textSoft ${TEXT_BRIGHT}`}>
                Import from calendar or add gentle tasks in the Planner.
              </p>

              <Button size="sm" variant="primary" onClick={() => navigate("/planner")}>
                Import Calendar
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between rounded-2xl border border-mind-border dark:border-[#4A3C60] 
                    bg-mind-cardSoft ${CARD_SOFT_BG_DARK} px-3 py-2 text-sm`}
                >
                  <div>
                    <div className={`font-medium text-mind-textMain ${TEXT_BRIGHT}`}>
                      {task.title}
                    </div>

                    {task.description && (
                      <div className={`text-xs text-mind-textSoft ${TEXT_BRIGHT}`}>
                        {task.description}
                      </div>
                    )}
                  </div>

                  <div className={`text-[11px] text-mind-textMuted ${TEXT_MUTED}`}>
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
import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import MoodTrendChart from "../components/charts/MoodTrendChart";

// --- DARK MODE COLOR DEFINITIONS ---
// Card Background (Main): Lighter than app background
const CARD_BG_DARK = "dark:bg-[#2C2435]"; 
// Text Color: Bright white for main text elements
const TEXT_BRIGHT = "dark:text-white"; 
//-------------------------------------

const DashboardPage: React.FC = () => {
  const { moods, tasks } = useAppContext();
  const completed = tasks.filter((t) => t.is_completed).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold 
  text-mind-textMain 
  dark:text-[#D9C8FF] 
  drop-shadow-sm flex items-center gap-2">
          Calm Overview
        </h1>
        <p className="text-sm text-mind-textSoft dark:text-[#B8A2E0] mt-1">
          A gentle snapshot of how you&apos;ve been studying and feeling.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Logged Moods */}
        {/* FIX: Apply CARD_BG_DARK and ensure bright text is used */}
        <Card className={CARD_BG_DARK}>
          <CardHeader>
            <CardTitle className={TEXT_BRIGHT}>Logged moods</CardTitle>
          </CardHeader>
          <CardContent>
            {/* FIX: Apply bright text to the main number */}
            <p className={`text-2xl font-semibold text-mind-textMain ${TEXT_BRIGHT}`}>
              {moods.length}
            </p>
            <p className="text-xs text-mind-textSoft">
              Each check-in is a tiny act of self-care.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Tasks Completed */}
        {/* FIX: Apply CARD_BG_DARK and ensure bright text is used */}
        <Card className={CARD_BG_DARK}>
          <CardHeader>
            <CardTitle className={TEXT_BRIGHT}>Tasks completed</CardTitle>
          </CardHeader>
          <CardContent>
            {/* FIX: Apply bright text to the main number */}
            <p className={`text-2xl font-semibold text-mind-textMain ${TEXT_BRIGHT}`}>
              {completed}
            </p>
            <p className="text-xs text-mind-textSoft">
              Progress, even if small, still counts.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Tasks in Queue */}
        {/* FIX: Apply CARD_BG_DARK and ensure bright text is used */}
        <Card className={CARD_BG_DARK}>
          <CardHeader>
            <CardTitle className={TEXT_BRIGHT}>Tasks in queue</CardTitle>
          </CardHeader>
          <CardContent>
            {/* FIX: Apply bright text to the main number */}
            <p className={`text-2xl font-semibold text-mind-textMain ${TEXT_BRIGHT}`}>
              {tasks.length - completed}
            </p>
            <p className="text-xs text-mind-textSoft">
              Let&apos;s keep this list kind to your future self.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Trend Chart Card */}
      {/* FIX: Apply CARD_BG_DARK and ensure bright text is used */}
      <Card className={CARD_BG_DARK}>
        <CardHeader>
          <CardTitle className={TEXT_BRIGHT}>Mood over time</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodTrendChart moods={moods} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
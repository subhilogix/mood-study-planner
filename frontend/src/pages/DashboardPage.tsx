import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import MoodTrendChart from "../components/charts/MoodTrendChart";

const DashboardPage: React.FC = () => {
  const { moods, tasks } = useAppContext();
  const completed = tasks.filter((t) => t.is_completed).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-mind-textMain">
          Calm Overview
        </h1>
        <p className="text-sm text-mind-textSoft">
          A gentle snapshot of how you&apos;ve been studying and feeling.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Logged moods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-mind-textMain">
              {moods.length}
            </p>
            <p className="text-xs text-mind-textSoft">
              Each check-in is a tiny act of self-care.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-mind-textMain">
              {completed}
            </p>
            <p className="text-xs text-mind-textSoft">
              Progress, even if small, still counts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks in queue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-mind-textMain">
              {tasks.length - completed}
            </p>
            <p className="text-xs text-mind-textSoft">
              Let&apos;s keep this list kind to your future self.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mood over time</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodTrendChart moods={moods} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

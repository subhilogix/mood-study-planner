import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { MoodEntry } from "../../types";

function moodToScore(mood: string): number {
  const m = mood.toLowerCase();
  if (m.includes("happy")) return 3;
  if (m.includes("okay") || m.includes("fine")) return 2;
  if (m.includes("stressed") || m.includes("nervous")) return 1.5;
  if (m.includes("sad") || m.includes("low")) return 1;
  return 2;
}

interface Props {
  moods: MoodEntry[];
}

const MoodTrendChart: React.FC<Props> = ({ moods }) => {
  const data = [...moods]
    .slice(0, 14)
    .reverse()
    .map((m) => ({
      date: m.date.slice(5),
      score: moodToScore(m.mood)
    }));

  if (data.length === 0) {
    return (
      <p className="text-xs text-mind-textSoft">
        No mood history yet. Log your mood to see trends over time.
      </p>
    );
  }

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#7C6F92" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[1, 3]}
            ticks={[1, 1.5, 2, 2.5, 3]}
            tick={{ fontSize: 10, fill: "#7C6F92" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#FFFFFF",
              borderRadius: 12,
              border: "1px solid #E7E3DD",
              fontSize: 12
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#C7B3F0"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTrendChart;

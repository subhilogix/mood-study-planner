import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { MoodEntry } from "../../types";

interface Props {
  latestMood?: MoodEntry;
}

// Map mood + emotion → 0–100 energy score
function computeEnergy(latestMood?: MoodEntry): { score: number; label: string; description: string } {
  if (!latestMood) {
    return {
      score: 50,
      label: "No mood logged yet",
      description: "Log today’s mood to let MindStudy estimate your study energy."
    };
  }

  const mood = latestMood.mood.toLowerCase();
  let base = 55;

  if (mood.includes("great") || mood.includes("excited") || mood.includes("happy")) base = 85;
  else if (mood.includes("good")) base = 72;
  else if (mood.includes("okay") || mood.includes("fine")) base = 60;
  else if (mood.includes("tired")) base = 45;
  else if (mood.includes("stressed") || mood.includes("anxious")) base = 38;
  else if (mood.includes("sad") || mood.includes("low")) base = 32;

  // Slight adjustment using emotion model if available
  if (latestMood.emotion_label) {
    const label = latestMood.emotion_label.toUpperCase();
    const score = latestMood.emotion_score ?? 0.5;
    if (label.includes("POSITIVE")) base += 8 * score;
    if (label.includes("NEGATIVE")) base -= 10 * score;
  }

  const clamped = Math.max(0, Math.min(100, Math.round(base)));

  let label: string;
  let description: string;

  if (clamped >= 80) {
    label = "High Energy";
    description = "Perfect time for challenging tasks or deep-focus study.";
  } else if (clamped >= 60) {
    label = "Steady Energy";
    description = "You can handle medium-difficulty work with kind breaks.";
  } else if (clamped >= 40) {
    label = "Gentle Energy";
    description = "Stick to lighter tasks and keep expectations soft.";
  } else {
    label = "Handle With Care";
    description = "Today is a good day for tiny steps, review, or rest.";
  }

  return {
    score: clamped,
    label,
    description
  };
}

const EnergyScoreCard: React.FC<Props> = ({ latestMood }) => {
  const { score, label, description } = computeEnergy(latestMood);

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle>Study Energy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-semibold text-mind-textMain">
            {score}
          </span>
          <span className="pb-1 text-sm text-mind-textSoft">/100</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-mind-border/40">
          <div
            className="h-full rounded-full bg-[#4ade80]" // soft green
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="text-sm font-medium text-[#16a34a]">
          {label}
        </div>
        <p className="text-xs text-mind-textSoft">{description}</p>
      </CardContent>
    </Card>
  );
};

export default EnergyScoreCard;

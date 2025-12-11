import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { MoodEntry } from "../../types";

// --- DARK MODE COLOR DEFINITIONS ---
// Card Background (Main White Cards): Lighter than app background
const CARD_BG_DARK = "dark:bg-[#2C2435]"; 
// Text Color: Bright white for main text elements
const TEXT_BRIGHT = "dark:text-white"; 
// Text Color: Muted purple for secondary/soft text
const TEXT_MUTED_PURPLE = "dark:text-[#B8A2E0]";
// Green color for high energy/progress bar
const COLOR_GREEN_DARK = "dark:text-[#4ade80]";
const COLOR_GREEN_BAR = "bg-[#4ade80]";
// Dark border color for the progress bar track
const COLOR_BORDER_DARK = "dark:bg-[#4A3C60]";
//-------------------------------------

interface Props {
  latestMood?: MoodEntry;
}

// Map mood + emotion → 0–100 energy score (No change here)
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
    // FIX 1: Apply dark background class and border/shadow (if needed)
    <Card className={`bg-white ${CARD_BG_DARK} shadow-lg border-none`}>
      <CardHeader className="pb-3"> {/* Increased pb-2 to pb-3 for more space */}
        <CardTitle className={TEXT_BRIGHT}>Study Energy</CardTitle>
      </CardHeader>
      {/* FIX 2: Increased space-y-3 to space-y-4 for bigger feel */}
      <CardContent className="space-y-4"> 
        <div className="flex items-end gap-1">
          {/* FIX 3: Apply bright text to score */}
          <span className={`text-4xl font-semibold text-mind-textMain ${TEXT_BRIGHT}`}> 
            {score}
          </span>
          {/* FIX 4: Apply muted purple text to /100 */}
          <span className={`pb-1 text-sm text-mind-textSoft ${TEXT_MUTED_PURPLE}`}>/100</span>
        </div>

        {/* Progress bar */}
        {/* FIX 5: Apply dark border color to the progress bar track */}
        <div className={`h-3 w-full overflow-hidden rounded-full bg-mind-border/40 ${COLOR_BORDER_DARK}`}> {/* Increased height h-2 to h-3 */}
          <div
            className={`h-full rounded-full ${COLOR_GREEN_BAR}`} // soft green
            style={{ width: `${score}%` }}
          />
        </div>

        {/* FIX 6: Apply bright green text for the label */}
        <div className={`text-base font-medium text-[#16a34a] ${COLOR_GREEN_DARK}`}> {/* Increased text size to text-base */}
          {label}
        </div>
        {/* FIX 7: Apply bright text for the description */}
        <p className={`text-sm text-mind-textSoft ${TEXT_BRIGHT}`}>{description}</p> {/* Increased text size to text-sm */}
      </CardContent>
    </Card>
  );
};

export default EnergyScoreCard;
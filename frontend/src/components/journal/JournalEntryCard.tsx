import React, { useState } from "react";
import { JournalEntry } from "../../types";
import { api } from "../../api/api";

// --- DARK MODE COLOR DEFINITIONS ---
// Card Background (Main White Cards): Lighter than app background
const CARD_BG_DARK = "dark:bg-[#2C2435]"; 
// Text Color: Bright white for main content
const TEXT_BRIGHT = "dark:text-white"; 
// Text Color: Muted purple/gray for secondary/soft text
const TEXT_MUTED = "dark:text-[#B8A2E0]";
// Border color
const BORDER_DARK = "dark:border-[#4A3C60]";
// Ring color for favorite
const RING_FAV_DARK = "dark:ring-mind-primary/60";
// Secondary soft background for menus/reflection panel
const SOFT_BG_DARK = "dark:bg-[#362C47]";
// Color for positive feedback (Green)
const COLOR_POSITIVE = "text-emerald-400 dark:text-emerald-300";
// Color for negative feedback (Red/Rose)
const COLOR_NEGATIVE = "text-rose-600 dark:text-rose-400";
//-------------------------------------


interface Props {
  entry: JournalEntry;
  onUpdated: () => void;
}

const JournalEntryCard: React.FC<Props> = ({ entry, onUpdated }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loadingReflection, setLoadingReflection] = useState(false);
  const [showReflection, setShowReflection] = useState(entry.ai_reflection ? true : false);

  const handleFavorite = async () => {
    await api.updateJournal(entry.id, {
      is_favorite: !entry.is_favorite,
    });
    onUpdated();
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this entry forever?")) return;
    await api.deleteJournal(entry.id);
    onUpdated();
  };

  const handleReflection = async () => {
    try {
      setLoadingReflection(true);
      const res = await api.reflectOnJournal(entry.id);
      console.log("Reflection:", res);
      setShowReflection(true);
      onUpdated();
    } finally {
      setLoadingReflection(false);
    }
  };

  const emotionLabel = entry.emotion_label || "neutral";
  const emotionScore = Math.round((entry.emotion_score || 0) * 100);

  // --- LOGIC TO DETERMINE COLOR AND CHIP CLASS ---
  let scoreColorClass = TEXT_MUTED; // Default to muted/grey
  
  const isPositive = emotionLabel.toLowerCase().includes("pos") || emotionLabel.toLowerCase().includes("joy") || emotionLabel.toLowerCase().includes("happy");
  const isNegative = emotionLabel.toLowerCase().includes("sad") || emotionLabel.toLowerCase().includes("neg") || emotionLabel.toLowerCase().includes("stress") || emotionLabel.toLowerCase().includes("anx") || emotionLabel.toLowerCase().includes("anger");

  if (isPositive) {
    scoreColorClass = COLOR_POSITIVE;
  } else if (isNegative) {
    scoreColorClass = COLOR_NEGATIVE;
  }
  // ------------------------------------------------
  
  // Updated Pastel color chips for DARK MODE
  const moodStyles: Record<string, string> = {
    positive: "bg-emerald-800 text-emerald-300 border-emerald-700",
    joy: "bg-emerald-800 text-emerald-300 border-emerald-700",
    happy: "bg-emerald-800 text-emerald-300 border-emerald-700",

    negative: "bg-rose-800 text-rose-300 border-rose-700",
    sad: "bg-rose-800 text-rose-300 border-rose-700",
    upset: "bg-rose-800 text-rose-300 border-rose-700",

    stress: "bg-amber-800 text-amber-300 border-amber-700",
    anxious: "bg-amber-800 text-amber-300 border-amber-700",

    neutral: `bg-mind-cardSoft ${SOFT_BG_DARK} text-mind-textMain ${TEXT_BRIGHT} border-mind-border ${BORDER_DARK}`,
  };

  const chipClass =
    moodStyles[
      isPositive
        ? "positive"
        : isNegative
        ? "negative"
        : emotionLabel.toLowerCase().includes("stress") ||
          emotionLabel.toLowerCase().includes("anx")
          ? "stress"
          : "neutral"
    ];

  return (
    <div
      // Applied dark mode background, border, and adjusted favorite ring
      className={`relative rounded-2xl border bg-white ${CARD_BG_DARK} ${BORDER_DARK} px-4 py-3 shadow-soft transition-all ${
        entry.is_favorite ? `ring-2 ring-mind-primary/40 ${RING_FAV_DARK} shadow-lg` : ""
      }`}
    >
      {/* 3-dot menu */}
      <div className="absolute right-3 top-3">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`text-mind-textSoft hover:text-mind-textMain ${TEXT_MUTED} hover:${TEXT_BRIGHT}`}
        >
          ⋮
        </button>

        {showMenu && (
          // Menu panel with dark background and border
          <div className={`absolute right-0 mt-1 w-36 rounded-xl bg-white ${CARD_BG_DARK} ${BORDER_DARK} border shadow-lg text-sm z-10`}>
            <button
              onClick={handleFavorite}
              className={`w-full px-3 py-2 text-left hover:bg-mind-cardSoft ${SOFT_BG_DARK} rounded-t-xl ${TEXT_BRIGHT}`}
            >
              ⭐ {entry.is_favorite ? "Unfavorite" : "Favorite"}
            </button>
            <button
              onClick={handleReflection}
              className={`w-full px-3 py-2 text-left hover:bg-mind-cardSoft ${SOFT_BG_DARK} ${TEXT_BRIGHT}`}
            >
              {loadingReflection ? "Thinking..." : "🙏 Reflect"}
            </button>
            <button
              onClick={handleDelete}
              // Dark mode hover for delete
              className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-900/50 rounded-b-xl"
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>

      {/* Date + mood */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          {/* Date text bright */}
          <p className={`text-xs font-medium text-mind-textMain ${TEXT_BRIGHT}`}>{entry.date}</p>
          {/* Subtext muted */}
          <p className={`text-[11px] text-mind-textMuted ${TEXT_MUTED}`}>
            ML mood snapshot from your text
          </p>
        </div>

        {/* Mood chip uses the defined dark mood styles */}
        <span
          className={`px-3 py-1 rounded-full border text-[11px] font-medium ${chipClass}`}
        >
          {emotionLabel} 
          
          {/* CHANGE APPLIED HERE: Applied dynamic scoreColorClass */}
          <span className={`ml-1 ${scoreColorClass}`}>
             ({emotionScore}%)
          </span>
        </span>
      </div>

      {/* Content text bright */}
      <p className={`text-sm text-mind-textMain whitespace-pre-line mb-3 ${TEXT_BRIGHT}`}>
        {entry.content}
      </p>

      {/* Emotion intensity bar */}
      <div className="space-y-1">
        {/* Label text muted */}
        <div className={`flex justify-between text-[11px] text-mind-textMuted ${TEXT_MUTED}`}>
          <span>Emotion intensity</span>
          {/* Applied dynamic scoreColorClass here as well for consistency */}
          <span className={scoreColorClass}>{emotionScore}%</span> 
        </div>
        {/* Progress bar track dark */}
        <div className={`h-1.5 bg-mind-border/30 ${BORDER_DARK} rounded-full overflow-hidden`}>
          <div
            // Bar color updated to be slightly darker/more muted in dark theme
            className="h-full bg-mind-primary/50 dark:bg-mind-primary/80 transition-all"
            style={{ width: `${emotionScore}%` }}
          ></div>
        </div>
      </div>

      {/* Slide-down reflection panel */}
      {entry.ai_reflection && showReflection && (
        // Reflection panel with soft dark background and border
        <div className={`mt-3 rounded-xl bg-mind-bg ${SOFT_BG_DARK} p-3 border ${BORDER_DARK} animate-slideDown`}>
          <p className={`text-sm text-mind-textMain whitespace-pre-line ${TEXT_BRIGHT}`}>
            {entry.ai_reflection}
          </p>
        </div>
      )}

      {loadingReflection && (
        <p className={`mt-3 text-xs text-mind-textSoft ${TEXT_MUTED}`}>Thinking…</p>
      )}

      {!entry.ai_reflection && showReflection && (
        <p className={`mt-3 text-xs text-mind-textSoft ${TEXT_MUTED}`}>
          No reflection generated yet.
        </p>
      )}
    </div>
  );
};

export default JournalEntryCard;
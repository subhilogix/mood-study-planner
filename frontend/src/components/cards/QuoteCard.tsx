import React from "react";
// Removed: import { Card, CardContent } from "../ui/Card"; 
// Since we are not using Card components

// --- DARK MODE COLOR DEFINITIONS ---
// Text Color: Bright white for main content
const TEXT_BRIGHT = "dark:text-white"; 
// Text Color: Bright, slightly muted purple for secondary titles/labels
const TEXT_MUTED_PURPLE = "dark:text-[#D9C8FF]";
//-------------------------------------


const quotes = [
  "Study gently. Small steps add up.",
  "You don’t have to do everything today to make progress.",
  "Rest is part of studying well.",
  "You are allowed to go at your own pace.",
  "Tiny consistent effort beats intense burnout."
];

function pickQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

const QuoteCard: React.FC = () => {
  return (
    // REVISED: This div now carries NO background, NO border, and NO rounded corners.
    // It relies on the parent component (HomePage) for that styling.
    <div className="p-0"> 
      
      {/* Apply bright purple text for the uppercase title */}
      <div className={`text-xs font-semibold uppercase tracking-wide text-mind-textSoft ${TEXT_MUTED_PURPLE}`}>
        Today&apos;s gentle reminder
      </div>
      
      {/* Apply bright white text for the quote itself */}
      <p className={`mt-2 text-sm text-mind-textMain ${TEXT_BRIGHT}`}>
        “{pickQuote()}”
      </p>
    </div>
  );
};

export default QuoteCard;
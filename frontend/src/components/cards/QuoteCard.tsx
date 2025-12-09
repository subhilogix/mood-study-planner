import React from "react";
import { Card, CardContent } from "../ui/Card";

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
    <Card>
      <CardContent>
        <div className="text-xs font-semibold uppercase tracking-wide text-mind-textSoft">
          Today&apos;s gentle reminder
        </div>
        <p className="mt-2 text-sm text-mind-textMain">
          “{pickQuote()}”
        </p>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;

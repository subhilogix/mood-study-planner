import React from "react";

export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ className = "", ...props }) => (
  <input
    className={`h-9 w-full rounded-full border border-mind-border bg-white px-3 text-sm text-mind-textMain placeholder:text-mind-textMuted/60 focus:outline-none focus:ring-2 focus:ring-mind-primaryDeep/50 ${className}`}
    {...props}
  />
);

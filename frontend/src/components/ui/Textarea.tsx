import React from "react";

export const Textarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className = "", ...props }) => (
  <textarea
    className={`w-full rounded-2xl border border-mind-border bg-white px-3 py-2 text-sm text-mind-textMain placeholder:text-mind-textMuted/60 focus:outline-none focus:ring-2 focus:ring-mind-primaryDeep/50 ${className}`}
    {...props}
  />
);

import React from "react";

export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ className = "", ...props }) => (
  <input
    className={`
      h-10 w-full rounded-xl border px-3 text-sm
      border-mind-border bg-white 
      text-[#2A1E3F] placeholder:text-[#8F82B0]

      focus:outline-none focus:ring-2 focus:ring-mind-primaryDeep/50

      dark:bg-[#2E263D] dark:border-[#3A314D]
      dark:text-white dark:placeholder:text-[#BFAFE8]

      ${className}
    `}
    {...props}
  />
);

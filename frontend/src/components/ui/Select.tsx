import React from "react";

export const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ className = "", children, ...props }) => (
  <select
    className={`h-9 w-full rounded-full border border-mind-border bg-white px-3 text-sm text-mind-textMain focus:outline-none focus:ring-2 focus:ring-mind-primaryDeep/50 ${className}`}
    {...props}
  >
    {children}
  </select>
);

import React from "react";

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => (
  <div
    className={`
      rounded-2xl bg-mind-card shadow-soft border border-mind-borderSoft
      dark:bg-[#1F1B24] dark:border-[#3A314D]
      ${className}
    `}
    {...props}
  />
);

const CardHeader = ({ className = "", ...props }) => (
  <div className={`px-4 pt-4 pb-2 ${className}`} {...props} />
);

const CardTitle = ({ className = "", ...props }) => (
  <h3
    className={`
      text-sm font-semibold text-mind-textMain 
      dark:text-[#E6DFFF]
      ${className}
    `}
    {...props}
  />
);

const CardContent = ({ className = "", ...props }) => (
  <div
    className={`
      px-4 pb-4 pt-1 text-sm 
      dark:text-[#D8CFFF]
      ${className}
    `}
    {...props}
  />
);

export { Card, CardHeader, CardTitle, CardContent };

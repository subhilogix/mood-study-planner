import React from "react";

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => (
  <div
    className={`rounded-2xl bg-mind-card shadow-soft border border-mind-borderSoft ${className}`}
    {...props}
  />
);

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => (
  <div className={`px-4 pt-4 pb-2 ${className}`} {...props} />
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = "",
  ...props
}) => (
  <h3
    className={`text-sm font-semibold text-mind-textMain ${className}`}
    {...props}
  />
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => (
  <div className={`px-4 pb-4 pt-1 text-sm ${className}`} {...props} />
);

export { Card, CardHeader, CardTitle, CardContent };

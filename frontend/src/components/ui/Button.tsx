import React from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-mind-primaryDeep/60 focus-visible:ring-offset-2 focus-visible:ring-offset-mind-bg disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-white text-mind-textMain border border-mind-borderSoft hover:bg-mind-primary/40",
    outline:
      "bg-transparent text-mind-textSoft border border-mind-border hover:bg-mind-primary/20",
    ghost:
      "bg-transparent text-mind-textSoft hover:bg-mind-primary/20 border border-transparent"
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export { Button };

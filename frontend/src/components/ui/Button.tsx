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
    "inline-flex items-center justify-center rounded-full font-medium transition-all";

  const variants = {
    primary:
      "bg-mind-primary text-mind-textMain border border-mind-borderSoft hover:bg-mind-primarySoft " +
      "dark:bg-[#7C5BDE] dark:text-white dark:hover:bg-[#6B4FD1]",

    outline:
      "bg-transparent text-mind-textSoft border border-mind-border hover:bg-mind-primary/20 " +
      "dark:text-[#BFAFE8] dark:border-[#3A314D] dark:hover:bg-[#2E263D]",

    ghost:
      "bg-transparent text-mind-textSoft hover:bg-mind-primary/20 " +
      "dark:text-[#BFAFE8] dark:hover:bg-[#2E263D]"
  };

  const sizes = {
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

import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export const Switch = ({ checked, onChange }: SwitchProps) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        w-12 h-6 rounded-full transition relative 
        ${checked ? "bg-[#7C5BDE]" : "bg-gray-300 dark:bg-[#3A314D]"}
      `}
    >
      <div
        className={`
          absolute top-1 w-4 h-4 bg-white rounded-full transition 
          ${checked ? "left-7" : "left-1"}
        `}
      />
    </button>
  );
};

export default Switch;

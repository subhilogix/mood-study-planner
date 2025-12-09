import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      className={`flex h-5 w-9 items-center rounded-full border transition-all ${
        checked
          ? "border-mind-primaryDeep bg-mind-primary"
          : "border-mind-border bg-white"
      }`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow-soft transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
};

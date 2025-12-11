import React from "react";

export const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ className = "", children, ...props }) => {
  return (
    <select
      className={`
        w-full h-10 rounded-full px-4 text-sm
        outline-none cursor-pointer transition-all

        bg-white text-mind-textMain border border-mind-border
        placeholder:text-mind-textMuted

        dark:bg-[#2C2435] dark:text-[#E9DFFF] dark:border-[#4A3C60]
        dark:placeholder:text-[#C9B5E8]

        focus:ring-2 focus:ring-mind-primaryDeep/40 dark:focus:ring-[#7A5BDB]/50

        appearance-none
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;

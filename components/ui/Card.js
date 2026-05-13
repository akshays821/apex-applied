import React from "react";

export default function Card({ children, className = "", onClick, ...props }) {
  const baseStyles =
    "backdrop-blur-md bg-white/5 border border-white/10 shadow-[4px_4px_0px_#F59E0B] rounded-sm relative overflow-hidden";

  const interactiveStyles = onClick
    ? "cursor-pointer transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0px_#F59E0B] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_#F59E0B]"
    : "";

  const combinedClassName = `${baseStyles} ${interactiveStyles} ${className}`.trim();

  return (
    <div className={combinedClassName} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

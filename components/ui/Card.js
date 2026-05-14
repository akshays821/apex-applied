import React from "react";

export default function Card({ children, className = "", onClick, ...props }) {
  const baseStyles =
    "bg-[#494C65] border border-white/10 rounded-sm relative overflow-hidden";

  const interactiveStyles = onClick
    ? "cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
    : "";

  const combinedClassName = `${baseStyles} ${interactiveStyles} ${className}`.trim();

  return (
    <div className={combinedClassName} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

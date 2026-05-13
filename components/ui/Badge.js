import React from "react";

export default function Badge({ variant = "active", children, className = "" }) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border-2 tracking-wide uppercase transition-transform duration-200";

  const variantStyles = {
    active: "bg-green-500/20 text-green-400 border-green-500",
    overdue: "bg-red-500/20 text-red-400 border-red-500 shadow-[2px_2px_0px_rgba(239,68,68,0.5)]",
    due_today: "bg-amber-500/20 text-amber-400 border-amber-500",
    responded: "bg-blue-500/20 text-blue-400 border-blue-500",
    rejected: "bg-gray-500/20 text-gray-400 border-gray-500",
    archived: "bg-zinc-800/50 text-zinc-500 border-zinc-700",
    going_cold: "bg-orange-500/20 text-orange-400 border-orange-500",
  };

  const combinedClassName = `${baseStyles} ${
    variantStyles[variant] || variantStyles.active
  } ${className}`;

  return (
    <span className={combinedClassName}>
      {children}
    </span>
  );
}

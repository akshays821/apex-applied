import React from "react";

export default function Badge({ variant = "active", children, className = "" }) {
  const baseStyles =
    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wider uppercase transition-transform duration-200 gap-1.5";

  const variantStyles = {
    active: { style: "bg-[#A5B2EB]/10 text-[#A5B2EB] border-[#A5B2EB]/30", dot: "bg-[#A5B2EB]" },
    overdue: { style: "bg-[#DDDE68]/10 text-[#DDDE68] border-[#DDDE68]/30", dot: "bg-[#DDDE68]" },
    due_today: { style: "bg-[#DA935D]/10 text-[#DA935D] border-[#DA935D]/30", dot: "bg-[#DA935D]" },
    responded: { style: "bg-[#7CCDE5]/10 text-[#7CCDE5] border-[#7CCDE5]/30", dot: "bg-[#7CCDE5]" },
    rejected: { style: "bg-[#C0706A]/10 text-[#C0706A] border-[#C0706A]/30", dot: "bg-[#C0706A]" },
    offer: { style: "bg-[#6DBF8A]/10 text-[#6DBF8A] border-[#6DBF8A]/30", dot: "bg-[#6DBF8A]" },
    archived: { style: "bg-[#676386]/10 text-[#676386] border-[#676386]/30", dot: "bg-[#676386]" },
    going_cold: { style: "bg-[#DA935D]/10 text-[#DA935D] border-[#DA935D]/30", dot: "bg-[#DA935D]" },
  };

  const currentVariant = variantStyles[variant] || variantStyles.active;

  const combinedClassName = `${baseStyles} ${currentVariant.style} ${className}`;

  return (
    <span className={combinedClassName}>
      <span className={`w-1.5 h-1.5 rounded-full ${currentVariant.dot}`} />
      {children}
    </span>
  );
}

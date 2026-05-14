import React from "react";

export default function Button({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseStyles =
    "font-semibold rounded-none transition-all duration-200 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-sans";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantStyles = {
    primary:
      "bg-[#DDDE68] text-[#1E2030] border border-[#c8c850] shadow-[3px_3px_0px_rgba(0,0,0,0.5)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.5)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.5)]",
    secondary:
      "bg-transparent text-white border border-white/20 shadow-[3px_3px_0px_rgba(0,0,0,0.5)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:bg-white/5 active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.5)]",
    danger:
      "bg-[#C0706A] text-white border border-[#A85852] shadow-[3px_3px_0px_rgba(0,0,0,0.5)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.5)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.5)]",
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}

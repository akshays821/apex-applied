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
    "font-semibold rounded-sm transition-all duration-200 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-sans"; // Assuming Inter is mapped to sans

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantStyles = {
    primary:
      "bg-amber-500 text-black border border-amber-600 shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.8)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.8)]",
    secondary:
      "bg-transparent text-amber-500 border-2 border-amber-500 shadow-[3px_3px_0px_rgba(245,158,11,0.5)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_rgba(245,158,11,0.5)] hover:bg-amber-500/10 active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_rgba(245,158,11,0.5)]",
    danger:
      "bg-red-500 text-white border border-red-600 shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.8)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.8)]",
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

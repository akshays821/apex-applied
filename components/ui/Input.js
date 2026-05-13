import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      type = "text",
      placeholder = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`flex flex-col w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 text-sm font-semibold text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          className={`
            bg-[#111111] text-white placeholder-gray-500
            border ${error ? "border-red-500" : "border-white/10"} 
            rounded-sm px-3 py-2.5 w-full
            focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500
            transition-colors duration-200
            appearance-none
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

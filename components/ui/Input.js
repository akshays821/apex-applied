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
            w-full bg-transparent border-b ${error ? "border-red-500" : "border-white/15"}
            focus:border-b-2 focus:border-[#A5B2EB] outline-none text-white 
            placeholder-white/25 py-2 transition-all duration-200 rounded-none
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

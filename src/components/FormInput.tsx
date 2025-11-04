"use client";

import React, { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  Input?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, label, className, Input, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        {Input ?? (
          <input
            ref={ref}
            {...props}
            className={`p-2 outline-none focus-within:border-secondary border-b border-primary ${
              error ? "border-red-500" : ""
            } ${className || ""}`}
          />
        )}
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

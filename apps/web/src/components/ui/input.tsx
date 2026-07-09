import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`w-full h-10 px-3.5 rounded-lg border bg-canvas text-sm outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent placeholder:text-ink-tertiary ${
            error ? "border-danger focus:border-danger focus:ring-danger" : "border-border"
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-danger font-medium mt-1.5 block">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={`w-full min-h-[80px] p-3 rounded-lg border bg-canvas text-sm outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent placeholder:text-ink-tertiary ${
            error ? "border-danger focus:border-danger focus:ring-danger" : "border-border"
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-danger font-medium mt-1.5 block">{error}</span>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

import React from "react";
import { AQISeverity } from "@urbanair/shared";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "outline" | AQISeverity;
}

export function Badge({ variant = "info", className = "", children, ...props }: BadgeProps) {
  // Variant mapping to standard/severity colors
  const variants = {
    // Semantic
    success: "bg-success/10 border-success/30 text-success",
    warning: "bg-warning/10 border-warning/30 text-warning",
    danger: "bg-danger/10 border-danger/30 text-danger",
    info: "bg-info/10 border-info/30 text-info",
    outline: "border-border bg-transparent text-ink-secondary",

    // AQI Severity Level mappings from docs/UI_DESIGN.md
    "Good": "bg-aqi-good/10 border-aqi-good/30 text-aqi-good",
    "Moderate": "bg-aqi-moderate/10 border-aqi-moderate/30 text-aqi-moderate",
    "Unhealthy (Sensitive)": "bg-aqi-unhealthySensitive/10 border-aqi-unhealthySensitive/30 text-aqi-unhealthySensitive",
    "Unhealthy": "bg-aqi-unhealthy/10 border-aqi-unhealthy/30 text-aqi-unhealthy",
    "Very Unhealthy": "bg-aqi-veryUnhealthy/10 border-aqi-veryUnhealthy/30 text-aqi-veryUnhealthy",
    "Hazardous": "bg-aqi-hazardous/10 border-aqi-hazardous/30 text-aqi-hazardous",
  };

  const selectedClass = variants[variant as keyof typeof variants] || variants.info;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase whitespace-nowrap ${selectedClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

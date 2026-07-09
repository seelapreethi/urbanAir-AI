import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`border border-border bg-surface rounded-xl p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-semibold tracking-tight font-display text-ink-primary ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-ink-secondary leading-normal ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
}

export function StatCard({ title, value, icon, trend, className = "", ...props }: StatCardProps) {
  return (
    <Card className={`relative overflow-hidden ${className}`} {...props}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-xs font-semibold text-ink-secondary uppercase tracking-widest font-mono">
          {title}
        </span>
        {icon && <div className="text-ink-tertiary">{icon}</div>}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-3xl font-extrabold tracking-tight font-mono text-ink-primary leading-none">
          {value}
        </span>
        
        {trend && (
          <div className="flex items-center gap-1.5 text-xs">
            {trend.direction === "up" && (
              <TrendingUp className="w-3.5 h-3.5 text-danger" />
            )}
            {trend.direction === "down" && (
              <TrendingDown className="w-3.5 h-3.5 text-success" />
            )}
            <span
              className={`font-semibold ${
                trend.direction === "up"
                  ? "text-danger"
                  : trend.direction === "down"
                  ? "text-success"
                  : "text-ink-tertiary"
              }`}
            >
              {trend.direction === "up" ? "+" : ""}
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-ink-tertiary">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

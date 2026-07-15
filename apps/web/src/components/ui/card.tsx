import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`border border-border/80 bg-[#111419]/90 backdrop-blur-md rounded-xl p-5 shadow-lg shadow-black/20 hover:border-teal-500/20 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col gap-1 mb-3.5 border-b border-border/40 pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-[14px] font-bold tracking-wider font-display uppercase text-slate-100 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-[11px] text-slate-400 leading-normal font-sans ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-slate-300 font-sans ${className}`} {...props}>
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
    <Card className={`relative overflow-hidden group hover:scale-[1.01] hover:shadow-teal-900/5 transition-all duration-300 ${className}`} {...props}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500/60 group-hover:bg-teal-500 transition-colors" />
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display">
          {title}
        </span>
        {icon && <div className="text-slate-500 group-hover:text-teal-400 transition-colors">{icon}</div>}
      </div>

      <div className="flex flex-col gap-1 pl-1">
        <span className="text-2xl font-extrabold tracking-tight font-display text-slate-100 leading-none">
          {value}
        </span>
        
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-[10.5px]">
            {trend.direction === "up" && (
              <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            )}
            {trend.direction === "down" && (
              <TrendingDown className="w-3.5 h-3.5 text-teal-400" />
            )}
            <span
              className={`font-semibold ${
                trend.direction === "up"
                  ? "text-rose-500"
                  : trend.direction === "down"
                  ? "text-teal-400"
                  : "text-slate-500"
              }`}
            >
              {trend.direction === "up" ? "+" : ""}
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-slate-500 font-medium ml-0.5">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

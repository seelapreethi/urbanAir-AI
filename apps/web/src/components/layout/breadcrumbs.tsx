"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Split path segments
  const segments = pathname.split("/").filter(Boolean);
  
  if (segments.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-ink-tertiary mb-5" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-ink-primary transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        
        // Capitalize segment text and replace hyphens
        const name = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-ink-tertiary/60" />
            {isLast ? (
              <span className="font-semibold text-ink-secondary">{name}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-ink-primary transition-colors font-medium"
              >
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

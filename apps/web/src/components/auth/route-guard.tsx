"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Role-based restrictions check
    const officerRoutes = [
      "/dashboard/enforcement",
      "/dashboard/simulator",
      "/dashboard/reports",
    ];

    const adminRoutes = [
      "/dashboard/settings",
      "/dashboard/admin",
    ];

    const userRole = user?.role_name || "Citizen";

    if (userRole === "Citizen") {
      // Citizen cannot access officer/admin routes
      const isRestricted = officerRoutes.some(route => pathname.startsWith(route)) ||
                          adminRoutes.some(route => pathname.startsWith(route));
      if (isRestricted) {
        router.push("/unauthorized");
        return;
      }
    } else if (userRole === "City Officer") {
      // Officer cannot access admin-only routes
      const isAdminOnly = adminRoutes.some(route => pathname.startsWith(route));
      if (isAdminOnly) {
        router.push("/unauthorized");
        return;
      }
    }

    setIsAuthorized(true);
  }, [isAuthenticated, pathname, router, user]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
        <span className="text-sm font-semibold text-ink-secondary">
          Checking authorization credentials...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  allowedRoles: string[];
  fallbackPath?: string;
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, fallbackPath = "/unauthorized", children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const userRole = user?.role_name || "Citizen";
    if (!allowedRoles.includes(userRole)) {
      router.push(fallbackPath);
      return;
    }

    setHasPermission(true);
  }, [isAuthenticated, allowedRoles, user, fallbackPath, router]);

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
        <Loader2 className="w-6 h-6 text-accent animate-spin mb-3" />
        <span className="text-xs text-ink-secondary">Verifying permission rights...</span>
      </div>
    );
  }

  return <>{children}</>;
}

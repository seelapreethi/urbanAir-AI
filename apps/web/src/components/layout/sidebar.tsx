"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import {
  Activity,
  Map,
  TrendingUp,
  ShieldAlert,
  BarChart2,
  HeartPulse,
  Sliders,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const userRole = user?.role_name || "Citizen";

  const menuGroups = [
    {
      title: "Monitoring & Intelligence",
      items: [
        { name: "Command Center", path: "/dashboard", icon: <Activity className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Source Attribution", path: "/source-attribution", icon: <Map className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Forecast", path: "/forecast", icon: <TrendingUp className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Enforcement", path: "/enforcement", icon: <ShieldAlert className="w-5 h-5" />, roles: ["Administrator", "City Officer"] },
        { name: "Cities", path: "/dashboard/cities", icon: <BarChart2 className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Advisory", path: "/advisory", icon: <HeartPulse className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
      ],
    },
    {
      title: "Tools & AI",
      items: [
        { name: "AI Assistant", path: "/chat", icon: <MessageSquare className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Simulator", path: "/scenario", icon: <Sliders className="w-5 h-5" />, roles: ["Administrator", "City Officer"] },
        { name: "Explainable AI", path: "/explain", icon: <Activity className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Reports", path: "/reports", icon: <FileText className="w-5 h-5" />, roles: ["Administrator", "City Officer"] },
      ],
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border bg-surface transition-all duration-200 ease-in-out ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-canvas flex-shrink-0">
            ⬡
          </div>
          {!collapsed && (
            <span className="font-bold tracking-tight font-display whitespace-nowrap text-ink-primary">
              UrbanAir <span className="text-accent">AI</span>
            </span>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="w-6 h-6 rounded border border-border flex items-center justify-center text-ink-secondary hover:bg-surface-raised transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {menuGroups.map((group, gIdx) => {
          // Filter items based on user role permissions
          const visibleItems = group.items.filter(item => item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1.5">
              {!collapsed && (
                <h4 className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider px-3 mb-2">
                  {group.title}
                </h4>
              )}
              {visibleItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 h-10 rounded-lg text-sm transition-all group relative ${
                      isActive
                        ? "bg-accent-soft text-accent font-semibold"
                        : "text-ink-secondary hover:bg-surface-raised hover:text-ink-primary"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent rounded-r" />
                    )}
                    <span className={isActive ? "text-accent" : "text-ink-secondary group-hover:text-ink-primary"}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.name}</span>}
                    {collapsed && (
                      <div className="absolute left-16 bg-surface-raised border border-border px-2.5 py-1.5 rounded-lg text-xs font-semibold invisible group-hover:visible whitespace-nowrap shadow-md z-50 text-ink-primary">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border space-y-1.5">
        {(userRole === "Administrator") && (
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 h-10 rounded-lg text-sm text-ink-secondary hover:bg-surface-raised hover:text-ink-primary group relative ${
              pathname === "/dashboard/settings" ? "bg-accent-soft text-accent font-semibold" : ""
            }`}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span>Settings</span>}
            {collapsed && (
              <div className="absolute left-16 bg-surface-raised border border-border px-2.5 py-1.5 rounded-lg text-xs font-semibold invisible group-hover:visible whitespace-nowrap shadow-md z-50 text-ink-primary">
                Settings
              </div>
            )}
          </Link>
        )}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm text-danger hover:bg-danger/10 group relative"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sign Out</span>}
          {collapsed && (
            <div className="absolute left-16 bg-surface-raised border border-border px-2.5 py-1.5 rounded-lg text-xs font-semibold invisible group-hover:visible whitespace-nowrap shadow-md z-50 text-danger">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}

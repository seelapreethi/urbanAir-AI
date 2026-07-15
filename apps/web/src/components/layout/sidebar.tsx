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
  MessageSquare,
  Brain,
  Compass,
  Cpu
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
      title: "GIS Command Center",
      items: [
        { name: "Command Center", path: "/dashboard", icon: <Activity className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Interactive GIS Map", path: "/map", icon: <Map className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Source Attribution", path: "/source-attribution", icon: <Compass className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
      ],
    },
    {
      title: "AI Decision Engine",
      items: [
        { name: "Predictive Forecast", path: "/forecast", icon: <TrendingUp className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Explainable AI (XAI)", path: "/explain", icon: <Cpu className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Scenario Simulator", path: "/scenario", icon: <Sliders className="w-5 h-5" />, roles: ["Administrator", "City Officer"] },
        { name: "Intelligence Hub", path: "/dashboard/intelligence", icon: <Brain className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
      ],
    },
    {
      title: "Operations & Reports",
      items: [
        { name: "Health Advisories", path: "/advisory", icon: <HeartPulse className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Incident Enforcement", path: "/enforcement", icon: <ShieldAlert className="w-5 h-5" />, roles: ["Administrator", "City Officer"] },
        { name: "Comparative Metrics", path: "/dashboard/cities", icon: <BarChart2 className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
        { name: "Generated Reports", path: "/reports", icon: <FileText className="w-5 h-5" />, roles: ["Administrator", "City Officer"] },
        { name: "AI Agent Assistant", path: "/chat", icon: <MessageSquare className="w-5 h-5" />, roles: ["Administrator", "City Officer", "Citizen"] },
      ],
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border bg-surface dark:bg-[#0B0E14] transition-all duration-300 ease-in-out select-none ${
        collapsed ? "w-[76px]" : "w-[260px]"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 border-b border-border/60 flex items-center justify-between px-5 bg-canvas/30 dark:bg-[#080B0F]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-teal-600/20 border border-teal-500/35 flex items-center justify-center font-bold text-teal-500 dark:text-teal-400 flex-shrink-0">
            ⬡
          </div>
          {!collapsed && (
            <span className="font-bold tracking-widest font-display whitespace-nowrap text-slate-800 dark:text-white text-sm uppercase">
              UrbanAir <span className="text-teal-600 dark:text-teal-400 font-extrabold">AI</span>
            </span>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="w-6 h-6 rounded border border-border/80 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-white transition-all duration-200 bg-slate-100/50 dark:bg-slate-900/40"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter(item => item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1.5 text-left">
              {!collapsed && (
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2.5 font-display">
                  {group.title}
                </h4>
              )}
              {visibleItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-3.5 px-3.5 h-11 rounded-lg text-[14.5px] transition-all duration-200 group relative border ${
                      isActive
                        ? "bg-slate-200/50 dark:bg-slate-900/60 border-teal-500/20 text-slate-900 dark:text-white font-semibold shadow-sm"
                        : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-2.5 bottom-2.5 w-0.75 bg-teal-550 dark:bg-teal-400 rounded-r" />
                    )}
                    <span className={isActive ? "text-teal-650 dark:text-teal-400" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className={`truncate font-medium transition-colors ${
                        isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                      }`}>
                        {item.name}
                      </span>
                    )}
                    {collapsed && (
                      <div className="absolute left-20 bg-surface dark:bg-[#0E121A] border border-border px-2.5 py-1.5 rounded-lg text-xs font-semibold invisible group-hover:visible whitespace-nowrap shadow-md z-50 text-slate-800 dark:text-white">
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
      <div className="p-4 border-t border-border/50 space-y-1.5 bg-canvas/30 dark:bg-[#080B0F]">
        {(userRole === "Administrator") && (
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3.5 px-3.5 h-11 rounded-lg text-[14.5px] border border-transparent group relative ${
              pathname === "/dashboard/settings" 
                ? "bg-slate-200/50 dark:bg-slate-900/60 border-teal-500/20 text-slate-900 dark:text-white font-semibold" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
            {!collapsed && (
              <span className={pathname === "/dashboard/settings" ? "text-slate-900 dark:text-white font-semibold" : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"}>
                System Preferences
              </span>
            )}
            {collapsed && (
              <div className="absolute left-20 bg-surface dark:bg-[#0E121A] border border-border px-2.5 py-1.5 rounded-lg text-xs font-semibold invisible group-hover:visible whitespace-nowrap shadow-md z-50 text-slate-800 dark:text-white">
                System Preferences
              </div>
            )}
          </Link>
        )}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-3.5 h-11 rounded-lg text-[14.5px] text-rose-600 dark:text-rose-400 hover:bg-rose-100/40 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-500/20 group relative transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-450" />
          {!collapsed && <span className="font-semibold text-rose-700 dark:text-rose-200 group-hover:text-rose-800 dark:group-hover:text-rose-100">Sign Out</span>}
          {collapsed && (
            <div className="absolute left-20 bg-surface dark:bg-[#0E121A] border border-border px-2.5 py-1.5 rounded-lg text-xs font-semibold invisible group-hover:visible whitespace-nowrap shadow-md z-50 text-rose-500 dark:text-rose-400">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}

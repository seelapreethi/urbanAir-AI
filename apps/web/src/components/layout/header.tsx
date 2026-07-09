"use client";

import React, { useState } from "react";
import { useCityStore } from "@/store/city";
import { useAuthStore } from "@/store/auth";
import { useTheme } from "next-themes";
import {
  Menu,
  ChevronDown,
  Search,
  Sun,
  Moon,
  Bell,
  Check,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onOpenMobileDrawer: () => void;
}

export function Header({ onOpenMobileDrawer }: HeaderProps) {
  const router = useRouter();
  const { selectedCity, setCity } = useCityStore();
  const { user, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const citiesList = ["Vijayawada", "Hyderabad", "Bengaluru", "Chennai", "Delhi"];

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 z-20 relative">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileDrawer}
          className="md:hidden p-1.5 rounded border border-border text-ink-secondary hover:bg-surface-raised transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* City Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-canvas text-xs font-semibold hover:bg-surface-raised transition-all text-ink-primary"
          >
            <span>City: {selectedCity}</span>
            <ChevronDown className="w-3.5 h-3.5 text-ink-secondary" />
          </button>
          
          {cityDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setCityDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-40 bg-surface border border-border rounded-lg shadow-lg py-1 z-40">
                {citiesList.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-xs hover:bg-surface-raised transition-colors text-left text-ink-primary font-medium"
                  >
                    <span>{city}</span>
                    {selectedCity === city && (
                      <Check className="w-3.5 h-3.5 text-accent" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Search Input bar */}
        <div className="hidden sm:flex items-center gap-2 px-3 h-9 w-48 rounded-lg border border-border bg-canvas text-ink-tertiary">
          <Search className="w-4 h-4" />
          <span className="text-xs">Search (Cmd+K)</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-lg border border-border bg-canvas flex items-center justify-center text-ink-secondary hover:bg-surface-raised transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button className="w-9 h-9 rounded-lg border border-border bg-canvas flex items-center justify-center text-ink-secondary hover:bg-surface-raised relative transition-colors">
          <Bell className="w-4 h-4" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger"></div>
        </button>

        {/* Profile Menu Dropdown */}
        <div className="relative border-l border-border pl-4">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-xs">
              {user?.first_name ? user.first_name[0].toUpperCase() : "U"}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-semibold leading-none text-ink-primary">
                {user?.first_name || "User"}
              </span>
              <span className="text-[10px] text-ink-tertiary mt-1 leading-none font-medium">
                {user?.role_name || "Officer"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-ink-secondary hidden lg:block" />
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2.5 w-48 bg-surface border border-border rounded-lg shadow-lg py-1 z-40">
                <div className="px-3.5 py-2 border-b border-border">
                  <span className="block text-xs font-semibold text-ink-primary">
                    {user?.first_name} {user?.last_name || ""}
                  </span>
                  <span className="block text-[10px] text-ink-tertiary mt-0.5 truncate">
                    {user?.email}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    router.push("/dashboard/profile");
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-ink-secondary hover:bg-surface-raised hover:text-ink-primary transition-colors text-left"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>

                {user?.role_name === "Administrator" && (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      router.push("/dashboard/settings");
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-ink-secondary hover:bg-surface-raised hover:text-ink-primary transition-colors text-left"
                  >
                    <Settings className="w-4 h-4" />
                    Admin Settings
                  </button>
                )}

                <div className="border-t border-border mt-1 pt-1" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-danger hover:bg-danger/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

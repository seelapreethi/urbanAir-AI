"use client";

import React, { useState, useEffect } from "react";
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
  LogOut,
  Cpu,
  Calendar
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
  const [todayStr, setTodayStr] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const citiesList = [
    "Vijayawada", "Hyderabad", "Bengaluru", "Chennai", "Delhi", 
    "Mumbai", "Kolkata", "Pune", "Ahmedabad", "Visakhapatnam"
  ];

  useEffect(() => {
    const d = new Date();
    setTodayStr(d.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchVal.trim().toLowerCase();
    const matchedCity = citiesList.find(c => c.toLowerCase() === query);
    if (matchedCity) {
      setCity(matchedCity);
      setSearchVal("");
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border/60 bg-[#0B0E14]/85 backdrop-blur-md flex items-center justify-between px-6 z-20 relative select-none">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileDrawer}
          className="md:hidden p-1.5 rounded border border-border text-slate-400 hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* City Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="flex items-center gap-2 h-9.5 px-3 rounded-lg border border-border/80 bg-slate-900/60 hover:bg-slate-800/60 text-xs font-semibold hover:border-teal-500/30 transition-all text-slate-200"
          >
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">CITY:</span>
            <span className="text-teal-400 font-extrabold">{selectedCity}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          
          {cityDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setCityDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-48 bg-[#0E121A] border border-border rounded-lg shadow-xl py-1 z-40 max-h-[300px] overflow-y-auto">
                <div className="px-3 py-1.5 border-b border-border/40 text-[9px] font-bold text-slate-500 tracking-wider">
                  SELECT WARD HUB
                </div>
                {citiesList.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-slate-800/40 transition-colors text-left text-slate-300 font-medium"
                  >
                    <span>{city}</span>
                    {selectedCity === city && (
                      <Check className="w-3 h-3 text-teal-400" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Search Input bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center gap-2.5 px-3.5 h-9.5 w-56 rounded-lg border border-border/80 bg-slate-900/40 focus-within:border-teal-500/40 transition-all">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search city (e.g. Pune)..."
            className="bg-transparent text-xs text-slate-200 outline-none w-full font-sans placeholder-slate-500 font-medium"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        {/* Model Version Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 h-7.5 rounded bg-teal-950/20 border border-teal-500/20 text-[10px] font-bold text-teal-400 select-none tracking-wider">
          <Cpu className="w-3.5 h-3.5" />
          <span>XGBOOST V3.2 (ML MODE)</span>
        </div>

        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 px-3 h-7.5 rounded bg-slate-900/60 border border-border/80 text-[10px] font-bold text-slate-400 select-none tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{todayStr.toUpperCase()}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9.5 h-9.5 rounded-lg border border-border bg-slate-900/40 flex items-center justify-center text-slate-400 hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button className="w-9.5 h-9.5 rounded-lg border border-border bg-slate-900/40 flex items-center justify-center text-slate-400 hover:bg-slate-800 relative transition-colors">
          <Bell className="w-4 h-4" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-teal-500 ring-2 ring-[#0B0E14]"></div>
        </button>

        {/* Profile Menu Dropdown */}
        <div className="relative border-l border-border/80 pl-3">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-8.5 h-8.5 rounded-full bg-teal-600/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-400 text-xs">
              {user?.first_name ? user.first_name[0].toUpperCase() : "U"}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-[12.5px] font-bold leading-none text-slate-200">
                {user?.first_name || "User"}
              </span>
              <span className="text-[9.5px] text-slate-500 mt-1.5 leading-none uppercase tracking-wider font-bold">
                {user?.role_name || "Officer"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden lg:block" />
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2.5 w-52 bg-[#0E121A] border border-border rounded-lg shadow-xl py-1 z-40">
                <div className="px-3.5 py-2 border-b border-border/50">
                  <span className="block text-xs font-bold text-slate-200">
                    {user?.first_name} {user?.last_name || ""}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5 truncate font-medium">
                    {user?.email}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    router.push("/dashboard/profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-400 hover:bg-slate-800/40 hover:text-slate-100 transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  My Profile
                </button>

                {user?.role_name === "Administrator" && (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      router.push("/dashboard/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-400 hover:bg-slate-800/40 hover:text-slate-100 transition-colors text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    Admin Settings
                  </button>
                )}

                <div className="border-t border-border/50 mt-1 pt-1" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-rose-400 hover:bg-rose-950/20 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
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

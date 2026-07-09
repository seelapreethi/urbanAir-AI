"use client";

import React, { useState, useEffect } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Footer } from "@/components/layout/footer";
import { MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount logic for hydration warning avoidance
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!mounted) return null;

  const userRole = user?.role_name || "Citizen";

  const mobileNavItems = [
    { name: "Command Center", path: "/dashboard", roles: ["Administrator", "City Officer", "Citizen"] },
    { name: "Source Attribution", path: "/source-attribution", roles: ["Administrator", "City Officer", "Citizen"] },
    { name: "Forecast", path: "/forecast", roles: ["Administrator", "City Officer", "Citizen"] },
    { name: "Enforcement", path: "/enforcement", roles: ["Administrator", "City Officer"] },
    { name: "Cities", path: "/dashboard/cities", roles: ["Administrator", "City Officer", "Citizen"] },
    { name: "Advisory", path: "/advisory", roles: ["Administrator", "City Officer", "Citizen"] },
    { name: "AI Assistant", path: "/chat", roles: ["Administrator", "City Officer", "Citizen"] },
    { name: "Simulator", path: "/scenario", roles: ["Administrator", "City Officer"] },
    { name: "Explainable AI", path: "/explain", roles: ["Administrator", "City Officer", "Citizen"] },
    { name: "Reports", path: "/reports", roles: ["Administrator", "City Officer"] },
    { name: "Settings", path: "/dashboard/settings", roles: ["Administrator"] },
  ];

  return (
    <RouteGuard>
      <div className="min-h-screen bg-canvas text-ink-primary flex font-sans">
        {/* Desktop Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Mobile Navigation Drawer Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-canvas/80 backdrop-blur-sm">
            <div className="w-[240px] bg-surface border-r border-border flex flex-col p-4 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-canvas">
                    ⬡
                  </div>
                  <span className="font-bold tracking-tight font-display text-ink-primary">
                    UrbanAir AI
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-6 h-6 rounded border border-border flex items-center justify-center text-ink-secondary hover:bg-surface-raised transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {mobileNavItems
                  .filter((item) => item.roles.includes(userRole))
                  .map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center px-3.5 h-10 rounded-lg text-sm transition-colors ${
                        pathname === item.path
                          ? "bg-accent-soft text-accent font-semibold"
                          : "text-ink-secondary hover:bg-surface-raised"
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
              </nav>

              <div className="pt-4 border-t border-border space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 h-10 rounded-lg text-sm text-danger hover:bg-danger/5 transition-colors text-left font-semibold"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onOpenMobileDrawer={() => setMobileOpen(true)} />
          
          <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
            <div className="max-w-7xl mx-auto w-full flex-1">
              <Breadcrumbs />
              <div className="space-y-8">{children}</div>
            </div>
            
            <Footer />
          </main>
        </div>

        {/* Floating AI Assistant Trigger Button */}
        <button
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-accent text-canvas flex items-center justify-center shadow-lg hover:opacity-90 active:scale-[0.96] transition-all z-40 group"
          title="Ask AI Assistant (Cmd+J)"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute right-14 bg-surface border border-border px-3 py-1.5 rounded-lg text-xs font-semibold invisible group-hover:visible whitespace-nowrap shadow-md text-ink-primary">
            Ask AI Assistant (Cmd+J)
          </span>
        </button>
      </div>
    </RouteGuard>
  );
}

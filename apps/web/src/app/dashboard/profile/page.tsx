"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Key, Clipboard, Check } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [tokenCopied, setTokenCopied] = useState(false);
  
  const devToken = "ua_live_token_8x9ef3bc09121aefb8390b10ec";

  const handleCopyToken = () => {
    navigator.clipboard.writeText(devToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display text-slate-100">
          User Account Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          Municipal authority credentials, active roles, and system developer access variables.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card - User Card info */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 space-y-4">
          <div className="w-20 h-20 rounded-full bg-teal-600/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-400 text-3xl select-none">
            {user?.first_name ? user.first_name[0].toUpperCase() : "U"}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-100 font-display">
              {user?.first_name} {user?.last_name || ""}
            </h2>
            <Badge variant={user?.role_name === "Administrator" ? "danger" : "success"}>
              {user?.role_name || "City Officer"}
            </Badge>
          </div>

          <div className="w-full border-t border-border/40 my-3" />

          <div className="w-full text-xs space-y-3 font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Privilege Rank: Level 3</span>
            </div>
          </div>
        </Card>

        {/* Right Card - Details and Token Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Privileges & Assigned Zones</CardTitle>
              <CardDescription>Configured operational zones matching municipal registries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 uppercase tracking-widest text-[9.5px]">Assigned District Control</span>
                  <span className="block text-slate-200 font-semibold">Vijayawada Hub (HQ)</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 uppercase tracking-widest text-[9.5px]">Last Login Coordinates</span>
                  <span className="block text-slate-200 font-mono font-semibold">16.5062° N, 80.6480° E</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 uppercase tracking-widest text-[9.5px]">Enforcement Authority status</span>
                  <span className="block text-emerald-400 font-bold">Authorized (Active)</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 uppercase tracking-widest text-[9.5px]">Assigned Inspection Wards</span>
                  <span className="block text-slate-200 font-semibold">Ward 3, Ward 7, Ward 12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Developer Access API Token</CardTitle>
              <CardDescription>Authenticate with the UrbanAir AI CLI tools and sensor pipelines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 bg-[#0E121A] border border-border/80 px-3.5 py-2.5 rounded-lg text-xs font-mono text-slate-300">
                <Key className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span className="truncate flex-1 select-all">{devToken}</span>
                <button
                  onClick={handleCopyToken}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Copy Token"
                >
                  {tokenCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                WARNING: Treat this token as a password. Never commit it to git repositories or share it with unauthorized personnel.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

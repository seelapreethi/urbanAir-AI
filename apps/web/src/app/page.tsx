"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Activity, 
  Map, 
  TrendingUp, 
  ShieldAlert, 
  BarChart2, 
  MessageSquare, 
  ChevronRight, 
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  // Feature grid item details
  const features = [
    {
      icon: <Activity className="w-5 h-5 text-accent" />,
      title: "AI Command Center",
      desc: "One look overview of city health, live metrics, top risk parameters, and rapid enforcement handoffs."
    },
    {
      icon: <Map className="w-5 h-5 text-accent" />,
      title: "Geospatial Source Attribution",
      desc: "Choropleth mapping attributing pollution down to the ward level across traffic, waste burning, and construction."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-accent" />,
      title: "Hyperlocal AQI Forecast",
      desc: "24h, 48h, and 72h predictive modeling using XGBoost and Prophet models, explaining confidence scores."
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-accent" />,
      title: "Enforcement Intelligence",
      desc: "Automatically rank inspection targets based on forecasted violations and AI-selected hotspots."
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-accent" />,
      title: "Multi-City Dashboard",
      desc: "Compare air quality index baselines, seasonal trends, and compliance profiles across different districts."
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-accent" />,
      title: "AI Chat Assistant",
      desc: "A natural language control interface that queries the city knowledge-base, generating PDF summaries on demand."
    }
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans overflow-x-hidden">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-canvas/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-canvas">
              ⬡
            </div>
            <span className="text-xl font-bold tracking-tight font-display">
              UrbanAir <span className="text-accent">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-ink-secondary">
            <a href="#features" className="hover:text-ink-primary transition-colors">Features</a>
            <a href="#about" className="hover:text-ink-primary transition-colors">About</a>
            <Link href="/docs" className="hover:text-ink-primary transition-colors">Documentation</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-4 h-9 flex items-center justify-center text-sm font-medium border border-border rounded-lg bg-surface hover:bg-surface-raised transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-semibold text-accent mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Decision-Support Intelligence for Smart Cities
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 font-display"
          >
            From Monitoring Pollution <br className="hidden sm:inline" />
            to <span className="text-accent">Preventing It.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-ink-secondary max-w-xl leading-relaxed mb-8"
          >
            An AI-powered control room for city administrators. Predict high-pollution events, trace root causes, and simulate policy actions before executing them.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/login" 
              className="px-6 h-12 flex items-center justify-center gap-2 rounded-lg bg-accent text-canvas font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
            >
              Explore the Platform
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a 
              href="#features" 
              className="px-6 h-12 flex items-center justify-center rounded-lg border border-border bg-surface font-semibold hover:bg-surface-raised transition-all"
            >
              Watch Demo
            </a>
          </motion.div>
        </div>

        {/* Pulse Ring Hero Demo */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl border border-border bg-surface flex flex-col items-center justify-center p-8 shadow-lg"
          >
            {/* Signature AQI Pulse Ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-44 h-44 sm:w-48 sm:h-48 rounded-full border-4 border-dashed border-aqi-unhealthySensitive/40 aqi-pulse-ring-active"
                style={{ "--pulse-color": "var(--aqi-unhealthy-sensitive)" } as React.CSSProperties}
              ></div>
            </div>

            {/* Inner Ring Circle */}
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-border bg-canvas flex flex-col items-center justify-center z-10">
              <span className="text-xs text-ink-secondary tracking-widest font-mono uppercase mb-1">Vijayawada</span>
              <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tighter text-aqi-unhealthySensitive leading-none">
                147
              </span>
              <span className="text-[10px] text-aqi-unhealthySensitive font-semibold mt-2 tracking-wide uppercase">
                Unhealthy (S)
              </span>
            </div>

            {/* Micro Sparkline Indicator */}
            <div className="mt-6 flex flex-col items-center z-10 text-center">
              <div className="text-xs text-ink-secondary flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-aqi-unhealthy" />
                <span>▲ +12 vs yesterday</span>
              </div>
              <span className="text-[10px] text-ink-tertiary mt-1">Live Update • 12 mins ago</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Signature Explainer Strip */}
      <section className="border-t border-b border-border bg-surface/50 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm sm:text-base font-medium tracking-tight text-ink-secondary max-w-3xl mx-auto leading-relaxed">
            {"\"Instead of telling you AQI is "}<span className="text-aqi-unhealthy font-semibold">250</span>{", we explain "}<span className="text-ink-primary font-bold underline decoration-accent">WHY</span>{", predict "}<span className="text-ink-primary font-bold underline decoration-accent">{"WHAT'S NEXT"}</span>{", locate "}<span className="text-ink-primary font-bold underline decoration-accent">WHO</span>{" is affected, and recommend exactly "}<span className="text-ink-primary font-bold underline decoration-accent">WHAT TO DO</span>{".\""}
          </p>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4 font-display">System Modules</h2>
          <p className="text-ink-secondary">Enterprise-grade AI components coordinating city environmental intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-xl border border-border bg-surface hover:bg-surface-raised hover:scale-[1.01] hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-canvas border border-border flex items-center justify-center mb-4 group-hover:border-accent/40 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 font-display">{feature.title}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="border-t border-border py-20 text-center bg-surface-raised/20">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-4 font-display">
            Built for Municipal Corporations & Pollution Control Boards
          </h2>
          <p className="text-ink-secondary mb-8 text-sm">
            Empower municipal bodies with actionable source insights and scenario prediction maps.
          </p>
          <Link 
            href="/login" 
            className="inline-flex px-6 h-12 items-center justify-center rounded-lg bg-accent text-canvas font-semibold hover:opacity-90 transition-all shadow-md"
          >
            Access Console
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-ink-tertiary bg-canvas">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 UrbanAir AI. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink-secondary">Privacy Policy</a>
            <a href="#" className="hover:text-ink-secondary">Terms of Service</a>
            <a href="#" className="hover:text-ink-secondary">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useCityStore } from "@/store/city";
import { useAdvisoryStore } from "@/store/advisory";
import { Loader2, HeartPulse, Languages, Users, Bell, AlertTriangle, ShieldCheck, Sun, Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const USER_GROUPS = [
  "General Public",
  "Children",
  "Senior Citizens",
  "Pregnant Women",
  "Asthma Patients",
  "Outdoor Workers",
  "Cyclists",
  "Joggers"
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "ta", name: "Tamil (தமிழ்)" }
];

export default function AdvisoryPage() {
  const { selectedCity } = useCityStore();
  const {
    selectedUserGroup,
    selectedLanguage,
    advisorySummary,
    riskBreakdown,
    notifications,
    isLoading,
    error,
    setUserGroup,
    setLanguage,
    fetchAdvisoryData
  } = useAdvisoryStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchAdvisoryData(selectedCity, selectedUserGroup);
    }
  }, [selectedCity, selectedUserGroup, fetchAdvisoryData, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    if (risk === "Safe") return "text-[#10B981] border-[#10B981]/25 bg-[#10B981]/10";
    if (risk.includes("Low")) return "text-[#3B82F6] border-[#3B82F6]/25 bg-[#3B82F6]/10";
    if (risk.includes("Moderate")) return "text-[#F59E0B] border-[#F59E0B]/25 bg-[#F59E0B]/10";
    if (risk.includes("High")) return "text-[#EF4444] border-[#EF4444]/25 bg-[#EF4444]/10";
    return "text-[#8B5CF6] border-[#8B5CF6]/25 bg-[#8B5CF6]/10";
  };

  const getAlertSeverityColor = (severity: string) => {
    if (severity === "High") return "bg-danger/10 text-danger border border-danger/20";
    if (severity === "Medium") return "bg-warning/10 text-warning border border-warning/20";
    return "bg-info/10 text-info border border-info/20";
  };

  // Mock translation wrapper
  const translate = (text: string) => {
    if (selectedLanguage === "en") return text;
    // Map of mock translates
    const dict: Record<string, Record<string, string>> = {
      hi: {
        "Public Health Advisory": "सार्वजनिक स्वास्थ्य सलाह",
        "General Public": "सामान्य जनता",
        "Safe": "सुरक्षित",
        "Low Risk": "कम जोखिम",
        "Moderate Risk": "मध्यम जोखिम",
        "High Risk": "उच्च जोखिम",
        "Ventilation Advice": "वेंटिलेशन सलाह",
        "Mask Recommendation": "मास्क की सिफारिश",
        "Outdoor Activity Advice": "बाहरी गतिविधि सलाह",
      },
      te: {
        "Public Health Advisory": "ప్రజా ఆరోగ్య సలహా",
        "General Public": "సాధారణ ప్రజలు",
        "Safe": "సురక్షితం",
        "Low Risk": "తక్కువ ప్రమాదం",
        "Moderate Risk": "మధ్యస్థ ప్రమాదం",
        "High Risk": "అధిక ప్రమాదం",
        "Ventilation Advice": "వెంటిలేషన్ సలహా",
        "Mask Recommendation": "మాస్క్ సిఫార్సు",
      }
    };
    return dict[selectedLanguage]?.[text] || text;
  };

  return (
    <RouteGuard>
      <div className="h-screen w-screen bg-canvas text-ink-primary flex overflow-hidden font-sans">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header onOpenMobileDrawer={() => {}} />

          {/* Subheader Toolbar */}
          <div className="flex items-center justify-between p-3.5 border-b border-border bg-surface text-xs z-20">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-accent animate-pulse" />
              <span className="font-bold text-ink-primary text-sm font-display">{translate("Public Health Advisory")}</span>
            </div>
            
            {/* Control panel selections */}
            <div className="flex items-center gap-3">
              {/* Language Selector Selector */}
              <div className="flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-ink-tertiary" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-8 px-2.5 rounded border border-border bg-canvas text-ink-primary outline-none focus:border-accent font-semibold"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div className="w-px h-4 bg-border"></div>

              {/* User Group Selector */}
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-ink-tertiary" />
                <select
                  value={selectedUserGroup}
                  onChange={(e) => setUserGroup(e.target.value)}
                  className="h-8 px-2.5 rounded border border-border bg-canvas text-ink-primary outline-none focus:border-accent font-semibold"
                >
                  {USER_GROUPS.map((g) => (
                    <option key={g} value={g}>{translate(g)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Body content scroller */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {error && (
              <div className="bg-danger-soft border border-danger/20 text-danger text-xs p-3.5 rounded-xl">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center p-8 bg-surface border border-border rounded-xl">
                <Loader2 className="w-6 h-6 animate-spin text-accent mr-3" />
                <span className="text-xs font-semibold text-ink-secondary">Analyzing medical warnings...</span>
              </div>
            )}

            {!isLoading && advisorySummary && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Columns - Risk Classifications and Advisories */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Gauge Overview */}
                  <div className="bg-surface border border-border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-6 relative shadow-sm">
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Current Index</span>
                        <span className="text-3xl font-black font-mono text-ink-primary mt-1 block">AQI {advisorySummary.current_aqi}</span>
                      </div>
                      <span className="text-[10px] text-ink-tertiary font-mono block mt-4">Driver: {advisorySummary.dominant_pollutant}</span>
                    </div>

                    <div className="flex flex-col justify-between border-y sm:border-y-0 sm:border-x border-border/40 py-4 sm:py-0 sm:px-6">
                      <div>
                        <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Risk Level</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider mt-2 border ${getRiskColor(advisorySummary.risk_classification.risk_level)}`}>
                          {translate(advisorySummary.risk_classification.risk_level)}
                        </span>
                      </div>
                      <span className="text-[10px] text-ink-tertiary font-mono block mt-4">Confidence: {advisorySummary.risk_classification.confidence_score}%</span>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Affected Population</span>
                        <span className="text-3xl font-black font-mono text-ink-primary mt-1 block">{advisorySummary.risk_classification.affected_population_pct}%</span>
                      </div>
                      <span className="text-[10px] text-ink-tertiary font-mono block mt-4">Scope: Sensitive demographics</span>
                    </div>
                  </div>

                  {/* Advisories Grid Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface border border-border rounded-xl p-5 space-y-3 shadow-sm hover:border-accent/40 transition-colors">
                      <div className="flex items-center gap-2 text-accent">
                        <Sun className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">{translate("Outdoor Activity Advice")}</span>
                      </div>
                      <p className="text-xs text-ink-secondary leading-relaxed font-semibold">
                        {advisorySummary.advisory.outdoor_activity_advice}
                      </p>
                    </div>

                    <div className="bg-surface border border-border rounded-xl p-5 space-y-3 shadow-sm hover:border-accent/40 transition-colors">
                      <div className="flex items-center gap-2 text-accent">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">{translate("Mask Recommendation")}</span>
                      </div>
                      <p className="text-xs text-ink-secondary leading-relaxed font-semibold">
                        {advisorySummary.advisory.mask_recommendation}
                      </p>
                    </div>

                    <div className="bg-surface border border-border rounded-xl p-5 space-y-3 shadow-sm hover:border-accent/40 transition-colors">
                      <div className="flex items-center gap-2 text-accent">
                        <Info className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">{translate("Ventilation Advice")}</span>
                      </div>
                      <p className="text-xs text-ink-secondary leading-relaxed font-semibold">
                        {advisorySummary.advisory.ventilation_advice}
                      </p>
                    </div>
                  </div>

                  {/* Risk demographic bar charts */}
                  {riskBreakdown && (() => {
                    const demographicsData = riskBreakdown.population_demographics.map((d) => {
                      let numericRiskValue = 1;
                      const riskLower = d.risk.toLowerCase();
                      if (riskLower.includes("severe") || riskLower.includes("very high") || riskLower.includes("hazardous")) {
                        numericRiskValue = 5;
                      } else if (riskLower.includes("high") || riskLower.includes("unhealthy")) {
                        numericRiskValue = 4;
                      } else if (riskLower.includes("moderate") || riskLower.includes("satisfactory")) {
                        numericRiskValue = 3;
                      } else if (riskLower.includes("low")) {
                        numericRiskValue = 2;
                      } else {
                        numericRiskValue = 1;
                      }
                      return {
                        group: d.group,
                        riskLevel: numericRiskValue,
                        riskLabel: d.risk
                      };
                    });

                    return (
                      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-accent" />
                          <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Demographic Risk Exposure Map</h4>
                        </div>
                        <div className="h-[200px] w-full text-[10px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demographicsData} layout="vertical" margin={{ top: 5, right: 15, left: 35, bottom: 5 }}>
                              <XAxis type="number" domain={[0, 5]} hide />
                              <YAxis type="category" dataKey="group" stroke="var(--ink-secondary)" tickLine={false} />
                              <Tooltip formatter={(value, name, props) => [props.payload.riskLabel, "Exposure Risk"]} />
                              <Bar dataKey="riskLevel" fill="#EF4444" fillOpacity={0.65} radius={[0, 4, 4, 0]} name="Exposure" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Right Column - Alert Notifications Center */}
                <div className="space-y-6">
                  
                  {/* Notifications list */}
                  <div className="bg-surface border border-border rounded-xl p-5 flex flex-col h-full min-h-[300px]">
                    <div className="flex items-center gap-2 pb-4 border-b border-border">
                      <Bell className="w-4 h-4 text-accent" />
                      <h3 className="text-sm font-bold text-ink-primary font-display">Notification Center</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pt-4 scrollbar-thin">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="border border-border rounded-xl p-3.5 flex flex-col gap-2 bg-canvas hover:border-accent/30 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-ink-tertiary font-mono">{n.created_at}</span>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${getAlertSeverityColor(n.severity)}`}>
                              {n.severity}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-ink-primary font-display flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                            {n.alert_title}
                          </h4>
                          <p className="text-[11px] text-ink-secondary leading-relaxed">
                            {n.alert_content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

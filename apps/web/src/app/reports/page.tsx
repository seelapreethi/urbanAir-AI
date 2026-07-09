"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useCityStore } from "@/store/city";
import { useReportStore } from "@/store/report";
import { Loader2, FileText, Download, Play, ShieldAlert, Award, Calendar, CheckSquare } from "lucide-react";

const MODULE_OPTIONS = [
  "AQI Overview",
  "Forecast Trend",
  "Hotspots List",
  "Enforcement Checklist",
  "Health Advisory"
];

const REPORT_TYPES = [
  "Daily AQI Report",
  "Weekly Report",
  "Monthly Report",
  "Executive Summary"
];

const FILE_FORMATS = [
  "PDF",
  "CSV",
  "Excel",
  "JSON"
];

export default function ReportsPage() {
  const { selectedCity } = useCityStore();
  const {
    reportsLog,
    generatedReportDetails,
    isLoading,
    error,
    fetchReportMetadata,
    generateReport
  } = useReportStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [reportTitle, setReportTitle] = useState("Vijayawada Air Quality Audit");
  const [reportType, setReportType] = useState("Weekly Report");
  const [fileFormat, setFileFormat] = useState("PDF");
  const [selectedModules, setSelectedModules] = useState<string[]>(["AQI Overview", "Hotspots List"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchReportMetadata();
    }
  }, [fetchReportMetadata, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const handleModuleToggle = (mod: string) => {
    if (selectedModules.includes(mod)) {
      setSelectedModules(selectedModules.filter((m) => m !== mod));
    } else {
      setSelectedModules([...selectedModules, mod]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;
    await generateReport(reportTitle, reportType, fileFormat, selectedCity, selectedModules);
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
              <FileText className="w-4 h-4 text-accent" />
              <span className="font-bold text-ink-primary text-sm font-display">Smart Report Generator</span>
            </div>
            <span className="font-mono text-ink-tertiary uppercase tracking-wider">
              Executive Agency Exporter ({selectedCity})
            </span>
          </div>

          {/* Main workspace panels */}
          <div className="flex-1 flex relative overflow-hidden bg-canvas">
            
            {/* Column 1 - Custom Builder Form */}
            <div className="w-[320px] border-r border-border bg-surface flex flex-col h-full overflow-hidden z-20">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-ink-primary uppercase tracking-wider font-mono">Report Builder</span>
              </div>

              <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin text-xs text-left">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink-secondary">Report Title:</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full h-8 px-2.5 rounded border border-border bg-canvas text-xs text-ink-primary focus:border-accent outline-none font-semibold"
                  />
                </div>

                {/* Report Type */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink-secondary">Report Type:</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full h-8 px-2 rounded border border-border bg-canvas text-ink-primary outline-none focus:border-accent font-semibold"
                  >
                    {REPORT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Format selection */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink-secondary">File Format:</label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    className="w-full h-8 px-2 rounded border border-border bg-canvas text-ink-primary outline-none focus:border-accent font-semibold"
                  >
                    {FILE_FORMATS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Enabled modules checklist */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Included Modules</span>
                  <div className="space-y-1.5">
                    {MODULE_OPTIONS.map((mod) => {
                      const isChecked = selectedModules.includes(mod);
                      return (
                        <button
                          type="button"
                          key={mod}
                          onClick={() => handleModuleToggle(mod)}
                          className={`w-full flex items-center justify-between p-2 rounded border text-left transition-colors ${
                            isChecked
                              ? "bg-accent/5 border-accent/20 text-ink-primary"
                              : "border-border bg-canvas text-ink-secondary hover:border-accent/40"
                          }`}
                        >
                          <span>{mod}</span>
                          <CheckSquare className={`w-3.5 h-3.5 ${isChecked ? "text-accent" : "text-ink-tertiary"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit builder */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-lg bg-accent text-canvas flex items-center justify-center gap-1.5 text-xs font-semibold shadow hover:bg-accent/90 disabled:opacity-50 transition-colors mt-6"
                >
                  <Play className="w-4 h-4 fill-canvas" />
                  <span>Generate Report</span>
                </button>
              </form>
            </div>

            {/* Column 2 - Central Report preview workspace */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger text-xs p-3.5 rounded-xl">
                  {error}
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center p-8 bg-surface border border-border rounded-xl">
                  <Loader2 className="w-6 h-6 animate-spin text-accent mr-3" />
                  <span className="text-xs font-semibold text-ink-secondary">Compiling executive assets...</span>
                </div>
              )}

              {!isLoading && generatedReportDetails && (
                <div className="bg-surface border border-border rounded-xl p-6 space-y-6 shadow-sm text-left max-w-2xl mx-auto w-full">
                  
                  {/* Mock PDF cover header */}
                  <div className="border-b border-border/40 pb-5 space-y-2 relative">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest block font-mono">
                      {generatedReportDetails.report_type} ({generatedReportDetails.file_format})
                    </span>
                    <h3 className="text-lg font-black text-ink-primary leading-snug font-display">{generatedReportDetails.title}</h3>
                    
                    <div className="flex gap-4 text-[10px] text-ink-tertiary font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Prepared: {new Date(generatedReportDetails.created_at).toLocaleDateString()}
                      </span>
                      <span>City: {generatedReportDetails.city}</span>
                    </div>

                    <a
                      href={generatedReportDetails.file_url}
                      download
                      className="absolute top-2 right-2 h-8 px-3 rounded bg-[#10B981] text-canvas flex items-center justify-center gap-1 text-[10px] font-bold shadow hover:bg-[#10B981]/90 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>

                  {/* Executive summary block */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Executive Summary</span>
                    <p className="text-xs text-ink-secondary leading-relaxed bg-canvas p-3 rounded-lg border border-border">
                      {generatedReportDetails.summary_text}
                    </p>
                  </div>

                  {/* Key findings listing */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Key Findings</span>
                    <div className="space-y-1.5">
                      {generatedReportDetails.key_findings.map((f, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-xs p-2 rounded border border-border/40">
                          <span className="font-mono text-accent font-bold">0{idx + 1}.</span>
                          <span className="text-ink-secondary">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations actions */}
                  <div className="border border-[#10B981]/25 bg-[#10B981]/5 rounded-xl p-4.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[#10B981]">
                      <Award className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Recommended Interventions</span>
                    </div>
                    <div className="space-y-1">
                      {generatedReportDetails.priority_actions.map((act, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-ink-primary leading-relaxed font-semibold">
                          <span>•</span>
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!generatedReportDetails && !isLoading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-xs text-ink-secondary">
                  <FileText className="w-8 h-8 text-accent/50 mb-3" />
                  <h4 className="font-bold text-ink-primary mb-1">Report Builder Sandbox</h4>
                  <p className="text-ink-tertiary">Select modules and click Generate Report to compile executive agency layouts.</p>
                </div>
              )}
            </div>

            {/* Column 3 - Right Panel compiled files history logs */}
            <div className="w-[280px] border-l border-border bg-surface flex flex-col h-full overflow-hidden text-left z-20">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold text-ink-primary font-display">Generated Logs</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                {reportsLog.map((log) => (
                  <div
                    key={log.report_id}
                    className="border border-border rounded-xl p-3 bg-canvas space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-ink-tertiary font-mono block">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                      <h4 className="text-xs font-bold text-ink-primary font-display truncate max-w-[220px]">
                        {log.title}
                      </h4>
                      <span className="text-[10px] text-ink-tertiary font-mono">{log.report_type} ({log.file_format})</span>
                    </div>

                    <a
                      href={`/exports/reports/vijayawada_report_${log.file_format.toLowerCase()}`}
                      download
                      className="w-full h-7 rounded border border-border bg-surface text-ink-secondary hover:bg-surface-raised flex items-center justify-center gap-1 text-[10px] font-bold mt-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

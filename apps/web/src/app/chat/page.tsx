"use client";

import React, { useEffect, useState, useRef } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useChatStore } from "@/store/chat";
import {
  MessageSquare,
  Plus,
  Send,
  Loader2,
  Sparkles,
  ShieldCheck,
  Brain,
  Compass,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const {
    selectedSessionId,
    historySessions,
    suggestions,
    activeMessages,
    activeResponseDetails,
    isTyping,
    isLoading,
    selectSession,
    fetchChatMetadata,
    sendMessage,
    startNewSession
  } = useChatStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchChatMetadata();
    }
  }, [fetchChatMetadata, mounted]);

  // Auto scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isTyping]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    const txt = inputText;
    setInputText("");
    await sendMessage(txt);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await sendMessage(suggestion);
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
              <MessageSquare className="w-4 h-4 text-accent animate-pulse" />
              <span className="font-bold text-ink-primary text-sm font-display">AI Chat Assistant</span>
            </div>
            <span className="font-mono text-ink-tertiary uppercase tracking-wider">
              RAG Engine: Multi-Module Context Matrix
            </span>
          </div>

          {/* Main Chat Area split into three columns */}
          <div className="flex-1 flex relative overflow-hidden bg-canvas">
            
            {/* Column 1 - Conversations History Sidebar inside the page */}
            <div className="w-[240px] border-r border-border bg-surface flex flex-col h-full overflow-hidden z-20">
              <div className="p-4 border-b border-border">
                <button
                  onClick={startNewSession}
                  className="w-full h-9 rounded-lg bg-accent text-canvas flex items-center justify-center gap-1.5 text-xs font-semibold shadow hover:bg-accent/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Conversation</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
                <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block px-2.5 pb-2 font-mono">
                  Discussions
                </span>
                {historySessions.map((session) => (
                  <button
                    key={session.conversation_id}
                    onClick={() => selectSession(session.conversation_id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-left border transition-colors ${
                      selectedSessionId === session.conversation_id
                        ? "bg-accent/5 border-accent/25 text-ink-primary font-semibold"
                        : "border-transparent text-ink-secondary hover:bg-surface-raised"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-ink-tertiary" />
                    <span className="truncate">{session.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2 - Central Conversational bubble log */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-canvas relative">
              {/* Messages log */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
                    <Sparkles className="w-10 h-10 text-accent/60 animate-bounce mb-4" />
                    <h3 className="text-sm font-bold text-ink-primary mb-2 font-display">Chat with UrbanAir AI</h3>
                    <p className="text-xs text-ink-tertiary leading-relaxed mb-6">
                      Ask me questions about live pollution vectors, 72h forecasts, emission source shares, or scheduler dispatch recommendations.
                    </p>

                    {/* Suggestions list chips */}
                    <div className="grid grid-cols-1 gap-2 w-full">
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(s)}
                          className="p-2.5 text-left rounded-lg bg-surface border border-border text-xs text-ink-secondary hover:border-accent hover:text-ink-primary transition-all text-left"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {activeMessages.map((msg, idx) => {
                      const isUser = msg.sender_role === "user";
                      return (
                        <div
                          key={idx}
                          className={`flex gap-3 max-w-[80%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[10px] ${
                            isUser ? "bg-accent text-canvas" : "bg-surface border border-border text-accent"
                          }`}>
                            {isUser ? "U" : "AI"}
                          </div>
                          
                          <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                            isUser
                              ? "bg-accent-soft text-ink-primary border border-accent/25 rounded-tr-none"
                              : "bg-surface border border-border text-ink-primary rounded-tl-none font-medium"
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex gap-3 mr-auto items-center">
                        <div className="w-7 h-7 rounded-full bg-surface border border-border text-accent flex items-center justify-center font-bold text-[10px]">
                          AI
                        </div>
                        <div className="bg-surface border border-border px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-150"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-300"></span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input sender form */}
              <div className="p-4 border-t border-border bg-surface">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your question here (e.g. Show pollution trend)..."
                    disabled={isTyping || isLoading}
                    className="flex-1 h-9 px-3 rounded-lg border border-border bg-canvas text-xs text-ink-primary outline-none focus:border-accent disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping || isLoading}
                    className="h-9 w-9 bg-accent text-canvas rounded-lg flex items-center justify-center shadow hover:bg-accent/90 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Column 3 - Right Panel details for active explainability data */}
            {activeResponseDetails ? (
              <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full overflow-hidden text-left z-20 relative">
                <div className="p-4 border-b border-border flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-ink-primary font-display">AI Explainability</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                  {/* Confidence score */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-raised p-3 rounded-lg border border-border">
                    <div className="text-center p-1">
                      <span className="text-[9px] text-ink-tertiary font-mono uppercase block">Confidence</span>
                      <span className="text-sm font-black text-accent font-mono mt-0.5 block">{activeResponseDetails.confidence_score}%</span>
                    </div>
                    <div className="text-center p-1 border-l border-border/40">
                      <span className="text-[9px] text-ink-tertiary font-mono uppercase block">Accuracy Rank</span>
                      <span className="text-sm font-black text-[#10B981] font-mono mt-0.5 block">High</span>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Reasoning Sequence</span>
                    <p className="text-xs text-ink-secondary leading-relaxed">{activeResponseDetails.reasoning_summary}</p>
                  </div>

                  {/* Supporting parameters listing */}
                  {Object.keys(activeResponseDetails.supporting_data).length > 0 && (
                    <div className="space-y-1.5 border-t border-border/40 pt-3">
                      <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest block font-mono">Supporting Parameters</span>
                      <div className="space-y-1 pt-1.5">
                        {Object.entries(activeResponseDetails.supporting_data).map(([k, v]) => (
                          <div key={k} className="flex justify-between items-center text-xs py-1 border-b border-border/20">
                            <span className="text-ink-tertiary font-mono">{k}:</span>
                            <span className="font-bold text-ink-primary">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related dashboards links */}
                  <div className="border border-accent/25 bg-accent-soft rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-accent">
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Related Dashboard Link</span>
                    </div>
                    <p className="text-xs text-ink-secondary leading-relaxed">
                      Visualize this data inside the dedicated matrix workspace:
                    </p>
                    <Link
                      href={activeResponseDetails.related_dashboard_link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline pt-1"
                    >
                      <span>Open Workspace Dashboard</span>
                      <Plus className="w-3.5 h-3.5 rotate-45" />
                    </Link>
                  </div>

                  {/* Explainability constraints */}
                  <div className="space-y-1.5 border-t border-border/40 pt-3 text-[10px] text-ink-tertiary">
                    <div className="flex items-center gap-1 text-accent font-semibold">
                      <Brain className="w-3.5 h-3.5" />
                      <span>{activeResponseDetails.explainability.methodology}</span>
                    </div>
                    <p className="leading-normal">{activeResponseDetails.explainability.limitations}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-[320px] border-l border-border bg-surface flex flex-col h-full items-center justify-center p-6 text-center text-xs text-ink-secondary z-20">
                <Compass className="w-8 h-8 text-accent/50 mb-3" />
                <h4 className="font-bold text-ink-primary mb-1">Explainability Panel</h4>
                <p className="text-ink-tertiary">Submit conversational queries in chat to render dynamic AI reasoning logs and supporting data.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

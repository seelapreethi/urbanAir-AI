import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface ChatMessage {
  sender_role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  conversation_id: string;
  title: string;
  messages: ChatMessage[];
}

export interface ChatApiResponse {
  message_received: string;
  conversation_id: string;
  response: {
    answer: string;
    reasoning_summary: string;
    supporting_data: Record<string, unknown>;
    confidence_score: number;
    suggested_followups: string[];
    related_dashboard_link: string;
    explainability: {
      methodology: string;
      limitations: string;
    };
  };
}

interface ChatState {
  selectedSessionId: string | null;
  historySessions: ChatSession[];
  suggestions: string[];
  activeMessages: ChatMessage[];
  activeResponseDetails: ChatApiResponse["response"] | null;
  isTyping: boolean;
  isLoading: boolean;
  error: string | null;

  selectSession: (sessionId: string | null) => void;
  fetchChatMetadata: () => Promise<void>;
  sendMessage: (messageText: string) => Promise<void>;
  startNewSession: () => void;
  resetChatState: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  selectedSessionId: null,
  historySessions: [],
  suggestions: [],
  activeMessages: [],
  activeResponseDetails: null,
  isTyping: false,
  isLoading: false,
  error: null,

  selectSession: (sessionId) => {
    set({ selectedSessionId: sessionId });
    if (!sessionId) {
      set({ activeMessages: [], activeResponseDetails: null });
      return;
    }
    const matched = get().historySessions.find((s) => s.conversation_id === sessionId);
    if (matched) {
      set({ activeMessages: matched.messages, activeResponseDetails: null });
    }
  },

  fetchChatMetadata: async () => {
    set({ isLoading: true, error: null });
    try {
      const [historyRes, suggestionsRes] = await Promise.all([
        apiClient.get<ChatSession[]>("/chat/history"),
        apiClient.get<string[]>("/chat/suggestions")
      ]);

      set({
        historySessions: historyRes.data || [],
        suggestions: suggestionsRes.data || [],
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load chat parameters.";
      set({
        error: errMsg,
        isLoading: false
      });
    }
  },

  sendMessage: async (messageText) => {
    const text = messageText.trim();
    if (!text) return;

    // 1. Add user message locally
    const currentMsgs = get().activeMessages;
    set({
      activeMessages: [...currentMsgs, { sender_role: "user", content: text }],
      isTyping: true,
      error: null
    });

    try {
      // 2. Post new message to backend
      const sessionId = get().selectedSessionId;
      const res = await apiClient.post<ChatApiResponse>("/chat/message", {
        message: text,
        conversation_id: sessionId
      });

      const responseDetails = res.data?.response;
      if (responseDetails) {
        set((state) => ({
          activeMessages: [
            ...state.activeMessages,
            { sender_role: "assistant", content: responseDetails.answer }
          ],
          activeResponseDetails: responseDetails,
          isTyping: false
        }));

        // Update history sessions list locally to simulate persistence
        const currentSessions = get().historySessions;
        const activeId = sessionId || res.data?.conversation_id || "new-id";
        
        const nextSessions = [...currentSessions];
        const matchedIdx = nextSessions.findIndex((s) => s.conversation_id === activeId);
        
        const newMsgPair: ChatMessage[] = [
          { sender_role: "user", content: text },
          { sender_role: "assistant", content: responseDetails.answer }
        ];

        if (matchedIdx !== -1) {
          nextSessions[matchedIdx] = {
            ...nextSessions[matchedIdx],
            messages: [...nextSessions[matchedIdx].messages, ...newMsgPair]
          };
        } else {
          nextSessions.unshift({
            conversation_id: activeId,
            title: text.length > 25 ? `${text.substring(0, 22)}...` : text,
            messages: newMsgPair
          });
        }

        set({
          historySessions: nextSessions,
          selectedSessionId: activeId
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to send chat message.";
      set({
        error: errMsg,
        isTyping: false
      });
    }
  },

  startNewSession: () => {
    set({
      selectedSessionId: null,
      activeMessages: [],
      activeResponseDetails: null
    });
  },

  resetChatState: () => set({
    selectedSessionId: null,
    historySessions: [],
    suggestions: [],
    activeMessages: [],
    activeResponseDetails: null,
    isTyping: false,
    isLoading: false,
    error: null
  })
}));

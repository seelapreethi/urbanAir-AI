import { create } from "zustand";

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration: number; // in milliseconds
  timestamp: number;
  dismissible: boolean;
}

interface UIState {
  // Global loading overlay state
  isGlobalLoading: boolean;
  setGlobalLoading: (isLoading: boolean) => void;
  
  // Transient notifications list queue
  notifications: ToastNotification[];
  addNotification: (
    notification: Omit<ToastNotification, "id" | "timestamp" | "duration" | "dismissible"> & {
      id?: string;
      duration?: number;
      dismissible?: boolean;
    }
  ) => void;
  dismissNotification: (id: string) => void;
  
  // Quick shorthand notification dispatch helpers
  notifySuccess: (title: string, message: string, duration?: number) => void;
  notifyError: (title: string, message: string, duration?: number) => void;
  notifyWarning: (title: string, message: string, duration?: number) => void;
  notifyInfo: (title: string, message: string, duration?: number) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isGlobalLoading: false,
  setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),
  
  notifications: [],
  addNotification: (notification) => {
    const id = notification.id || Math.random().toString(36).substring(2, 9);
    const timestamp = Date.now();
    const duration = notification.duration !== undefined ? notification.duration : 4000; // default 4 seconds
    const dismissible = notification.dismissible !== undefined ? notification.dismissible : true;

    const newNotification: ToastNotification = {
      ...notification,
      id,
      timestamp,
      duration,
      dismissible,
    };

    // Append to list
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-dismiss setup
    if (duration > 0) {
      setTimeout(() => {
        get().dismissNotification(id);
      }, duration);
    }
  },

  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  // Shorthands
  notifySuccess: (title, message, duration) => {
    get().addNotification({ title, message, type: "success", duration });
  },
  notifyError: (title, message, duration) => {
    get().addNotification({ title, message, type: "error", duration });
  },
  notifyWarning: (title, message, duration) => {
    get().addNotification({ title, message, type: "warning", duration });
  },
  notifyInfo: (title, message, duration) => {
    get().addNotification({ title, message, type: "info", duration });
  },
}));

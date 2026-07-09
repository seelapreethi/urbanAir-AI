import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface ReportLogItem {
  report_id: string;
  title: string;
  report_type: string;
  file_format: string;
  created_at: string;
}

export interface ReportTemplateItem {
  template_id: string;
  name: string;
  description: string;
  modules: string[];
}

export interface GeneratedReportResult {
  report_id: string;
  title: string;
  report_type: string;
  file_format: string;
  created_at: string;
  city: string;
  summary_text: string;
  key_findings: string[];
  priority_actions: string[];
  modules_compiled: string[];
  file_url: string;
}

export interface GenerateApiResponse {
  status: string;
  report_details: GeneratedReportResult;
}

interface ReportState {
  reportsLog: ReportLogItem[];
  templates: ReportTemplateItem[];
  generatedReportDetails: GeneratedReportResult | null;
  selectedTemplateId: string | null;
  isLoading: boolean;
  error: string | null;

  selectTemplate: (templateId: string | null) => void;
  fetchReportMetadata: () => Promise<void>;
  generateReport: (title: string, reportType: string, fileFormat: string, city: string, modules: string[]) => Promise<void>;
  resetReportState: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reportsLog: [],
  templates: [],
  generatedReportDetails: null,
  selectedTemplateId: null,
  isLoading: false,
  error: null,

  selectTemplate: (templateId) => {
    set({ selectedTemplateId: templateId });
  },

  fetchReportMetadata: async () => {
    set({ isLoading: true, error: null });
    try {
      const [logRes, templatesRes] = await Promise.all([
        apiClient.get<ReportLogItem[]>("/reports"),
        apiClient.get<ReportTemplateItem[]>("/reports/templates")
      ]);

      set({
        reportsLog: logRes.data || [],
        templates: templatesRes.data || [],
        isLoading: false
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load reporting configs.";
      set({ error: errMsg, isLoading: false });
    }
  },

  generateReport: async (title, reportType, fileFormat, city, modules) => {
    set({ isLoading: true, error: null, generatedReportDetails: null });
    try {
      const res = await apiClient.post<GenerateApiResponse>("/reports/generate", {
        title,
        report_type: reportType,
        file_format: fileFormat,
        city,
        modules
      });

      const details = res.data?.report_details;
      if (details) {
        set((state) => ({
          generatedReportDetails: details,
          reportsLog: [
            {
              report_id: details.report_id,
              title: details.title,
              report_type: details.report_type,
              file_format: details.file_format,
              created_at: details.created_at
            },
            ...state.reportsLog
          ],
          isLoading: false
        }));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to generate report file.";
      set({ error: errMsg, isLoading: false });
    }
  },

  resetReportState: () => set({
    reportsLog: [],
    templates: [],
    generatedReportDetails: null,
    selectedTemplateId: null,
    isLoading: false,
    error: null
  })
}));

import type { SavedReport } from '../types';

const STORAGE_KEY = 'ikigai_reports';

export const storage = {
  getReports(): SavedReport[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveReport(report: SavedReport): void {
    const reports = this.getReports();
    reports.unshift(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  deleteReport(id: string): void {
    const reports = this.getReports().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  getReport(id: string): SavedReport | null {
    return this.getReports().find(r => r.id === id) || null;
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const generateId = (): string => {
  return new Date().toISOString().replace(/[:.]/g, '-');
};

export const formatDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

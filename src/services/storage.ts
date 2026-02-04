import type { SavedReport } from '../types';
import { getApiBaseUrl } from './claude-api';

// Cache for API base URL (stores the promise to prevent concurrent fetches)
let apiBasePromise: Promise<string> | null = null;

const getApi = async (): Promise<string> => {
  if (!apiBasePromise) {
    apiBasePromise = getApiBaseUrl();
  }
  return apiBasePromise;
};

export const storage = {
  async getReports(): Promise<SavedReport[]> {
    try {
      const api = await getApi();
      const response = await fetch(`${api}/reports`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  },

  async getReport(id: string): Promise<SavedReport | null> {
    try {
      const api = await getApi();
      const response = await fetch(`${api}/reports/${encodeURIComponent(id)}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch report');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching report:', error);
      return null;
    }
  },

  async saveReport(report: SavedReport): Promise<boolean> {
    try {
      const api = await getApi();
      const response = await fetch(`${api}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (!response.ok) {
        throw new Error('Failed to save report');
      }
      return true;
    } catch (error) {
      console.error('Error saving report:', error);
      return false;
    }
  },

  async deleteReport(id: string): Promise<boolean> {
    try {
      const api = await getApi();
      const response = await fetch(`${api}/reports/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete report');
      }
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      return false;
    }
  },

  async updateReport(id: string, updates: { title?: string }): Promise<SavedReport | null> {
    try {
      const api = await getApi();
      const response = await fetch(`${api}/reports/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update report');
      }
      const data = await response.json();
      return data.report;
    } catch (error) {
      console.error('Error updating report:', error);
      return null;
    }
  },
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
    minute: '2-digit',
  });
};

import axiosInstance from './axiosInstance';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HillfogApiAdapter, hillfogApi } from '@/lib/adapters/hillfog-api-adapter';
import { authAdapter } from '@/lib/adapters/auth-adapter';
import { 
  HfScorecard, 
  HfKpi, 
  HfEmployee, 
  HfObjective, 
  HfMeasureData,
  HfDashboardData,
  HfReportData 
} from '@/types/hillfog';

// Enhanced API client that integrates with Hillfog backend
class HillfogClient {
  private adapter: HillfogApiAdapter;

  constructor() {
    this.adapter = hillfogApi;
  }

  // ==================== LEGACY METHODS (for backward compatibility) ====================
  
  // GET request (legacy)
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  }

  // POST request with JSON payload or Form Data (legacy)
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { useFormData?: boolean }
  ): Promise<T> {
    let payload = data;
    let headers = config?.headers;

    if (config?.useFormData) {
      // Convert object to application/x-www-form-urlencoded string
      payload = Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
      headers = {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      };
    }

    const response: AxiosResponse<T> = await axiosInstance.post(url, payload, { ...config, headers });
    return response.data;
  }

  // PUT request with JSON payload (legacy)
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
    return response.data;
  }

  // PATCH request (legacy)
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.patch(url, data, config);
    return response.data;
  }

  // DELETE request (legacy)
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
  }

  // ==================== HILLFOG-SPECIFIC METHODS ====================

  // Authentication
  async login(account: string, password: string) {
    return authAdapter.login(account, password);
  }

  async logout() {
    return authAdapter.logout();
  }

  async getCurrentUser() {
    return authAdapter.getCurrentUser();
  }

  async checkSession() {
    return authAdapter.checkSession();
  }

  // Scorecards
  async getScorecard(id: string): Promise<HfScorecard | null> {
    const response = await this.adapter.getScorecard(id);
    return response.success ? response.data || null : null;
  }

  async getScorecards(params?: { page?: number; pageSize?: number; searchValue?: string }) {
    const response = await this.adapter.getScorecards(params);
    return response.success ? response.gridData || [] : [];
  }

  async createScorecard(scorecard: Partial<HfScorecard>): Promise<HfScorecard | null> {
    const response = await this.adapter.createScorecard(scorecard);
    return response.success ? response.data || null : null;
  }

  async updateScorecard(id: string, scorecard: Partial<HfScorecard>): Promise<HfScorecard | null> {
    const response = await this.adapter.updateScorecard(id, scorecard);
    return response.success ? response.data || null : null;
  }

  async deleteScorecard(id: string): Promise<boolean> {
    const response = await this.adapter.deleteScorecard(id);
    return response.success;
  }

  // KPIs
  async getKpi(id: string): Promise<HfKpi | null> {
    const response = await this.adapter.getKpi(id);
    return response.success ? response.data || null : null;
  }

  async getKpis(params?: { page?: number; pageSize?: number; searchValue?: string }) {
    const response = await this.adapter.getKpis(params);
    return response.success ? response.gridData || [] : [];
  }

  async createKpi(kpi: Partial<HfKpi>): Promise<HfKpi | null> {
    const response = await this.adapter.createKpi(kpi);
    return response.success ? response.data || null : null;
  }

  async updateKpi(id: string, kpi: Partial<HfKpi>): Promise<HfKpi | null> {
    const response = await this.adapter.updateKpi(id, kpi);
    return response.success ? response.data || null : null;
  }

  async deleteKpi(id: string): Promise<boolean> {
    const response = await this.adapter.deleteKpi(id);
    return response.success;
  }

  // Employees
  async getEmployee(id: string): Promise<HfEmployee | null> {
    const response = await this.adapter.getEmployee(id);
    return response.success ? response.data || null : null;
  }

  async getEmployees(params?: { page?: number; pageSize?: number; searchValue?: string }) {
    const response = await this.adapter.getEmployees(params);
    return response.success ? response.gridData || [] : [];
  }

  // Objectives
  async getObjective(id: string): Promise<HfObjective | null> {
    const response = await this.adapter.getObjective(id);
    return response.success ? response.data || null : null;
  }

  async getObjectives(params?: { page?: number; pageSize?: number; searchValue?: string }) {
    const response = await this.adapter.getObjectives(params);
    return response.success ? response.gridData || [] : [];
  }

  // Measure Data
  async getMeasureData(kpiId: string, frequency: string, date: string): Promise<HfMeasureData[]> {
    const response = await this.adapter.getMeasureData(kpiId, frequency, date);
    return response.success ? response.gridData || [] : [];
  }

  async updateMeasureData(measureData: HfMeasureData[]): Promise<boolean> {
    const response = await this.adapter.updateMeasureData(measureData);
    return response.success;
  }

  // Dashboard
  async getPersonalDashboard(employeeId?: string): Promise<HfDashboardData | null> {
    const response = await this.adapter.getPersonalDashboard(employeeId);
    return response.success ? response.data || null : null;
  }

  // Reports
  async getKpiReport(params: {
    kpiId?: string;
    orgId?: string;
    frequency: string;
    startDate: string;
    endDate: string;
  }): Promise<HfReportData | null> {
    const response = await this.adapter.getKpiReport(params);
    return response.success ? response.data || null : null;
  }

  async getOkrReport(params: {
    objectiveId?: string;
    orgId?: string;
    frequency: string;
    startDate: string;
    endDate: string;
  }): Promise<HfReportData | null> {
    const response = await this.adapter.getOkrReport(params);
    return response.success ? response.data || null : null;
  }

  async getScorecardReport(scorecardId: string, frequency: string, date: string): Promise<HfReportData | null> {
    const response = await this.adapter.getScorecardReport(scorecardId, frequency, date);
    return response.success ? response.data || null : null;
  }

  // ==================== CONVENIENCE METHODS ====================

  // Map legacy endpoints to new methods for backward compatibility
  async fetchData<T>(endpoint: string, params?: any): Promise<T[]> {
    // Map common endpoints to new methods
    switch (endpoint) {
      case '/scorecards':
        return this.getScorecards(params) as Promise<T[]>;
      case '/measures':
      case '/kpis':
        return this.getKpis(params) as Promise<T[]>;
      case '/employees':
        return this.getEmployees(params) as Promise<T[]>;
      case '/objectives':
        return this.getObjectives(params) as Promise<T[]>;
      default:
        // Fallback to legacy method
        return this.get<T[]>(endpoint, { params });
    }
  }
}

// Export singleton instance
export const hillfogClient = new HillfogClient();
export default hillfogClient;
/**
 * Hillfog API Adapter
 * 
 * This adapter bridges the Next.js UI with the original Hillfog Spring Boot backend.
 * It handles the mapping between RESTful API calls and the original action-based endpoints.
 */

import { HfScorecard, HfKpi, HfEmployee, HfObjective, HfMeasureData } from '@/types/hillfog';
import { getHillfogConfig } from '@/config/hillfog';

export interface HillfogApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  gridData?: T[];
  totalCount?: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  searchValue?: string;
  orderBy?: string;
  sortType?: 'ASC' | 'DESC';
}

export class HillfogApiAdapter {
  private baseUrl: string;
  private config = getHillfogConfig();

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || this.config.BACKEND_URL;
  }

  /**
   * Generic method to make requests to Hillfog backend
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<HillfogApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.transformResponse(data);
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Transform Hillfog backend response to standardized format
   */
  private transformResponse<T>(data: any): HillfogApiResponse<T> {
    // Handle different response formats from Hillfog backend
    if (data.success !== undefined) {
      return data;
    }

    // Handle grid data responses
    if (data.gridData) {
      return {
        success: true,
        gridData: data.gridData,
        totalCount: data.totalCount || data.gridData.length,
      };
    }

    // Handle single entity responses
    return {
      success: true,
      data: data,
    };
  }

  /**
   * Transform field names from Hillfog format to standardized format
   */
  private transformEntity<T>(entity: any): T {
    if (!entity) return entity;

    const transformed = { ...entity };

    // Map common field transformations
    if (entity.oid) {
      transformed.id = entity.oid;
      delete transformed.oid;
    }

    if (entity.cdateString) {
      transformed.createdDate = entity.cdateString;
    }

    if (entity.udateString) {
      transformed.updatedDate = entity.udateString;
    }

    return transformed as T;
  }

  /**
   * Transform entity back to Hillfog format for saving
   */
  private transformToHillfogFormat(entity: any): any {
    const transformed = { ...entity };

    // Map standardized fields back to Hillfog format
    if (entity.id && !entity.oid) {
      transformed.oid = entity.id;
      delete transformed.id;
    }

    return transformed;
  }

  // ==================== SCORECARD OPERATIONS ====================

  async getScorecard(id: string): Promise<HillfogApiResponse<HfScorecard>> {
    const response = await this.makeRequest<any>(`/hfScorecardQueryGridJson?oid=${id}`);
    
    if (response.success && response.data) {
      response.data = this.transformEntity<HfScorecard>(response.data);
    }

    return response;
  }

  async getScorecards(params: QueryParams = {}): Promise<HillfogApiResponse<HfScorecard[]>> {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      pageSize: (params.pageSize || 10).toString(),
      ...(params.searchValue && { searchValue: params.searchValue }),
      ...(params.orderBy && { orderBy: params.orderBy }),
      ...(params.sortType && { sortType: params.sortType }),
    });

    const response = await this.makeRequest<any[]>(`/hfScorecardQueryGridJson?${queryParams}`);
    
    if (response.success && response.gridData) {
      response.gridData = response.gridData.map(item => this.transformEntity<HfScorecard>(item));
    }

    return response;
  }

  async createScorecard(scorecard: Partial<HfScorecard>): Promise<HillfogApiResponse<HfScorecard>> {
    const hillfogData = this.transformToHillfogFormat(scorecard);
    
    return this.makeRequest<HfScorecard>('/hfScorecardSaveJson', {
      method: 'POST',
      body: JSON.stringify(hillfogData),
    });
  }

  async updateScorecard(id: string, scorecard: Partial<HfScorecard>): Promise<HillfogApiResponse<HfScorecard>> {
    const hillfogData = this.transformToHillfogFormat({ ...scorecard, oid: id });
    
    return this.makeRequest<HfScorecard>('/hfScorecardUpdateJson', {
      method: 'POST',
      body: JSON.stringify(hillfogData),
    });
  }

  async deleteScorecard(id: string): Promise<HillfogApiResponse<void>> {
    return this.makeRequest<void>('/hfScorecardDeleteJson', {
      method: 'POST',
      body: JSON.stringify({ oid: id }),
    });
  }

  // ==================== KPI OPERATIONS ====================

  async getKpi(id: string): Promise<HillfogApiResponse<HfKpi>> {
    const response = await this.makeRequest<any>(`/hfKpiBaseQueryGridJson?oid=${id}`);
    
    if (response.success && response.data) {
      response.data = this.transformEntity<HfKpi>(response.data);
    }

    return response;
  }

  async getKpis(params: QueryParams = {}): Promise<HillfogApiResponse<HfKpi[]>> {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      pageSize: (params.pageSize || 10).toString(),
      ...(params.searchValue && { searchValue: params.searchValue }),
    });

    const response = await this.makeRequest<any[]>(`/hfKpiBaseQueryGridJson?${queryParams}`);
    
    if (response.success && response.gridData) {
      response.gridData = response.gridData.map(item => this.transformEntity<HfKpi>(item));
    }

    return response;
  }

  async createKpi(kpi: Partial<HfKpi>): Promise<HillfogApiResponse<HfKpi>> {
    const hillfogData = this.transformToHillfogFormat(kpi);
    
    return this.makeRequest<HfKpi>('/hfKpiBaseSaveJson', {
      method: 'POST',
      body: JSON.stringify(hillfogData),
    });
  }

  async updateKpi(id: string, kpi: Partial<HfKpi>): Promise<HillfogApiResponse<HfKpi>> {
    const hillfogData = this.transformToHillfogFormat({ ...kpi, oid: id });
    
    return this.makeRequest<HfKpi>('/hfKpiBaseUpdateJson', {
      method: 'POST',
      body: JSON.stringify(hillfogData),
    });
  }

  async deleteKpi(id: string): Promise<HillfogApiResponse<void>> {
    return this.makeRequest<void>('/hfKpiBaseDeleteJson', {
      method: 'POST',
      body: JSON.stringify({ oid: id }),
    });
  }

  // ==================== EMPLOYEE OPERATIONS ====================

  async getEmployee(id: string): Promise<HillfogApiResponse<HfEmployee>> {
    const response = await this.makeRequest<any>(`/hfEmployeeQueryGridJson?oid=${id}`);
    
    if (response.success && response.data) {
      response.data = this.transformEntity<HfEmployee>(response.data);
    }

    return response;
  }

  async getEmployees(params: QueryParams = {}): Promise<HillfogApiResponse<HfEmployee[]>> {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      pageSize: (params.pageSize || 10).toString(),
      ...(params.searchValue && { searchValue: params.searchValue }),
    });

    const response = await this.makeRequest<any[]>(`/hfEmployeeQueryGridJson?${queryParams}`);
    
    if (response.success && response.gridData) {
      response.gridData = response.gridData.map(item => this.transformEntity<HfEmployee>(item));
    }

    return response;
  }

  // ==================== OBJECTIVE OPERATIONS ====================

  async getObjective(id: string): Promise<HillfogApiResponse<HfObjective>> {
    const response = await this.makeRequest<any>(`/hfOkrBaseQueryGridJson?oid=${id}`);
    
    if (response.success && response.data) {
      response.data = this.transformEntity<HfObjective>(response.data);
    }

    return response;
  }

  async getObjectives(params: QueryParams = {}): Promise<HillfogApiResponse<HfObjective[]>> {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      pageSize: (params.pageSize || 10).toString(),
      ...(params.searchValue && { searchValue: params.searchValue }),
    });

    const response = await this.makeRequest<any[]>(`/hfOkrBaseQueryGridJson?${queryParams}`);
    
    if (response.success && response.gridData) {
      response.gridData = response.gridData.map(item => this.transformEntity<HfObjective>(item));
    }

    return response;
  }

  // ==================== MEASURE DATA OPERATIONS ====================

  async getMeasureData(kpiId: string, frequency: string, date: string): Promise<HillfogApiResponse<HfMeasureData[]>> {
    const queryParams = new URLSearchParams({
      kpiOid: kpiId,
      frequency,
      date,
    });

    const response = await this.makeRequest<any[]>(`/hfMeasureDataBodyJson?${queryParams}`);
    
    if (response.success && response.gridData) {
      response.gridData = response.gridData.map(item => this.transformEntity<HfMeasureData>(item));
    }

    return response;
  }

  async updateMeasureData(measureData: HfMeasureData[]): Promise<HillfogApiResponse<void>> {
    const hillfogData = measureData.map(item => this.transformToHillfogFormat(item));
    
    return this.makeRequest<void>('/hfMeasureDataUpdateJson', {
      method: 'POST',
      body: JSON.stringify({ measureDatas: hillfogData }),
    });
  }

  // ==================== DASHBOARD OPERATIONS ====================

  async getPersonalDashboard(employeeId?: string): Promise<HillfogApiResponse<any>> {
    const queryParams = employeeId ? `?empId=${employeeId}` : '';
    
    return this.makeRequest<any>(`/hfPersonalDashboardJson${queryParams}`);
  }

  // ==================== REPORT OPERATIONS ====================

  async getKpiReport(params: {
    kpiId?: string;
    orgId?: string;
    frequency: string;
    startDate: string;
    endDate: string;
  }): Promise<HillfogApiResponse<any>> {
    const queryParams = new URLSearchParams({
      frequency: params.frequency,
      startDate: params.startDate,
      endDate: params.endDate,
      ...(params.kpiId && { kpiId: params.kpiId }),
      ...(params.orgId && { orgId: params.orgId }),
    });

    return this.makeRequest<any>(`/hfKpiBaseReportJson?${queryParams}`);
  }

  async getOkrReport(params: {
    objectiveId?: string;
    orgId?: string;
    frequency: string;
    startDate: string;
    endDate: string;
  }): Promise<HillfogApiResponse<any>> {
    const queryParams = new URLSearchParams({
      frequency: params.frequency,
      startDate: params.startDate,
      endDate: params.endDate,
      ...(params.objectiveId && { objectiveId: params.objectiveId }),
      ...(params.orgId && { orgId: params.orgId }),
    });

    return this.makeRequest<any>(`/hfOkrBaseReportJson?${queryParams}`);
  }

  async getScorecardReport(scorecardId: string, frequency: string, date: string): Promise<HillfogApiResponse<any>> {
    const queryParams = new URLSearchParams({
      scorecardId,
      frequency,
      date,
    });

    return this.makeRequest<any>(`/hfScorecardReportJson?${queryParams}`);
  }
}

// Create singleton instance
export const hillfogApi = new HillfogApiAdapter();
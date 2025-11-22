import hillfogClient from '../hillfogClient';
import { HfKpi, HfKpiQueryResult, PageOf, QueryGridParams } from '../types';

class KpiService {
  // Query KPIs with pagination and search
  async queryGrid(params: QueryGridParams): Promise<PageOf<HfKpiQueryResult>> {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.searchValue) queryParams.append('searchValue', params.searchValue);
    if (params.sortField) queryParams.append('sortField', params.sortField);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return hillfogClient.get<PageOf<HfKpiQueryResult>>(
      `/kpi/query.action?${queryParams.toString()}`
    );
  }

  // Get all KPIs as a map (for selection dropdowns)
  async findMap(): Promise<Record<string, HfKpi>> {
    return hillfogClient.get<Record<string, HfKpi>>('/kpi/findMap.action');
  }

  // Get single KPI by OID
  async getByOid(oid: string): Promise<HfKpi> {
    return hillfogClient.get<HfKpi>(`/kpi/get.action?oid=${oid}`);
  }

  // Create new KPI
  async create(kpiData: Partial<HfKpi>): Promise<HfKpi> {
    return hillfogClient.post<HfKpi>('/kpi/save.action', kpiData);
  }

  // Update existing KPI
  async update(oid: string, kpiData: Partial<HfKpi>): Promise<HfKpi> {
    return hillfogClient.post<HfKpi>('/kpi/update.action', { ...kpiData, oid });
  }

  // Delete KPI
  async delete(oid: string): Promise<boolean> {
    return hillfogClient.post<boolean>('/kpi/delete.action', { oid });
  }
}

export const kpiService = new KpiService();
export default kpiService;
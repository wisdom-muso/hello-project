import { hillfogClient } from '@/api/hillfogClient';
import { ReportData } from '@/types';

const BASE_URL = '/reports';

const reportService = {
  getScorecardReport: async (params: any): Promise<ReportData> => {
    const response = await hillfogClient.post<ReportData>(`${BASE_URL}/scorecard`, params);
    return response;
  },
  getOkrReport: async (params: any): Promise<ReportData> => {
    const response = await hillfogClient.post<ReportData>(`${BASE_URL}/okr`, params);
    return response;
  },
  getAvailableReports: async (): Promise<Array<{ id: string, name: string }>> => {
    const response = await hillfogClient.get<Array<{ id: string, name: string }>>(`${BASE_URL}/list`);
    return response;
  }
};

export default reportService;

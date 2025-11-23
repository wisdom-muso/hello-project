import { hillfogClient } from '@/api/hillfogClient';
import { CommonQuery } from '@/types';

const BASE_URL = '/queries';

const queryService = {
  getAll: async (): Promise<CommonQuery[]> => {
    const response = await hillfogClient.get<CommonQuery[]>(BASE_URL);
    return response;
  },
  getById: async (oid: string): Promise<CommonQuery> => {
    const response = await hillfogClient.get<CommonQuery>(`${BASE_URL}/${oid}`);
    return response;
  },
  create: async (data: Omit<CommonQuery, 'oid'>): Promise<CommonQuery> => {
    const response = await hillfogClient.post<CommonQuery>(BASE_URL, data);
    return response;
  },
  update: async (oid: string, data: Partial<CommonQuery>): Promise<CommonQuery> => {
    const response = await hillfogClient.put<CommonQuery>(`${BASE_URL}/${oid}`, data);
    return response;
  },
  delete: async (oid: string): Promise<void> => {
    await hillfogClient.delete(`${BASE_URL}/${oid}`);
  },
  runQuery: async (sqlStatement: string): Promise<any[]> => {
    const response = await hillfogClient.post<any[]>(`${BASE_URL}/run`, { sql: sqlStatement });
    return response;
  },
};

export default queryService;

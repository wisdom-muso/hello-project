import { hillfogClient } from '@/api/hillfogClient';
import { AggregationMethod } from '@/types';

const BASE_URL = '/aggregations';

const aggregationService = {
  getAll: async (): Promise<AggregationMethod[]> => {
    const response = await hillfogClient.get<AggregationMethod[]>(BASE_URL);
    return response;
  },
  getById: async (oid: string): Promise<AggregationMethod> => {
    const response = await hillfogClient.get<AggregationMethod>(`${BASE_URL}/${oid}`);
    return response;
  },
  create: async (data: Omit<AggregationMethod, 'oid'>): Promise<AggregationMethod> => {
    const response = await hillfogClient.post<AggregationMethod>(BASE_URL, data);
    return response;
  },
  update: async (oid: string, data: Partial<AggregationMethod>): Promise<AggregationMethod> => {
    const response = await hillfogClient.put<AggregationMethod>(`${BASE_URL}/${oid}`, data);
    return response;
  },
  delete: async (oid: string): Promise<void> => {
    await hillfogClient.delete(`${BASE_URL}/${oid}`);
  },
};

export default aggregationService;

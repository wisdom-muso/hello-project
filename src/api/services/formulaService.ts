import { hillfogClient } from '@/api/hillfogClient';
import { Formula } from '@/types';

const BASE_URL = '/formulas';

const formulaService = {
  getAll: async (): Promise<Formula[]> => {
    const response = await hillfogClient.get<Formula[]>(BASE_URL);
    return response;
  },
  getById: async (oid: string): Promise<Formula> => {
    const response = await hillfogClient.get<Formula>(`${BASE_URL}/${oid}`);
    return response;
  },
  create: async (data: Omit<Formula, 'oid'>): Promise<Formula> => {
    const response = await hillfogClient.post<Formula>(BASE_URL, data);
    return response;
  },
  update: async (oid: string, data: Partial<Formula>): Promise<Formula> => {
    const response = await hillfogClient.put<Formula>(`${BASE_URL}/${oid}`, data);
    return response;
  },
  delete: async (oid: string): Promise<void> => {
    await hillfogClient.delete(`${BASE_URL}/${oid}`);
  },
};

export default formulaService;

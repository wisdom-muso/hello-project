import { hillfogClient } from '@/api/hillfogClient';
import { OkrBase } from '@/types';

const BASE_URL = '/okrs';

const okrService = {
  getAll: async (): Promise<OkrBase[]> => {
    const response = await hillfogClient.get<OkrBase[]>(BASE_URL);
    return response;
  },
  getById: async (oid: string): Promise<OkrBase> => {
    const response = await hillfogClient.get<OkrBase>(`${BASE_URL}/${oid}`);
    return response;
  },
  create: async (data: Omit<OkrBase, 'oid'>): Promise<OkrBase> => {
    const response = await hillfogClient.post<OkrBase>(BASE_URL, data);
    return response;
  },
  update: async (oid: string, data: Partial<OkrBase>): Promise<OkrBase> => {
    const response = await hillfogClient.put<OkrBase>(`${BASE_URL}/${oid}`, data);
    return response;
  },
  delete: async (oid: string): Promise<void> => {
    await hillfogClient.delete(`${BASE_URL}/${oid}`);
  },
};

export default okrService;

import { hillfogClient } from '@/api/hillfogClient';
import { PdcaCycle } from '@/types';

const BASE_URL = '/pdca';

const pdcaService = {
  getAll: async (): Promise<PdcaCycle[]> => {
    const response = await hillfogClient.get<PdcaCycle[]>(BASE_URL);
    return response;
  },
  getById: async (oid: string): Promise<PdcaCycle> => {
    const response = await hillfogClient.get<PdcaCycle>(`${BASE_URL}/${oid}`);
    return response;
  },
  create: async (data: Omit<PdcaCycle, 'oid'>): Promise<PdcaCycle> => {
    const response = await hillfogClient.post<PdcaCycle>(BASE_URL, data);
    return response;
  },
  update: async (oid: string, data: Partial<PdcaCycle>): Promise<PdcaCycle> => {
    const response = await hillfogClient.put<PdcaCycle>(`${BASE_URL}/${oid}`, data);
    return response;
  },
  delete: async (oid: string): Promise<void> => {
    await hillfogClient.delete(`${BASE_URL}/${oid}`);
  },
};

export default pdcaService;

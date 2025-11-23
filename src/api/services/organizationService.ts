import { hillfogClient } from '@/api/hillfogClient';
import { Organization } from '@/types';

const BASE_URL = '/organizations';

const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    const response = await hillfogClient.get<Organization[]>(BASE_URL);
    return response; // hillfogClient returns data directly
  },
  getById: async (oid: string): Promise<Organization> => {
    const response = await hillfogClient.get<Organization>(`${BASE_URL}/${oid}`);
    return response; // hillfogClient returns data directly
  },
  create: async (data: Omit<Organization, 'oid'>): Promise<Organization> => {
    const response = await hillfogClient.post<Organization>(BASE_URL, data);
    return response; // hillfogClient returns data directly
  },
  update: async (oid: string, data: Partial<Organization>): Promise<Organization> => {
    const response = await hillfogClient.put<Organization>(`${BASE_URL}/${oid}`, data);
    return response; // hillfogClient returns data directly
  },
  delete: async (oid: string): Promise<void> => {
    await hillfogClient.delete(`${BASE_URL}/${oid}`);
  },
};

export default organizationService;

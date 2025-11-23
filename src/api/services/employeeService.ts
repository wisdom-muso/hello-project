import { hillfogClient } from '@/api/hillfogClient';
import { Employee } from '@/types';

const BASE_URL = '/employees';

const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await hillfogClient.get<Employee[]>(BASE_URL);
    return response; // hillfogClient returns data directly
  },
  getById: async (oid: string): Promise<Employee> => {
    const response = await hillfogClient.get<Employee>(`${BASE_URL}/${oid}`);
    return response; // hillfogClient returns data directly
  },
  create: async (data: Omit<Employee, 'oid'>): Promise<Employee> => {
    const response = await hillfogClient.post<Employee>(BASE_URL, data);
    return response; // hillfogClient returns data directly
  },
  update: async (oid: string, data: Partial<Employee>): Promise<Employee> => {
    const response = await hillfogClient.put<Employee>(`${BASE_URL}/${oid}`, data);
    return response; // hillfogClient returns data directly
  },
  delete: async (oid: string): Promise<void> => {
    await hillfogClient.delete(`${BASE_URL}/${oid}`);
  },
};

export default employeeService;

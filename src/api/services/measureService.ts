import { hillfogClient } from '../hillfogClient';
import { MeasureDataInputBody } from '../types';

class MeasureService {
  // Get server-rendered HTML form for measure data input
  async getInputBody(
    kpiId: string,
    date: string,
    frequency: string
  ): Promise<MeasureDataInputBody> {
    const queryParams = new URLSearchParams();
    queryParams.append('kpiId', kpiId);
    queryParams.append('date', date);
    queryParams.append('frequency', frequency);

    return hillfogClient.get<MeasureDataInputBody>(
      `/hfMeasureDataBodyJson?${queryParams.toString()}`
    );
  }

  // Submit measure data update (with FormData from intercepted HTML form)
  async updateMeasureData(formData: FormData): Promise<boolean> {
    return hillfogClient.post<boolean>('/hfMeasureDataUpdateJson', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const measureService = new MeasureService();
export default measureService;
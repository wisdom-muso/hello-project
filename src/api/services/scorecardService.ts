import { hillfogClient } from '../hillfogClient';
import { HfScorecard, PageOf, QueryGridParams, IScorecardForm } from '../types';

export const scorecardService = {
  // Query scorecards with pagination
  queryGrid: async (params: QueryGridParams): Promise<PageOf<HfScorecard>> => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.searchValue) queryParams.append('searchValue', params.searchValue);
    if (params.sortField) queryParams.append('sortField', params.sortField);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return hillfogClient.get<PageOf<HfScorecard>>(
      `/scorecard/query.action?${queryParams.toString()}`
    );
  },

  // Get scorecard by OID
  getByOid: async (oid: string): Promise<HfScorecard> => {
    return hillfogClient.get<HfScorecard>(`/scorecard/get.action?oid=${oid}`);
  },

  // Create new scorecard
  create: async (data: IScorecardForm): Promise<HfScorecard> => {
    const { perspectives, ...scorecardData } = data;
    const payload = {
      ...scorecardData,
      perspectives: JSON.stringify({ items: perspectives }), // Backend expects { items: [...] } structure
    };
    
    return hillfogClient.post<HfScorecard>('/scorecard/save.action', payload, {
      ognlPrefix: 'scorecard',
      useFormData: true, // Send as form data to allow backend to read 'perspectives' as a parameter
    });
  },

  // Update scorecard
  update: async (oid: string, data: IScorecardForm): Promise<HfScorecard> => {
    const { perspectives, ...scorecardData } = data;
    const payload = {
      oid,
      ...scorecardData,
      perspectives: JSON.stringify({ items: perspectives }), // Backend expects { items: [...] } structure
    };

    return hillfogClient.post<HfScorecard>('/scorecard/update.action', payload, {
      ognlPrefix: 'scorecard',
      useFormData: true, // Send as form data to allow backend to read 'perspectives' as a parameter
    });
  },

  // Delete scorecard
  delete: async (oid: string): Promise<boolean> => {
    return hillfogClient.post<boolean>('/scorecard/delete.action', { oid });
  },
};

export default scorecardService;
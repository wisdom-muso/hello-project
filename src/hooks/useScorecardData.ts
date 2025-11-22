import { useState, useEffect, useCallback } from 'react';
import { Scorecard } from '@/types';
import { scorecardService } from '@/api/services';
import { message } from 'antd';

export const useScorecardData = (scorecardId?: string) => {
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch single scorecard by ID
  const fetchScorecard = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await scorecardService.getById(id);
      setScorecard(data);
      return data;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Failed to fetch scorecard');
      setError(error);
      message.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all scorecards
  const fetchScorecards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scorecardService.getAll();
      setScorecards(data);
      return data;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Failed to fetch scorecards');
      setError(error);
      message.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new scorecard
  const createScorecard = useCallback(async (data: Partial<Scorecard>) => {
    setLoading(true);
    setError(null);
    try {
      const newScorecard = await scorecardService.create(data);
      message.success('Scorecard created successfully');
      return { success: true, data: newScorecard };
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Failed to create scorecard');
      setError(error);
      message.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing scorecard
  const updateScorecard = useCallback(async (id: string, data: Partial<Scorecard>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedScorecard = await scorecardService.update(id, data);
      message.success('Scorecard updated successfully');
      return { success: true, data: updatedScorecard };
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Failed to update scorecard');
      setError(error);
      message.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete scorecard
  const deleteScorecard = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await scorecardService.delete(id);
      message.success('Scorecard deleted successfully');
      // Remove from local state if it exists
      setScorecards((prev) => prev.filter((s) => s.id !== id));
      return { success: true };
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Failed to delete scorecard');
      setError(error);
      message.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Search scorecards
  const searchScorecards = useCallback(async (query: string) => {
    if (!query.trim()) {
      return fetchScorecards();
    }

    setLoading(true);
    setError(null);
    try {
      const data = await scorecardService.search(query);
      setScorecards(data);
      return data;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('Failed to search scorecards');
      setError(error);
      message.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchScorecards]);

  // Refresh scorecard data
  const refresh = useCallback(() => {
    if (scorecardId) {
      return fetchScorecard(scorecardId);
    }
    return fetchScorecards();
  }, [scorecardId, fetchScorecard, fetchScorecards]);

  // Auto-fetch on mount if scorecardId is provided
  useEffect(() => {
    if (scorecardId) {
      fetchScorecard(scorecardId);
    }
  }, [scorecardId, fetchScorecard]);

  return {
    scorecard,
    scorecards,
    loading,
    error,
    fetchScorecard,
    fetchScorecards,
    createScorecard,
    updateScorecard,
    deleteScorecard,
    searchScorecards,
    refresh,
  };
};

export default useScorecardData;

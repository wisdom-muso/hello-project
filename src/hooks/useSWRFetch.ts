import useSWR from 'swr';
import { hillfogClient } from '@/api/hillfogClient';

export function useSWRFetch<T>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    async (url: string) => {
      return await hillfogClient.get<T>(url);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

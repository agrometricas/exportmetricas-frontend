import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type IncotermResponse = {
  id: number;
  name: string;
}[];

export function useIncoterms(): {
  data: IncotermResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const result: UseQueryResult<AxiosResponse<IncotermResponse>> = useQuery({
    queryKey: ['incoterms'],
    queryFn: () => axios.get(`/incoterm`),
  });

  const serialized = serializeQueryResult(result);

  return {
    data: serialized.data,
    isLoading: serialized.isLoading,
    isError: serialized.isError,
    error: serialized.error,
    refetch: serialized.refetch,
  };
}

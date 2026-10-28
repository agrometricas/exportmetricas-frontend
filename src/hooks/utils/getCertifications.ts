import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type CertificationResponse = {
  id: number;
  name: string;
}[];

export function useCertifications(): {
  data: CertificationResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const result: UseQueryResult<AxiosResponse<CertificationResponse>> = useQuery(
    {
      queryKey: qk('certifications'),
      queryFn: () => axios.get(`/certification`),
    }
  );

  const serialized = serializeQueryResult(result);

  return {
    data: serialized.data,
    isLoading: serialized.isLoading,
    isError: serialized.isError,
    error: serialized.error,
    refetch: serialized.refetch,
  };
}

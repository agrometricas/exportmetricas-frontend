import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { Country } from '../../types/location/country';

function listCountries(): Promise<AxiosResponse<Country[]>> {
  return axios.get<Country[]>('/location/countries');
}

export function useCountries(): {
  data: Country[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
} {
  const serialized = serializeQueryResult(
    useQuery({ queryKey: ['countries'], queryFn: listCountries })
  );

  return {
    data: serialized.data,
    isLoading: serialized.isLoading,
    isError: serialized.isError,
    error: serialized.error,
    refetch: serialized.refetch,
  };
}

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type CityResponse = {
    id: number;
    name: string;
    code: string;
}[];

export function useCities(countryId?: number): {
    data: CityResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void;
} {
    const result: UseQueryResult<AxiosResponse<CityResponse>> = useQuery({
        queryKey: ['cities', countryId],
        queryFn: () => axios.get(`/location/cities/${countryId}`),
        enabled: !!countryId
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

import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { Country } from '../../types/location/country';

type Params = PaginationParams;

type CountryResponse = {
    data: Country[];
    total: number;
    page: number;
    limit: number;
};

function listCountries(params: Params): Promise<AxiosResponse<CountryResponse>> {
    return axios
        .get<CountryResponse>('/location/countries', { params })
        .then((response) => response)
        .catch((error) => {
            if (error.response?.status === 404) {
                return {
                    data: {
                        data: [],
                        total: 0,
                        page: params.page,
                        limit: params.limit,
                    },
                    status: 404,
                    statusText: 'Not Found',
                    headers: {},
                    config: error.config,
                } as AxiosResponse<CountryResponse>;
            }
            throw error;
        });
}

export function useCountries({
    search = '',
    page = 1,
    limit = 10,
}: Params): {
    data: Country[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void;
} {
    const result: UseQueryResult<AxiosResponse<CountryResponse>> = useQuery({
        queryKey: ['countries', search, page, limit],
        queryFn: () => listCountries({ search, page, limit }),
        placeholderData: keepPreviousData
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

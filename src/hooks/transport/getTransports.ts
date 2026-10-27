import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { TransportResponse } from '../../types/transport/transport.response';

type Params = PaginationParams;

function listTransports(params: Params): Promise<AxiosResponse<TransportResponse[]>> {
    return axios.get('/transport', { params });
}

export function useTransports({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
    const result = useQuery({
        queryKey: ['transports', search, page, limit],
        queryFn: () => listTransports({ search, page, limit }),
        placeholderData: keepPreviousData
    });

    return serializeQueryResult(result);
}

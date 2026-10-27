import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { DepositResponse } from '../../types/deposit/deposit.response';

type Params = PaginationParams;

function listDeposits(params: Params): Promise<AxiosResponse<DepositResponse[]>> {
    return axios.get('/deposit', { params });
}

export function useDeposits({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
    const result = useQuery({
        queryKey: ['deposits', search, page, limit],
        queryFn: () => listDeposits({ search, page, limit }),
        placeholderData: keepPreviousData
    });

    return serializeQueryResult(result);
}

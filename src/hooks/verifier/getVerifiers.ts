import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { VerifierResponse } from '../../types/verifier/verifier.response';

type Params = PaginationParams;

function listVerifiers(params: Params): Promise<AxiosResponse<VerifierResponse[]>> {
    return axios.get('/verifier', { params });
}

export function useVerifiers({ search = '', page = 1, limit = 10 }: Params): ReturnType<typeof serializeQueryResult> {
    const result = useQuery({
        queryKey: ['verifiers', search, page, limit],
        queryFn: () => listVerifiers({ search, page, limit }),
        placeholderData: keepPreviousData
    });

    return serializeQueryResult(result);
}

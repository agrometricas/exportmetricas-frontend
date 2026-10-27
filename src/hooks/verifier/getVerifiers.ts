import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { VerifierResponse } from '../../types/verifier/verifier.response';

function listVerifiers(): Promise<AxiosResponse<VerifierResponse[]>> {
    return axios.get('/verifier');
}

export function useVerifiers(): ReturnType<typeof serializeQueryResult> {
    const result = useQuery({
        queryKey: ['verifiers'],
        queryFn: () => listVerifiers(),
    });

    return serializeQueryResult(result);
}

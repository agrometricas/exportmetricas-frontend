import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { TransportResponse } from '../../types/transport/transport.response';

function listTransports(): Promise<AxiosResponse<TransportResponse[]>> {
    return axios.get('/transport');
}

export function useTransports(): ReturnType<typeof serializeQueryResult> {
    const result = useQuery({
        queryKey: ['transports'],
        queryFn: () => listTransports(),
    });

    return serializeQueryResult(result);
}

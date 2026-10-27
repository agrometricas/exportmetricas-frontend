import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import { TransportType } from '../../types/transport/transport';

interface CreateTransportResponse {
    transportId: string;
}

export const createTransport = (
    data: Partial<TransportType>
): Promise<CreateTransportResponse> => {
    return axios.post('/transport', data);
};

export const useCreateTransport = (
    config?: UseMutationOptions<
        CreateTransportResponse,
        AxiosError<ServerErrorResponse>,
        Partial<TransportType>
    >
): UseMutationResult<
    CreateTransportResponse,
    AxiosError<ServerErrorResponse>,
    Partial<TransportType>
> => {
    return useMutation({
        mutationFn: createTransport,
        ...config
    });
};

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

export type UploadTransferImageDTO = {
  file: File;
  clientPaymentId: number;
  clientId: number;
};

export const uploadTransferImage = async ({
  file,
  clientPaymentId,
  clientId,
}: UploadTransferImageDTO): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post(
    `/client-payment/${clientPaymentId}/client/${clientId}/transfer`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response;
};

export type UseUploadTransferImageOptions = {
  config?: MutationConfig<typeof uploadTransferImage>;
};

export const useUploadTransferImage = ({
  config,
}: UseUploadTransferImageOptions = {}): UseMutationResult<
  AxiosResponse,
  AxiosError,
  UploadTransferImageDTO,
  unknown
> & {
  uploadTransferImage: (dto: UploadTransferImageDTO) => Promise<AxiosResponse>;
} => {
  const mutation = useMutation<
    AxiosResponse,
    AxiosError,
    UploadTransferImageDTO,
    unknown
  >({
    ...config,
    mutationFn: uploadTransferImage,
  });

  return { ...mutation, uploadTransferImage: mutation.mutateAsync };
};

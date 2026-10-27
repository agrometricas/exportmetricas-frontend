/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

type UploadTransferImageDTO = {
  file: File;
  producerPaymentId: number;
  merchantId: number;
};

const uploadTransferImage = async ({
  file,
  producerPaymentId,
  merchantId,
}: UploadTransferImageDTO): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return await axios.post(
    `/export/producer-payment/${producerPaymentId}/merchant/${merchantId}/transfer`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

type UseUploadTransferImageOptions = {
  config?: MutationConfig<typeof uploadTransferImage>;
};

export const useUploadTransferImage = ({
  config,
}: UseUploadTransferImageOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: uploadTransferImage,
  });

  return { ...mutation, uploadTransferImage: mutation.mutateAsync };
};

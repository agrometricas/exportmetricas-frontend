/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { RequiredCertificateType } from '@/types/box-brand/specifications/requiredCertificate';

interface CreateRequiredCertificateResponse {
  certificateId: string;
}

export const createRequiredCertificate = (
  data: Partial<RequiredCertificateType>
): Promise<CreateRequiredCertificateResponse> => {
  return axios.post('/box-brand/certificate', data);
};

type UseCreateRequiredCertificateOptions = {
  config?: MutationConfig<typeof createRequiredCertificate>;
};

export const useCreateRequiredCertificate = ({
  config,
}: UseCreateRequiredCertificateOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createRequiredCertificate,
  });

  return { ...mutation, createRequiredCertificate: mutation.mutate };
};

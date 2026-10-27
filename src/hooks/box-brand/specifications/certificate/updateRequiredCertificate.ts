/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { RequiredCertificateType } from '@/types/box-brand/specifications/requiredCertificate';

type updateRequiredCertificateDTO = {
  data: Partial<RequiredCertificateType>;
  certificateId: string;
};

const updateRequiredCertificate = ({
  data,
  certificateId,
}: updateRequiredCertificateDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/certificate/${certificateId}`, data);
};

type UseUpdateRequiredCertificateOptions = {
  config?: MutationConfig<typeof updateRequiredCertificate>;
};

export const useUpdateRequiredCertificate = ({
  config,
}: UseUpdateRequiredCertificateOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateRequiredCertificate,
  });

  return { ...mutation, updateRequiredCertificate: mutation.mutateAsync };
};

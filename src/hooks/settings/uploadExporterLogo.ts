/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

type uploadExporterLogoDTO = {
  logoImg: File;
  exporterId: string;
};

const uploadExporterLogo = async ({
  logoImg,
  exporterId,
}: uploadExporterLogoDTO): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', logoImg);

  return await axios.post(`/exporter/${exporterId}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

type UseUploadExporterLogoOptions = {
  config?: MutationConfig<typeof uploadExporterLogo>;
};

export const useUploadExporterLogo = ({
  config,
}: UseUploadExporterLogoOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: uploadExporterLogo,
  });

  return { ...mutation, uploadExporterLogo: mutation.mutateAsync };
};

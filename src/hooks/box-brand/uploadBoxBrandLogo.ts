/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

type uploadBoxBrandLogoDTO = {
  logoImg: File;
  boxBrandId: string;
};

const uploadBoxBrandLogo = async ({
  logoImg,
  boxBrandId,
}: uploadBoxBrandLogoDTO): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', logoImg);

  return await axios.post(`/box-brand/${boxBrandId}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

type UseUploadBoxBrandLogoOptions = {
  config?: MutationConfig<typeof uploadBoxBrandLogo>;
};

export const useUploadBoxBrandLogo = ({
  config,
}: UseUploadBoxBrandLogoOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: uploadBoxBrandLogo,
  });

  return { ...mutation, uploadBoxBrandLogo: mutation.mutateAsync };
};

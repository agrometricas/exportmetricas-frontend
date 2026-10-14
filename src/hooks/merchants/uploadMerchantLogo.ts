/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

type uploadMerchantLogoDTO = {
  logoImg: File;
  merchantId: string;
};

const uploadMerchantLogo = async ({
  logoImg,
  merchantId,
}: uploadMerchantLogoDTO): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', logoImg);

  return await axios.post(`/merchant/${merchantId}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

type UseUploadMerchantLogoOptions = {
  config?: MutationConfig<typeof uploadMerchantLogo>;
};

export const useUploadMerchantLogo = ({
  config,
}: UseUploadMerchantLogoOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: uploadMerchantLogo,
  });

  return { ...mutation, uploadMerchantLogo: mutation.mutateAsync };
};

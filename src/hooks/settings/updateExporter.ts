/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';

type UpdateExporterDTO = {
  cityId: number | string;
  countryId: number | string;
  provinceId: number | string;
  address: string;
  exporterId: string;
};

const updateExporter = async ({
  cityId,
  countryId,
  provinceId,
  address,
  exporterId,
}: UpdateExporterDTO): Promise<AxiosResponse> => {
  return await axios.post(`/exporter/update/${exporterId}`, {
    cityId,
    countryId,
    provinceId,
    address,
  });
};

type UseUpdateExporterOptions = {
  config?: MutationConfig<typeof updateExporter>;
};

export const useUpdateExporter = ({
  config,
}: UseUpdateExporterOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateExporter,
  });

  return { ...mutation, updateExporter: mutation.mutateAsync };
};

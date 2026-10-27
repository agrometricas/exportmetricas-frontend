/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import {
  CuttingSheetDelivery,
  CuttingSheetType,
} from '../../../types/cuttingSheet';

export const createCuttingSheet = (
  data: Partial<CuttingSheetType>
): Promise<CuttingSheetDelivery> => {
  return axios
    .post('/export/cutting-sheet', data)
    .then((response) => response.data);
};

type UseCreateCuttingSheetOptions = {
  config?: MutationConfig<typeof createCuttingSheet>;
};

export const useCreateCuttingSheet = ({
  config,
}: UseCreateCuttingSheetOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createCuttingSheet,
  });

  return { ...mutation, createCuttingSheet: mutation.mutate };
};

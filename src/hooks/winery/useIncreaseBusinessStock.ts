import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { BusinessMaterialStock } from '../../types/winery/businessMaterialStock';

interface IncreaseStockDto {
  currentStock: number;
}

export const increaseBusinessStock = async ({
  businessStockId,
  data,
}: {
  businessStockId: number;
  data: IncreaseStockDto;
}): Promise<BusinessMaterialStock> => {
  const response = await axios.patch(
    `/exporter-material-stock/business/${businessStockId}/increase`,
    data
  );
  return response.data;
};

export const useIncreaseBusinessStock = (
  businessStockId: number
): UseMutationResult<BusinessMaterialStock, AxiosError, IncreaseStockDto> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IncreaseStockDto) =>
      increaseBusinessStock({ businessStockId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['exporterMaterialStock'],
      });
    },
  });
};

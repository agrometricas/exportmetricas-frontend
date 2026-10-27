import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { ExporterMaterialStock } from '../../types/winery/exporterMaterialStock';

interface UpdateStockDto {
  currentStock: number;
  currentCost: number;
}

export const updateExporterMaterialStock = async ({
  stockId,
  data,
}: {
  stockId: number;
  data: UpdateStockDto;
}): Promise<ExporterMaterialStock> => {
  const response = await axios.patch(
    `/exporter-material-stock/update/${stockId}`,
    data
  );
  return response.data;
};

export const useUpdateExporterMaterialStock = (
  stockId: number
): UseMutationResult<ExporterMaterialStock, AxiosError, UpdateStockDto> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStockDto) =>
      updateExporterMaterialStock({ stockId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['exporterMaterialStock'],
      });
    },
  });
};

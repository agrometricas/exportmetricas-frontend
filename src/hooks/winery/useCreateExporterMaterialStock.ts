import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { ExporterMaterialStock } from '@/types/winery/exporterMaterialStock';

interface CreateExporterMaterialStockDto {
  exporterId: number;
  materialType: string;
  materialId: number;
  materialName: string;
  assignedStock: number;
  assignedCost: number;
  currentStock?: number;
  currentCost?: number;
}

export const createExporterMaterialStock = async (
  dto: CreateExporterMaterialStockDto
): Promise<ExporterMaterialStock> => {
  const response = await axios.post('/exporter-material-stock', dto);
  return response.data;
};

export const useCreateExporterMaterialStock = (): UseMutationResult<
  ExporterMaterialStock,
  AxiosError,
  CreateExporterMaterialStockDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExporterMaterialStock,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['exporterMaterialStock'],
      });
    },
  });
};

import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { BusinessMaterialStock } from '@/types/winery/businessMaterialStock';

interface AssignStockToBusinessDto {
  exporterId: number;
  businessId: number;
  materialType: string;
  materialId: number;
  quantity: number;
}

export const useCreateBusinessStockAssignment = (): UseMutationResult<
  BusinessMaterialStock,
  unknown,
  AssignStockToBusinessDto
> => {
  const queryClient = useQueryClient();

  return useMutation<BusinessMaterialStock, unknown, AssignStockToBusinessDto>({
    mutationFn: async (data): Promise<BusinessMaterialStock> => {
      const response = await axios.post(
        '/exporter-material-stock/assign',
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: qk('exporterMaterialStock'),
      });
    },
  });
};

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';

interface AdjustWeeklyDto {
  realStocks: { [exporterMaterialStockId: number]: number };
}

export const adjustWeekly = async (
  businessId: number,
  dto: AdjustWeeklyDto
): Promise<{ message: string }> => {
  const response = await axios.post(
    `/exporter-material-stock/adjust-business/${businessId}`,
    dto
  );
  return response.data;
};

export const useAdjustWeekly = (
  businessId: number
): UseMutationResult<{ message: string }, AxiosError, AdjustWeeklyDto> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto) => adjustWeekly(businessId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: qk('exporterMaterialStock'),
      });
    },
  });
};

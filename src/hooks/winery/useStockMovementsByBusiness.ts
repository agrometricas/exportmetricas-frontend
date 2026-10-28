import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ExporterBusinessMaterialStock } from '../../types/winery/exporterBusinessMaterialStock';

export const useStockMovementsByBusiness = (
  businessId: number | null
): UseQueryResult<ExporterBusinessMaterialStock[], unknown> => {
  return useQuery({
    queryKey: qk('stockMovements', businessId),
    queryFn: async () => {
      const { data } = await axios.get(
        `/exporter-material-stock/business/${businessId}`
      );
      return data;
    },
    enabled: !!businessId,
  });
};

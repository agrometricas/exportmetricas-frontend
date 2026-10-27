import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { Business } from '../../types/cuttingSheet.response';

export const useBusinessesByExporter = (
  exporterId: number
): UseQueryResult<Business[], unknown> => {
  return useQuery({
    queryKey: ['businesses', exporterId],
    queryFn: async () => {
      const { data } = await axios.get(`/exporter/${exporterId}/business`);
      return data;
    },
    enabled: !!exporterId,
  });
};

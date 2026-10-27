import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { LastFarmExportResponse } from '../../types/lastFarmExport';

export const getLastFarmExport = ({
  businessId,
}: {
  businessId: number;
}): Promise<AxiosResponse> => {
  return axios.get('/export/last', { params: { businessId } });
};

export const useLastFarmExport = ({
  businessId,
  enabled = true,
}: {
  businessId?: number;
  enabled?: boolean;
}): UseQueryResult<LastFarmExportResponse> => {
  const result = useQuery({
    queryKey: ['lastFarmExport', businessId],
    queryFn: () => getLastFarmExport({ businessId: Number(businessId) }),
    enabled: enabled && Number(businessId) > 0,
  });

  return serializeQueryResult(result) as UseQueryResult<LastFarmExportResponse>;
};

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../lib/axios';
import { ExporterUser } from '../../types/exporterUser';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listExporterUsers(
  exporterId: string
): Promise<AxiosResponse<ExporterUser[]>> {
  return axios.get(`/exporters/${exporterId}/users`);
}

export function useExporterUsers(
  exporterId?: string
): UseQueryResult<ExporterUser[], unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('exporterUsers', exporterId),
      queryFn: () => listExporterUsers(exporterId as string),
      enabled: !!exporterId,
    })
  );
}

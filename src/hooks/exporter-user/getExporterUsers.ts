import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
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
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery(
      ['exporterUsers', exporterId],
      () => listExporterUsers(exporterId as string),
      { enabled: !!exporterId }
    )
  );
}

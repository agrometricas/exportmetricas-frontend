import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../../lib/axios';
import { SuppliesProposal } from '../../../types/suppliesProposal';
import { serializeQueryResult } from '../../../utils/serializeQueryResult';

function getSuppliesProposal(
  exportId: number
): Promise<AxiosResponse<SuppliesProposal>> {
  return axios.get(`/export/${exportId}/supplies-proposal`);
}

export function useSuppliesProposal(
  exportId: number | undefined
): UseQueryResult<SuppliesProposal, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('suppliesProposal', exportId),
      queryFn: () => getSuppliesProposal(exportId as number),
      enabled: Boolean(exportId),
    })
  );
}

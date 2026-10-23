import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
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
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery(
      ['suppliesProposal', exportId],
      () => getSuppliesProposal(exportId as number),
      { enabled: Boolean(exportId) }
    )
  );
}

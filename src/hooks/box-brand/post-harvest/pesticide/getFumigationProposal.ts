import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import { FumigationProposal } from '@/types/suppliesProposal';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function getFumigationProposal(
  boxQuantity: number
): Promise<AxiosResponse<FumigationProposal[]>> {
  return axios.get('/box-brand/fumigation-proposal', {
    params: { boxQuantity },
  });
}

export function useFumigationProposal(
  boxQuantity: number
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery(
      ['fumigationProposal', boxQuantity],
      () => getFumigationProposal(boxQuantity),
      { enabled: boxQuantity > 0, keepPreviousData: true }
    )
  );
}

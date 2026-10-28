import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
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
): UseQueryResult<FumigationProposal[], unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['fumigationProposal', boxQuantity],
      queryFn: () => getFumigationProposal(boxQuantity),
      enabled: boxQuantity > 0,
      placeholderData: keepPreviousData,
    })
  );
}

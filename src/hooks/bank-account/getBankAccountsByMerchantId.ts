import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PaginationParams } from '@/types/paginationParams';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

type Params = PaginationParams;

interface Body {
  id: number;
}

function listBankAccountByMerchantId(
  params: Params,
  body: Body
): Promise<AxiosResponse> {
  return axios.get(`/bank-account/merchant/${body.id}`, { params });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function useBankAccountByMerchantId(
  { search = '', page = 1, limit = 10 }: Params,
  { id }: Body
) {
  const result = useQuery({
    queryKey: ['bankAccountsByMerchantId', search, page, limit],
    queryFn: () => listBankAccountByMerchantId({ search, page, limit }, { id }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result);
}

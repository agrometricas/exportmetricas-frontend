import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

interface Body {
  id: number;
}

function listBankAccountByMerchantId(body: Body): Promise<AxiosResponse> {
  return axios.get(`/bank-account/merchant/${body.id}`);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function useBankAccountByMerchantId({ id }: Body) {
  const result = useQuery({
    queryKey: ['bankAccountsByMerchantId'],
    queryFn: () => listBankAccountByMerchantId({ id }),
  });

  return serializeQueryResult(result);
}

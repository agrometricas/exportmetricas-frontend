import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MiniPalletType } from '@/types/box-brand/materials/minipallet';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listMiniPallets(): Promise<AxiosResponse<MiniPalletType[]>> {
  return axios.get('/box-brand/minipallet');
}

export function useMiniPallets(): UseQueryResult<MiniPalletType[], unknown> {
  const result = useQuery({
    queryKey: ['minipallets'],
    queryFn: () => listMiniPallets(),
  });
  return serializeQueryResult(result);
}

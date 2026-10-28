import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { PalletType } from '@/types/box-brand/materials/pallet';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listPallets(): Promise<AxiosResponse<PalletType[]>> {
  return axios.get('/box-brand/pallet');
}

export function usePallets(): UseQueryResult<PalletType[], unknown> {
  const result = useQuery({
    queryKey: ['pallets'],
    queryFn: () => listPallets(),
  });
  return serializeQueryResult(result);
}

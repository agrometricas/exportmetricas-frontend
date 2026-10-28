import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import {
  MinimumBoxPriceBody,
  MinimumBoxPriceResponse,
} from '../../types/priceSheet';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function getMinimumBoxPrice(): Promise<AxiosResponse<MinimumBoxPriceResponse>> {
  return axios.get('/settings/minimum-box-price');
}

export function useMinimumBoxPrice(): UseQueryResult<
  MinimumBoxPriceResponse,
  unknown
> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('minimumBoxPrice'),
      queryFn: getMinimumBoxPrice,
    })
  );
}

function updateMinimumBoxPrice(
  body: MinimumBoxPriceBody
): Promise<AxiosResponse<MinimumBoxPriceResponse>> {
  return axios.put('/settings/minimum-box-price', body);
}

export function useUpdateMinimumBoxPrice(): UseMutationResult<
  AxiosResponse<MinimumBoxPriceResponse>,
  AxiosError<ServerErrorResponse>,
  MinimumBoxPriceBody
> {
  return useMutation({ mutationFn: updateMinimumBoxPrice });
}

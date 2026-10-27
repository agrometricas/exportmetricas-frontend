import {
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
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

export function useMinimumBoxPrice(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['minimumBoxPrice'],
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

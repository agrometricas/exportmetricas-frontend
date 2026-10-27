import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { ProducerPaymentType } from '@/types/producerPayment';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getProducerPayment = ({
  producerPaymentId,
}: {
  producerPaymentId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/export/producer-payment/${producerPaymentId}`);
};

type QueryFnType = typeof getProducerPayment;

type UseProducerPaymentOptions = {
  producerPaymentId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useProducerPayment = ({
  producerPaymentId,
}: UseProducerPaymentOptions): UseQueryResult<ProducerPaymentType> => {
  const result = useQuery({
    queryKey: ['producerPayment', producerPaymentId],
    queryFn: () => getProducerPayment({ producerPaymentId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<ProducerPaymentType>;
};

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ProducerPaymentType } from '@/types/producerPayment';

type updateProducerPaymentDTO = {
  data: Partial<ProducerPaymentType>;
  producerPaymentId: string;
};

const updateProducerPayment = ({
  data,
  producerPaymentId,
}: updateProducerPaymentDTO): Promise<AxiosResponse> => {
  return axios.post(`/export/producer-payment/${producerPaymentId}`, data);
};

type UseUpdateProducerPaymentOptions = {
  config?: MutationConfig<typeof updateProducerPayment>;
};

export const useUpdateProducerPayment = ({
  config,
}: UseUpdateProducerPaymentOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateProducerPayment,
  });

  return { ...mutation, updateProducerPayment: mutation.mutateAsync };
};

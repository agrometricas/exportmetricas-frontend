/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { ProducerPaymentType } from '@/types/producerPayment';

interface CreateProducerPaymentResponse {
  producerPaymentId: number;
}

export const createProducerPayment = async (
  data: Partial<ProducerPaymentType>
): Promise<CreateProducerPaymentResponse> => {
  const response = await axios.post('export/producer-payment', data);
  const firstRecord = response.data[0];
  if (!firstRecord || !firstRecord.id) {
    throw new Error('No se encontró un producerPayment válido en la respuesta');
  }
  return { producerPaymentId: firstRecord.id };
};

type UseCreateProducerPaymentOptions = {
  config?: MutationConfig<typeof createProducerPayment>;
};

export const useCreateProducerPayment = ({
  config,
}: UseCreateProducerPaymentOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: createProducerPayment,
  });

  return { ...mutation, createProducerPayment: mutation.mutateAsync };
};

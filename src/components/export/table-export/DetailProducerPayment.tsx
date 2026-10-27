import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import DetailInvoice from './DetailInvoice';
import { ProducerPaymentType } from '../../../types/producerPayment';

interface props {
  payment: Partial<ProducerPaymentType>;
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
  pendingSent: boolean;
  pendingPayment: boolean;
}

const DetailProducerPayment = ({
  payment,
  width,
  pendingPayment,
}: props): React.JSX.Element | undefined => {
  if (pendingPayment) return;

  return (
    <Box
      p={'16px'}
      width={{ sm: `${width.sm - 60}px`, md: `${width.md - 60}px` }}
    >
      <VStack gap={4} alignItems={'start'} width={'100%'}>
        <DetailInvoice payment={payment} />
      </VStack>
    </Box>
  );
};

export default DetailProducerPayment;

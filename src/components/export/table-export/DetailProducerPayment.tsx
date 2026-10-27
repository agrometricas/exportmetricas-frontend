import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import DetailInvoice from './DetailInvoice';
import { ProducerPaymentType } from '../../../types/producerPayment';

interface props {
  payment: Partial<ProducerPaymentType>;
  pendingSent: boolean;
  pendingPayment: boolean;
}

const DetailProducerPayment = ({
  payment,
  pendingPayment,
}: props): React.JSX.Element | undefined => {
  if (pendingPayment) return;

  return (
    <Box p={'16px'}>
      <VStack gap={4} alignItems={'start'} width={'100%'}>
        <DetailInvoice payment={payment} />
      </VStack>
    </Box>
  );
};

export default DetailProducerPayment;

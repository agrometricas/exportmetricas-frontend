'use client';
import {
  Box,
  Button,
  Card,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdPaid } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableProducerPayments from '../../../../components/liquidation/producer-payments/TableProducerPayments';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function SearchProducerPaymentsPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdPaid}
      title='Pagos a productores'
      description='Visualiza y controla los pagos realizados a productores'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar pago a productores'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/liquidation/producer-pending-payments'>
              <FiPlus />
            </Link_Next>
          </IconButton>
        ) : (
          <Button
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            fontWeight='semibold'
            asChild
          >
            <Link_Next href='/dashboard/liquidation/producer-pending-payments'>
              <FiPlus />
              Agregar Pago a Productores
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <TableProducerPayments />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(SearchProducerPaymentsPage);

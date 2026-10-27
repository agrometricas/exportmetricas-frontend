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
import { MdRequestQuote } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableClientPayments from '../../../../components/client-payment/TableClientPayments';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function SearchClientPaymentsPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdRequestQuote}
      title='Cobros a Clientes'
      description='Visualiza y controla los cobros registrados de tus clientes'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar Cobro a Clientes'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/liquidation/client-pending-payments'>
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
            <Link_Next href='/dashboard/liquidation/client-pending-payments'>
              <FiPlus />
              Agregar Cobro a Clientes
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <TableClientPayments />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(SearchClientPaymentsPage);

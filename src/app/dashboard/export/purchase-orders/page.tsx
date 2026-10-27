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
import { MdOutlineAssignment } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TablePurchaseOrders from '../../../../components/purchase-order/TablePurchaseOrders';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function PurchaseOrdersPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdOutlineAssignment}
      title='Órdenes de Compra'
      description='Lo que se le pide a cada productor por semana, y las exportaciones que nacen de cada línea'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar Orden de Compra'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/export/add-purchase-order'>
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
            <Link_Next href='/dashboard/export/add-purchase-order'>
              <FiPlus />
              Agregar Orden de Compra
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <TablePurchaseOrders />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(PurchaseOrdersPage);

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
import { MdLocalShipping } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableExportsSent from '../../../../components/liquidation/exports-sent/TableExportsSent';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function SearchExportsSentPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdLocalShipping}
      title='Gestión de envíos de insumos'
      description='Visualiza y administra los envíos de insumos realizados'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar envío de insumos'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/liquidation/add-supply-shipment'>
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
            <Link_Next href='/dashboard/liquidation/add-supply-shipment'>
              <FiPlus />
              Agregar Envíos de Insumos
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          {/* Table */}
          <Box>
            <TableExportsSent />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(SearchExportsSentPage);

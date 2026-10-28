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
import { MdAttachMoney } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableExportSentConfirmedCost from '../../../../components/export-cost/TableExportSentConfirmedCost';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ConfirmedExportSentsPage(): React.JSX.Element {
  // Responsiveness
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdAttachMoney}
      title='Gestión de costos de exportación'
      description='Visualiza y administra los costos validados'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar costos validados'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/liquidation/add-export-cost'>
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
            <Link_Next href='/dashboard/liquidation/add-export-cost'>
              <FiPlus />
              Agregar costos validados
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          {/* Table */}
          <Box>
            <TableExportSentConfirmedCost />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(ConfirmedExportSentsPage);

'use client';
import {
  Box,
  Button,
  Card,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdLocalShipping } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableExportsSent from '../../../../components/liquidation/exports-sent/TableExportsSent';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

interface WindowSizeProps {
  width: number | null;
  height: number | null;
}

function SearchExportsSentPage(): React.JSX.Element {
  const [windowSize, setWindowSize] = useState<WindowSizeProps>({
    width: null,
    height: null,
  });

  useEffect(() => {
    function handleResize(): void {
      setWindowSize({
        width: typeof window !== 'undefined' ? window.innerWidth : null,
        height: typeof window !== 'undefined' ? window.innerHeight : null,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  const tableWidth = {
    sm: Number(windowSize.width) - 20,
    md: Number(windowSize.width) - 300,
  };

  return (
    <PageLayout
      icon={MdLocalShipping}
      title='Gestión de Envíos de Insumos'
      description='Visualiza y administra los envíos de insumos realizados'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar Envío de Insumos'
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
            <TableExportsSent windowSize={windowSize} width={tableWidth} />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(SearchExportsSentPage);

'use client';
import {
  Box,
  Button,
  Card,
  IconButton,
  useBreakpointValue,
  Center,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdLocalShipping } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableTransports from '../../../../components/transport/table-transport/TableTransports';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { LOGISTICS_TABS } from '../../../../components/ui/sidenav/navMenus';

interface WindowSizeProps {
  width: number | null;
  height: number | null;
}

function TransportsPage(): React.JSX.Element {
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
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
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
      title='Gestión de Transportes'
      description='Visualiza y administra los transportes registrados'
      tabs={<SectionTabs tabs={LOGISTICS_TABS} />}
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar Transporte'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/client/add-transport'>
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
            <Link_Next href='/dashboard/client/add-transport'>
              <FiPlus />
              Agregar Transporte
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <Center>
              <TableTransports windowSize={windowSize} width={tableWidth} />
            </Center>
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(TransportsPage);

'use client';
import {
  Box,
  Button,
  Card,
  HStack,
  IconButton,
  Text,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdContentCut } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableCuttingTypes from '../../../../components/export/cutting-type/table-cutting-type/TableCuttingTypes';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { QUALITY_CATALOG_TABS } from '../../../../components/ui/sidenav/navMenus';

interface WindowSizeProps {
  width: number | null;
  height: number | null;
}

function CuttingTypesPage(): React.JSX.Element {
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
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
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
      icon={MdContentCut}
      title='Tipos de Corte'
      description='Visualiza y administra los tipos de corte registrados'
      tabs={<SectionTabs tabs={QUALITY_CATALOG_TABS} />}
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar Tipo de Corte'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/box-brands/add-cutting-type'>
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
            <Link_Next href='/dashboard/box-brands/add-cutting-type'>
              <FiPlus />
              Agregar Tipo de Corte
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root
        bg={cardBg}
        borderColor={borderColor}
        borderRadius='xl'
        boxShadow='sm'
        overflow='hidden'
        borderWidth='1px'
      >
        <Card.Body p={0}>
          <Box p={6} py={4} borderBottom='1px solid' borderColor={borderColor}>
            <HStack justify='space-between' align='center'>
              <HStack gap={3}>
                <Text fontSize='lg' fontWeight='semibold' color={headingColor}>
                  Tipos de Corte
                </Text>
                <Badge
                  colorPalette='green'
                  variant='subtle'
                  borderRadius='full'
                  px={3}
                  py={1}
                >
                  Lista actual
                </Badge>
              </HStack>
            </HStack>
          </Box>

          <Box>
            <TableCuttingTypes windowSize={windowSize} width={tableWidth} />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(CuttingTypesPage);

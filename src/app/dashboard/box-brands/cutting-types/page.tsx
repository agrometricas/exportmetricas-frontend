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
import { MdContentCut } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableCuttingTypes from '../../../../components/export/cutting-type/table-cutting-type/TableCuttingTypes';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { QUALITY_CATALOG_TABS } from '../../../../components/ui/sidenav/navMenus';

function CuttingTypesPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdContentCut}
      title='Tipos de corte'
      description='Visualiza y administra los tipos de corte registrados'
      tabs={<SectionTabs tabs={QUALITY_CATALOG_TABS} />}
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar tipo de corte'
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
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <TableCuttingTypes />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(CuttingTypesPage);

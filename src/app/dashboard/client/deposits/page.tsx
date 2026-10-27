// app/(dashboard)/dashboard/client/deposits/page.tsx
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
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdWarehouse } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableDeposits from '../../../../components/deposit/table-deposit/TableDeposits';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { LOGISTICS_TABS } from '../../../../components/ui/sidenav/navMenus';

function DepositsPage(): React.JSX.Element {
  // Responsive
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdWarehouse}
      title='Gestión de Depósitos'
      description='Visualiza y administra los depósitos registrados'
      tabs={<SectionTabs tabs={LOGISTICS_TABS} />}
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar Depósito'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/client/add-deposit'>
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
            <Link_Next href='/dashboard/client/add-deposit'>
              <FiPlus />
              Agregar Depósito
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          {/* Componente de la tabla */}
          <Box>
            <Center>
              <TableDeposits />
            </Center>
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(DepositsPage);

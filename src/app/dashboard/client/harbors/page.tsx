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
import { MdAnchor } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableHarbors from '../../../../components/harbor/table-harbor/TableHarbors';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { LOGISTICS_TABS } from '../../../../components/ui/sidenav/navMenus';

function HarborsPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdAnchor}
      title='Gestión de puertos'
      description='Visualiza y administra los puertos registrados'
      tabs={<SectionTabs tabs={LOGISTICS_TABS} />}
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar puerto'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/client/add-harbor'>
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
            <Link_Next href='/dashboard/client/add-harbor'>
              <FiPlus />
              Agregar puerto
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <Center>
              <TableHarbors />
            </Center>
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(HarborsPage);

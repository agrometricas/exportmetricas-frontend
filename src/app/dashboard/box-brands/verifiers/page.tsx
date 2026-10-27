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
import { MdVerified } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { QUALITY_CATALOG_TABS } from '../../../../components/ui/sidenav/navMenus';
import TableVerifiers from '../../../../components/verifier/table-verifier/TableVerifiers';

function VerifiersPage(): React.JSX.Element {
  // Responsiveness
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdVerified}
      title='Verificadoras'
      description='Visualiza y administra las verificadoras registradas'
      tabs={<SectionTabs tabs={QUALITY_CATALOG_TABS} />}
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar verificadora'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/box-brands/add-verifier'>
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
            <Link_Next href='/dashboard/box-brands/add-verifier'>
              <FiPlus />
              Agregar verificadora
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <TableVerifiers />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(VerifiersPage);

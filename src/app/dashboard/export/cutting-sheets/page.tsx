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
import { MdAssignment } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableCuttingSheets from '../../../../components/export/cutting-sheet/table-cutting-sheets/TableCuttingSheets';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function SearchCuttingSheetsPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdAssignment}
      title='Hojas de Corte'
      description='Visualiza y administra las hojas de corte registradas'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar Hoja de Corte'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/export/add-cutting-sheet'>
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
            <Link_Next href='/dashboard/export/add-cutting-sheet'>
              <FiPlus />
              Agregar Hoja de Corte
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <TableCuttingSheets />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(SearchCuttingSheetsPage);

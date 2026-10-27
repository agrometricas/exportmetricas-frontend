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
import { MdInventory2 } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import TableExporterMaterialStock from '../../../../components/winery/TableExporterMaterialStock';

function SearchStockPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdInventory2}
      title='Stock de materiales'
      description='Visualiza y administra el stock de materiales en bodega'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar stock'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/winery/add-material'>
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
            <Link_Next href='/dashboard/winery/add-material'>
              <FiPlus />
              Agregar stock
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <TableExporterMaterialStock />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(SearchStockPage);

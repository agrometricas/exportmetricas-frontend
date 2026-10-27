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
import { MdOutlineInventory2 } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableBoxBrand from '../../../../components/box-brands/table-box-brand/TableBoxBrand';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function SearchBoxBrandPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdOutlineInventory2}
      title='Gestión de alícuotas'
      description='Visualiza y administra las marcas de caja registradas'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar marca de caja'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/box-brands/add-box-brand'>
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
            <Link_Next href='/dashboard/box-brands/add-box-brand'>
              <FiPlus />
              Agregar marca de caja
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <Center>
              <TableBoxBrand />
            </Center>
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(SearchBoxBrandPage);

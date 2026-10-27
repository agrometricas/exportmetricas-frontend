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
import { MdOutlineAgriculture } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableBusiness from '../../../../components/business/table-business/TableBusiness';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function FincasPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdOutlineAgriculture}
      title='Gestión de fincas'
      description='Visualiza y administra las fincas registradas'
      actions={
        <>
          {/* Botón Agregar */}
          <Box>
            {isMobile ? (
              <IconButton
                aria-label='Agregar finca'
                colorPalette='green'
                size={buttonSize}
                borderRadius='lg'
                asChild
              >
                <Link_Next href='/dashboard/producer/add-fincas'>
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
                <Link_Next href='/dashboard/producer/add-fincas'>
                  <FiPlus />
                  Agregar finca
                </Link_Next>
              </Button>
            )}
          </Box>
        </>
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          {/* Tabla */}
          <Box>
            <TableBusiness />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(FincasPage);

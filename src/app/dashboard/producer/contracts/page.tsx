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
import { MdOutlineAssignment } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableProducerContracts from '../../../../components/producer-contract/TableProducerContracts';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ProducerContractsPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdOutlineAssignment}
      title='Contratos de productor'
      description='Lo pactado con cada finca: contenedores por semana, precio por caja, cupo del MAGAP y vigencia'
      actions={
        <>
          {/* Botón Agregar */}
          <Box>
            {isMobile ? (
              <IconButton
                aria-label='Agregar contrato'
                colorPalette='green'
                size={buttonSize}
                borderRadius='lg'
                asChild
              >
                <Link_Next href='/dashboard/producer/add-contract'>
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
                <Link_Next href='/dashboard/producer/add-contract'>
                  <FiPlus />
                  Agregar contrato
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
            <TableProducerContracts />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(ProducerContractsPage);

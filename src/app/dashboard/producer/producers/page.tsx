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
import TableProducers from '../../../../components/producer/table-producer/TableProducers';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ProducersPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdOutlineAgriculture}
      title='Gestión de productores'
      description='Visualiza y administra los productores registrados'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar productor'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/producer/add-producer'>
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
            <Link_Next href='/dashboard/producer/add-producer'>
              <FiPlus />
              Agregar Productor
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <TableProducers />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(ProducersPage);

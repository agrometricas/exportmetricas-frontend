'use client';
import {
  Box,
  Button,
  Card,
  HStack,
  IconButton,
  Text,
  Badge,
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
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdOutlineAssignment}
      title='Contratos de Productor'
      description='Cupo semanal aprobado de cada finca y su vigencia'
      actions={
        <>
          {/* Botón Agregar */}
          <Box>
            {isMobile ? (
              <IconButton
                aria-label='Agregar Contrato'
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
                  Agregar Contrato
                </Link_Next>
              </Button>
            )}
          </Box>
        </>
      }
    >
      <Card.Root
        bg={cardBg}
        borderColor={borderColor}
        borderRadius='xl'
        boxShadow='sm'
        overflow='hidden'
        borderWidth='1px'
      >
        <Card.Body p={0}>
          {/* Cabecera */}
          <Box p={6} py={4} borderBottom='1px solid' borderColor={borderColor}>
            <HStack justify='space-between' align='center'>
              <HStack gap={3}>
                <Text fontSize='lg' fontWeight='semibold' color={headingColor}>
                  Contratos
                </Text>
                <Badge
                  colorPalette='green'
                  variant='subtle'
                  borderRadius='full'
                  px={3}
                  py={1}
                >
                  Lista actual
                </Badge>
              </HStack>
            </HStack>
          </Box>

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

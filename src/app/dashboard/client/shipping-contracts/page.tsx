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
import { MdDirectionsBoat } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableShippingContracts from '../../../../components/shipping-contract/TableShippingContracts';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { LOGISTICS_TABS } from '../../../../components/ui/sidenav/navMenus';

function ShippingContractsPage(): React.JSX.Element {
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
      icon={MdDirectionsBoat}
      title='Contratos Navieros'
      description='Costo por contenedor de cada ruta, con su vigencia'
      tabs={<SectionTabs tabs={LOGISTICS_TABS} />}
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar Contrato'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/client/add-shipping-contract'>
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
            <Link_Next href='/dashboard/client/add-shipping-contract'>
              <FiPlus />
              Agregar Contrato
            </Link_Next>
          </Button>
        )
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

          <Box>
            <TableShippingContracts />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(ShippingContractsPage);

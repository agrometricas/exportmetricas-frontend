'use client';
import {
  Box,
  Button,
  Card,
  HStack,
  Icon,
  IconButton,
  Heading,
  Text,
  Badge,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdDirectionsBoat } from 'react-icons/md';
import TableShippingContracts from '../../../../components/shipping-contract/TableShippingContracts';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { LOGISTICS_TABS } from '../../../../components/ui/sidenav/navMenus';

function ShippingContractsPage(): React.JSX.Element {
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const textColor = 'fg';
  const headingColor = 'fg.heading';
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <Box minH='100vh' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box mb={6} maxW='8xl' mx='auto'>
        <SectionTabs tabs={LOGISTICS_TABS} />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          <HStack gap={3}>
            <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
              <Icon boxSize={5} asChild>
                <MdDirectionsBoat />
              </Icon>
            </Box>
            <Box>
              <Heading size='lg' color={headingColor} fontWeight='bold'>
                Contratos Navieros
              </Heading>
              <Text fontSize='sm' color={textColor}>
                Costo por contenedor de cada ruta, con su vigencia
              </Text>
            </Box>
          </HStack>

          <Box>
            {isMobile ? (
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
            )}
          </Box>
        </Flex>
      </Box>

      <Box maxW='8xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='sm'
          overflow='hidden'
          borderWidth='1px'
        >
          <Card.Body p={0}>
            <Box
              p={6}
              py={4}
              borderBottom='1px solid'
              borderColor={borderColor}
            >
              <HStack justify='space-between' align='center'>
                <HStack gap={3}>
                  <Text
                    fontSize='lg'
                    fontWeight='semibold'
                    color={headingColor}
                  >
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
      </Box>
    </Box>
  );
}

export default IsOnboarding(ShippingContractsPage);

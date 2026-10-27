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
import { MdOutlineAssignment } from 'react-icons/md';
import TablePurchaseOrders from '../../../../components/purchase-order/TablePurchaseOrders';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function PurchaseOrdersPage(): React.JSX.Element {
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
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          <HStack gap={3}>
            <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
              <Icon boxSize={5} asChild>
                <MdOutlineAssignment />
              </Icon>
            </Box>
            <Box>
              <Heading size='lg' color={headingColor} fontWeight='bold'>
                Órdenes de Compra
              </Heading>
              <Text fontSize='sm' color={textColor}>
                Lo que se le pide a cada productor por semana, y las
                exportaciones que nacen de cada línea
              </Text>
            </Box>
          </HStack>

          <Box>
            {isMobile ? (
              <IconButton
                aria-label='Agregar Orden de Compra'
                colorPalette='green'
                size={buttonSize}
                borderRadius='lg'
                asChild
              >
                <Link_Next href='/dashboard/export/add-purchase-order'>
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
                <Link_Next href='/dashboard/export/add-purchase-order'>
                  <FiPlus />
                  Agregar Orden de Compra
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
                    Órdenes
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
              <TablePurchaseOrders />
            </Box>
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(PurchaseOrdersPage);

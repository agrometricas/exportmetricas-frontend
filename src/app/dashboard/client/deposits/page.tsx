// app/(dashboard)/dashboard/client/deposits/page.tsx
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
  Center,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdWarehouse } from 'react-icons/md';
import TableDeposits from '../../../../components/deposit/table-deposit/TableDeposits';
import { useColorModeValue } from "../../../../components/ui/color-mode";
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { LOGISTICS_TABS } from '../../../../components/ui/sidenav/navMenus';

interface WindowSizeProps {
  width: number | null;
  height: number | null;
}

function DepositsPage(): React.JSX.Element {
  const [windowSize, setWindowSize] = useState<WindowSizeProps>({
    width: null,
    height: null,
  });

  useEffect(() => {
    function handleResize(): void {
      setWindowSize({
        width: typeof window !== 'undefined' ? window.innerWidth : null,
        height: typeof window !== 'undefined' ? window.innerHeight : null,
      });
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Theming
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.900', 'gray.100');

  // Responsive
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({ base: 'sm', md: 'md' });

  const tableWidth = {
    sm: Number(windowSize.width) - 20,
    md: Number(windowSize.width) - 300,
  };

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      {/* Header */}
      <Box mb={6} maxW="8xl" mx="auto">
        <SectionTabs tabs={LOGISTICS_TABS} />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          <HStack gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
              <Icon boxSize={5} asChild><MdWarehouse /></Icon>
            </Box>
            <Box>
              <Heading size="lg" color={headingColor} fontWeight="bold">
                Gestión de Depósitos
              </Heading>
              <Text fontSize="sm" color={textColor}>
                Visualiza y administra los depósitos registrados
              </Text>
            </Box>
          </HStack>

          <Box>
            {isMobile ? (
              <IconButton

                aria-label="Agregar Depósito"
                colorPalette="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
                asChild><Link_Next href="/dashboard/client/add-deposit"><FiPlus /></Link_Next></IconButton>
            ) : (
              <Button

                colorPalette="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                fontWeight="semibold"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
                asChild><Link_Next href="/dashboard/client/add-deposit"><FiPlus />Agregar Depósito
                                                </Link_Next></Button>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Tabla en Card */}
      <Box maxW="8xl" mx="auto">
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          border="1px solid"
        >
          <Card.Body p={0}>
            {/* Cabecera de la tabla */}
            <Box
              p={6}
              bg={useColorModeValue('gray.50', 'gray.750')}
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                    Depósitos
                  </Text>
                  <Badge
                    colorPalette="green"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    Lista actual
                  </Badge>
                </HStack>
              </HStack>
            </Box>

            {/* Componente de la tabla */}
            <Box>
              <Center>
                <TableDeposits windowSize={windowSize} width={tableWidth} />
              </Center>
            </Box>
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(DepositsPage);

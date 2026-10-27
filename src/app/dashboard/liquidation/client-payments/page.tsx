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
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdRequestQuote } from 'react-icons/md';
import TableClientPayments from '../../../../components/client-payment/TableClientPayments';
import { useColorModeValue } from "../../../../components/ui/color-mode";
import IsOnboarding from '../../../../components/ui/IsOnboarding';

interface WindowSizeProps {
  width: number | null;
  height: number | null;
}

function SearchClientPaymentsPage(): React.JSX.Element {
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
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.900', 'gray.100');

  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({ base: 'sm', md: 'md' });

  const tableWidth = {
    sm: Number(windowSize.width) - 20,
    md: Number(windowSize.width) - 300,
  };

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box mb={6} maxW="8xl" mx="auto">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          <HStack gap={3}>
            <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
              <Icon boxSize={5} asChild><MdRequestQuote /></Icon>
            </Box>
            <Box>
              <Heading size="lg" color={headingColor} fontWeight="bold">
                Cobros a Clientes
              </Heading>
              <Text fontSize="sm" color={textColor}>
                Visualiza y controla los cobros registrados de tus clientes
              </Text>
            </Box>
          </HStack>

          <Box>
            {isMobile ? (
              <IconButton

                aria-label="Agregar Cobro a Clientes"
                colorPalette="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
                asChild><Link_Next href="/dashboard/liquidation/client-pending-payments"><FiPlus /></Link_Next></IconButton>
            ) : (
              <Button

                colorPalette="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                fontWeight="semibold"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
                asChild><Link_Next href="/dashboard/liquidation/client-pending-payments"><FiPlus />Agregar Cobro a Clientes
                                                </Link_Next></Button>
            )}
          </Box>
        </Flex>
      </Box>

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
            <Box
              p={6}
              bg={useColorModeValue('gray.50', 'gray.750')}
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                    Cobros a Clientes
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

            <Box>
              <TableClientPayments windowSize={windowSize} width={tableWidth} />
            </Box>
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(SearchClientPaymentsPage);

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
import { MdAttachMoney } from 'react-icons/md';
import TableExportSentConfirmedCost from '../../../../components/export-cost/TableExportSentConfirmedCost';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

interface WindowSizeProps {
  width: number | null;
  height: number | null;
}

function ConfirmedExportSentsPage(): React.JSX.Element {
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

  // Theming
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const textColor = 'fg';
  const headingColor = 'fg.heading';

  // Responsiveness
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
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          <HStack gap={3}>
            <Box p={2} bg="green.subtle" borderRadius="lg" color="green.fg">
              <Icon boxSize={5} asChild><MdAttachMoney /></Icon>
            </Box>
            <Box>
              <Heading size="lg" color={headingColor} fontWeight="bold">
                Gestión de Costos de Exportación
              </Heading>
              <Text fontSize="sm" color={textColor}>
                Visualiza y administra los costos validados
              </Text>
            </Box>
          </HStack>

          <Box>
            {isMobile ? (
              <IconButton

                aria-label="Agregar Costos Validados"
                colorPalette="green"
                size={buttonSize}
                borderRadius="lg"
                asChild><Link_Next href="/dashboard/liquidation/add-export-cost"><FiPlus /></Link_Next></IconButton>
            ) : (
              <Button

                colorPalette="green"
                size={buttonSize}
                borderRadius="lg"
                fontWeight="semibold"
                asChild><Link_Next href="/dashboard/liquidation/add-export-cost"><FiPlus />Agregar Costos Validados
                                                </Link_Next></Button>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Table Card */}
      <Box maxW="8xl" mx="auto">
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow='sm'
          overflow="hidden"
          borderWidth='1px'
        >
          <Card.Body p={0}>
            {/* Table header */}
            <Box
              p={6}
              py={4}
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                    Costos Validados
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

            {/* Table */}
            <Box>
              <TableExportSentConfirmedCost
                windowSize={windowSize}
                width={tableWidth}
              />
            </Box>
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(ConfirmedExportSentsPage);

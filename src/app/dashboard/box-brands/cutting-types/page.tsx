'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Icon,
  IconButton,
  Heading,
  Text,
  Badge,
  Flex,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdContentCut } from 'react-icons/md';
import TableCuttingTypes from '../../../../components/export/cutting-type/table-cutting-type/TableCuttingTypes';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { QUALITY_CATALOG_TABS } from '../../../../components/ui/sidenav/navMenus';

interface WindowSizeProps {
  width: number | null;
  height: number | null;
}

function CuttingTypesPage(): React.JSX.Element {
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
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const tableWidth = {
    sm: Number(windowSize.width) - 20,
    md: Number(windowSize.width) - 300,
  };

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      {/* Header */}
      <Box mb={6} maxW="8xl" mx="auto">
        <SectionTabs tabs={QUALITY_CATALOG_TABS} />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          <HStack spacing={3}>
            <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
              <Icon as={MdContentCut} boxSize={5} />
            </Box>
            <Box>
              <Heading size="lg" color={headingColor} fontWeight="bold">
                Tipos de Corte
              </Heading>
              <Text fontSize="sm" color={textColor}>
                Visualiza y administra los tipos de corte registrados
              </Text>
            </Box>
          </HStack>

          <Box>
            {isMobile ? (
              <IconButton
                as={Link_Next}
                href="/dashboard/box-brands/add-cutting-type"
                aria-label="Agregar Tipo de Corte"
                icon={<FiPlus />}
                colorScheme="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              />
            ) : (
              <Button
                as={Link_Next}
                href="/dashboard/box-brands/add-cutting-type"
                leftIcon={<FiPlus />}
                colorScheme="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                fontWeight="semibold"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Agregar Tipo de Corte
              </Button>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Tabla */}
      <Box maxW="8xl" mx="auto">
        <Card
          bg={cardBg}
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          border="1px solid"
        >
          <CardBody p={0}>
            <Box
              p={6}
              bg={useColorModeValue('gray.50', 'gray.750')}
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={3}>
                  <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                    Tipos de Corte
                  </Text>
                  <Badge
                    colorScheme="green"
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
              <TableCuttingTypes windowSize={windowSize} width={tableWidth} />
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(CuttingTypesPage);

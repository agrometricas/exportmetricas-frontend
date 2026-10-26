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
  Center,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdDirectionsBoat } from 'react-icons/md';
import TableShippingCompanies from '../../../../components/shipping-company/table-shipping-company/TableShippingCompanies';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import SectionTabs from '../../../../components/ui/SectionTabs';
import { LOGISTICS_TABS } from '../../../../components/ui/sidenav/navMenus';

interface WindowSizeProps {
  width: number | null;
  height: number | null;
}

function ShippingCompaniesPage(): React.JSX.Element {
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
      <Box mb={6} maxW="8xl" mx="auto">
        <SectionTabs tabs={LOGISTICS_TABS} />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          <HStack spacing={3}>
            <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
              <Icon as={MdDirectionsBoat} boxSize={5} />
            </Box>
            <Box>
              <Heading size="lg" color={headingColor} fontWeight="bold">
                Gestión de Navieras
              </Heading>
              <Text fontSize="sm" color={textColor}>
                Visualiza y administra las navieras registradas
              </Text>
            </Box>
          </HStack>

          <Box>
            {isMobile ? (
              <IconButton
                as={Link_Next}
                href="/dashboard/client/add-shipping-company"
                aria-label="Agregar Naviera"
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
                href="/dashboard/client/add-shipping-company"
                leftIcon={<FiPlus />}
                colorScheme="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                fontWeight="semibold"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Agregar Naviera
              </Button>
            )}
          </Box>
        </Flex>
      </Box>

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
                    Navieras
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
              <Center>
                <TableShippingCompanies windowSize={windowSize} width={tableWidth} />
              </Center>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(ShippingCompaniesPage);

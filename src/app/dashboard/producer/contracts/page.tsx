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
import TableProducerContracts from '../../../../components/producer-contract/TableProducerContracts';
import { useColorModeValue } from "../../../../components/ui/color-mode";
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ProducerContractsPage(): React.JSX.Element {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({ base: 'sm', md: 'md' });

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
            <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
              <Icon boxSize={5} asChild><MdOutlineAssignment /></Icon>
            </Box>
            <Box>
              <Heading size="lg" color={headingColor} fontWeight="bold">
                Contratos de Productor
              </Heading>
              <Text fontSize="sm" color={textColor}>
                Cupo semanal aprobado de cada finca y su vigencia
              </Text>
            </Box>
          </HStack>

          {/* Botón Agregar */}
          <Box>
            {isMobile ? (
              <IconButton

                aria-label="Agregar Contrato"
                colorPalette="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
                asChild><Link_Next href="/dashboard/producer/add-contract"><FiPlus /></Link_Next></IconButton>
            ) : (
              <Button

                colorPalette="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                fontWeight="semibold"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
                asChild><Link_Next href="/dashboard/producer/add-contract"><FiPlus />Agregar Contrato
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
            {/* Cabecera */}
            <Box
              p={6}
              bg={useColorModeValue('gray.50', 'gray.750')}
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                    Contratos
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

            {/* Tabla */}
            <Box>
              <TableProducerContracts />
            </Box>
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(ProducerContractsPage);

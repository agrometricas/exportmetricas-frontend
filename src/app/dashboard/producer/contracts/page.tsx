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
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdOutlineAssignment } from 'react-icons/md';
import TableProducerContracts from '../../../../components/producer-contract/TableProducerContracts';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ProducerContractsPage(): React.JSX.Element {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

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
          <HStack spacing={3}>
            <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
              <Icon as={MdOutlineAssignment} boxSize={5} />
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
                as={Link_Next}
                href="/dashboard/producer/add-contract"
                aria-label="Agregar Contrato"
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
                href="/dashboard/producer/add-contract"
                leftIcon={<FiPlus />}
                colorScheme="green"
                size={buttonSize}
                borderRadius="lg"
                boxShadow="md"
                fontWeight="semibold"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Agregar Contrato
              </Button>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Tabla en Card */}
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
            {/* Cabecera */}
            <Box
              p={6}
              bg={useColorModeValue('gray.50', 'gray.750')}
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={3}>
                  <Text fontSize="lg" fontWeight="semibold" color={headingColor}>
                    Contratos
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

            {/* Tabla */}
            <Box>
              <TableProducerContracts />
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(ProducerContractsPage);

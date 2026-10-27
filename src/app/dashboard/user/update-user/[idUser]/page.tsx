'use client';
import { Box, Card, HStack, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdLocationOn } from 'react-icons/md';
import LoadingState from '@/components/ui/states/LoadingState';
import UpdateExporterForm from '../../../../../components/settings/UpdateExporterForm';
import { useColorModeValue } from "../../../../../components/ui/color-mode";
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useExporter, UserProfile } from '../../../../../hooks/useUserProfile';

const UpdateExporterPage = (): JSX.Element => {
  const { user, isLoading } = useExporter();
  const exporter = user as Partial<UserProfile>;

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headBg = useColorModeValue('gray.50', 'gray.750');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  if (isLoading) {
    return (
      <LoadingState minH='60vh' />
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="7xl" mx="auto">
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          border="1px solid"
        >
          <Card.Header bg={headBg}>
            <HStack gap={3} align="center">
              <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
                <Icon boxSize={5} asChild><MdLocationOn /></Icon>
              </Box>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="bold">
                  Modificar Ubicación
                </Heading>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Actualiza la información de ubicación y detalles de la exportadora.
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Card.Body>
            {exporter?.exporterDetails ? (
              <UpdateExporterForm exporterDetails={exporter.exporterDetails} />
            ) : (
              <Text color={textColor}>No se encontraron detalles de la exportadora.</Text>
            )}
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
};

export default IsOnboarding(UpdateExporterPage);

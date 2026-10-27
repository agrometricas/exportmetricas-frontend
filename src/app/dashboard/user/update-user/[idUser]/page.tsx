'use client';
import { Box, Card, HStack, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdLocationOn } from 'react-icons/md';
import LoadingState from '@/components/ui/states/LoadingState';
import UpdateExporterForm from '../../../../../components/settings/UpdateExporterForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useExporter, UserProfile } from '../../../../../hooks/useUserProfile';

const UpdateExporterPage = (): JSX.Element => {
  const { user, isLoading } = useExporter();
  const exporter = user as Partial<UserProfile>;

  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headBg = 'bg.subtle';
  const headingColor = 'fg.heading';
  const textColor = 'fg';

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
          boxShadow='sm'
          overflow="hidden"
          borderWidth='1px'
        >
          <Card.Header bg={headBg}>
            <HStack gap={3} align="center">
              <Box p={2} bg="green.subtle" borderRadius="lg" color="green.fg">
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

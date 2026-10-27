'use client';
import { Box, Card, Heading, HStack, Icon, Text, Separator } from '@chakra-ui/react';
import React from 'react';
import { MdVerified } from 'react-icons/md';
import { useColorModeValue } from "../../../../components/ui/color-mode";
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import AddVerifierForm from '../../../../components/verifier/AddVerifierForm';

function AddVerifierPage(): React.JSX.Element {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headBg = useColorModeValue('gray.50', 'gray.750');

  return (
    <Box minH="100vh" w="100%" bg={useColorModeValue('gray.50', 'gray.900')} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="8xl" mx="auto">
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          border="1px solid"
          borderTopWidth="4px"
          borderTopColor="green.500"
        >
          <Card.Header bg={headBg} pb={4}>
            <HStack gap={3} align="center">
              <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
                <Icon boxSize={5} asChild><MdVerified /></Icon>
              </Box>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="bold">
                  Agregar Verificadora
                </Heading>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Completa el formulario para registrar una verificadora
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            <AddVerifierForm />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(AddVerifierPage);

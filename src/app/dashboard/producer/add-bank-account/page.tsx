'use client';
import { Box, Card, Heading, HStack, Icon, Text, Separator } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineAccountBalance } from 'react-icons/md';
import AddBankAccountForm from '../../../../components/producer/AddBankAccountForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddBankAccountPage(): React.JSX.Element {
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const textColor = 'fg';

  return (
    <Box minH="100vh" w="100%" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="8xl" mx="auto">
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow='sm'
          overflow="hidden"
          borderWidth='1px'
          borderTopWidth="4px"
          borderTopColor="green.500"
        >
          <Card.Header bg={'bg.subtle'} pb={4}>
            <HStack gap={3} align="center">
              <Box p={2} bg="green.subtle" borderRadius="lg" color="green.fg">
                <Icon boxSize={5} asChild><MdOutlineAccountBalance /></Icon>
              </Box>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="bold">
                  Agregar Cuenta Bancaria
                </Heading>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Completa el formulario para registrar una cuenta bancaria
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            <AddBankAccountForm />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(AddBankAccountPage);

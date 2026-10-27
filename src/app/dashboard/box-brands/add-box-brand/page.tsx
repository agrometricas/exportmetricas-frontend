'use client';
import { Box, Card, Heading, HStack, Icon, Text, Separator } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineInventory2 } from 'react-icons/md';
import AddBoxBrandsForm from '@/components/box-brands/AddBoxBrandsForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddBoxBrandPage(): React.JSX.Element {
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
                <Icon boxSize={5} asChild><MdOutlineInventory2 /></Icon>
              </Box>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="bold">
                  Agregar Nueva Alícuota
                </Heading>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Completa el formulario para registrar una marca de caja
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            <AddBoxBrandsForm />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(AddBoxBrandPage);

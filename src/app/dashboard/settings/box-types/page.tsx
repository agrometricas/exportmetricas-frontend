'use client';
import { Box, Card, HStack, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineInventory2 } from 'react-icons/md';
import BoxTypesManager from '../../../../components/box-type/BoxTypesManager';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function BoxTypesPage(): React.JSX.Element {
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headBg = 'bg.subtle';
  const headingColor = 'fg.heading';
  const textColor = 'fg';

  return (
    <Box minH='100vh' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='7xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='sm'
          overflow='hidden'
          borderWidth='1px'
        >
          <Card.Header bg={headBg}>
            <HStack gap={3} align='center'>
              <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
                <Icon boxSize={5} asChild>
                  <MdOutlineInventory2 />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Tipos de Caja
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Los tipos de caja de la exportadora (22XU, 208…) que eligen
                  las alícuotas.
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Card.Body>
            <BoxTypesManager />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(BoxTypesPage);

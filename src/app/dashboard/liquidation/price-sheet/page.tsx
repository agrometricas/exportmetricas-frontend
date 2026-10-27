'use client';
import { Box, Card, HStack, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdRequestQuote } from 'react-icons/md';
import PriceSheetForm from '../../../../components/price-sheet/PriceSheetForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function PriceSheetPage(): React.JSX.Element {
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headBg = 'bg.subtle';
  const headingColor = 'fg.heading';
  const textColor = 'fg';

  return (
    <Box minH='100vh' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
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
                  <MdRequestQuote />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Hoja de Precios
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  El precio por caja de cada línea de las órdenes de compra de
                  la semana: es el que propone el pago al productor.
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Card.Body>
            <PriceSheetForm />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(PriceSheetPage);

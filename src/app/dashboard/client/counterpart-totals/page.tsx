'use client';
import { Box, Card, HStack, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdInsights } from 'react-icons/md';
import CounterpartTotalsView from '../../../../components/counterpart-totals/CounterpartTotalsView';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function CounterpartTotalsPage(): React.JSX.Element {
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
                  <MdInsights />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Totales por Contraparte
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Cajas, contenedores y montos de un período por cliente,
                  productor, finca, puerto, naviera, depósito y verificadora
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Card.Body>
            <CounterpartTotalsView />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(CounterpartTotalsPage);

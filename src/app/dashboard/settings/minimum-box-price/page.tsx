'use client';
import { Box, Card, HStack, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdAttachMoney } from 'react-icons/md';
import MinimumBoxPriceForm from '../../../../components/settings/minimum-box-price/MinimumBoxPriceForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function MinimumBoxPricePage(): React.JSX.Element {
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
                  <MdAttachMoney />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Precio Mínimo
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Precio mínimo de sustentación por caja que se le propone al
                  productor.
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Card.Body>
            <MinimumBoxPriceForm />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(MinimumBoxPricePage);

'use client';
import { Box, Card, HStack, Heading, Icon, Text, Badge } from '@chakra-ui/react';
import React from 'react';
import { MdTune } from 'react-icons/md';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import AdjustWeeklySelector from '../../../../components/winery/AdjustWeeklySelector';

function AdjustWeeklyPage(): React.JSX.Element {
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const textColor = 'fg';
  const headBg = 'bg.subtle';

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="8xl" mx="auto">
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
                <Icon boxSize={5} asChild><MdTune /></Icon>
              </Box>
              <Box>
                <HStack gap={3} align="center">
                  <Heading size="lg" color={headingColor} fontWeight="bold">
                    Ajuste Semanal
                  </Heading>
                  <Badge colorPalette="green" variant="subtle" borderRadius="full" px={3} py={1}>
                    Herramienta
                  </Badge>
                </HStack>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Realiza ajustes semanales de stock por finca
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Card.Body>
            <AdjustWeeklySelector />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(AdjustWeeklyPage);

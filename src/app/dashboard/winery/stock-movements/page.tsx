'use client';
import { Box, Card, HStack, Heading, Icon, Text, Badge } from '@chakra-ui/react';
import React from 'react';
import { MdTimeline } from 'react-icons/md';
import { useColorModeValue } from "../../../../components/ui/color-mode";
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import StockMovementsSelector from '../../../../components/winery/StockMovementsSelector';

function StockMovementsPage(): React.JSX.Element {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headBg = useColorModeValue('gray.50', 'gray.750');

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="8xl" mx="auto">
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
                <Icon boxSize={5} asChild><MdTimeline /></Icon>
              </Box>
              <Box>
                <HStack gap={3} align="center">
                  <Heading size="lg" color={headingColor} fontWeight="bold">
                    Trazabilidad de Stock
                  </Heading>
                  <Badge colorPalette="green" variant="subtle" borderRadius="full" px={3} py={1}>
                    Herramienta
                  </Badge>
                </HStack>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Consulta los movimientos de materiales por finca
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Card.Body>
            <StockMovementsSelector />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(StockMovementsPage);

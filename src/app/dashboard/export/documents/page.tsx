'use client';
import {
  Badge,
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineFactCheck } from 'react-icons/md';
import TableDocumentBoard from '../../../../components/booking/TableDocumentBoard';
import { useColorModeValue } from '../../../../components/ui/color-mode';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function DocumentBoardPage(): React.JSX.Element {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const headBg = useColorModeValue('gray.50', 'gray.750');

  return (
    <Box minH='100vh' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box mb={6} maxW='8xl' mx='auto'>
        <HStack gap={3}>
          <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
            <Icon boxSize={5} asChild>
              <MdOutlineFactCheck />
            </Icon>
          </Box>
          <Box>
            <Heading size='lg' color={headingColor} fontWeight='bold'>
              Documentos de Embarque
            </Heading>
            <Text fontSize='sm' color={textColor}>
              El set de cada booking: lo que falta, lo rechazado y cuánto lleva,
              desde una semana antes de hoy
            </Text>
          </Box>
        </HStack>
      </Box>

      <Box maxW='8xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
        >
          <Card.Body p={0}>
            <Box
              p={6}
              bg={headBg}
              borderBottom='1px solid'
              borderColor={borderColor}
            >
              <HStack gap={3}>
                <Text fontSize='lg' fontWeight='semibold' color={headingColor}>
                  Tablero
                </Text>
                <Badge
                  colorPalette='green'
                  variant='subtle'
                  borderRadius='full'
                >
                  Verde listo · Amarillo en proceso · Rojo bloqueado
                </Badge>
              </HStack>
            </Box>
            <TableDocumentBoard />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(DocumentBoardPage);

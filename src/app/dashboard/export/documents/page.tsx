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
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function DocumentBoardPage(): React.JSX.Element {
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const textColor = 'fg';
  const headingColor = 'fg.heading';
  const headBg = 'bg.subtle';

  return (
    <Box minH='100vh' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box mb={6} maxW='8xl' mx='auto'>
        <HStack gap={3}>
          <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
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
          boxShadow='sm'
          overflow='hidden'
          borderWidth='1px'
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

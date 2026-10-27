'use client';
import { Badge, Box, Card, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineFactCheck } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableDocumentBoard from '../../../../components/booking/TableDocumentBoard';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function DocumentBoardPage(): React.JSX.Element {
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const headBg = 'bg.subtle';

  return (
    <PageLayout
      icon={MdOutlineFactCheck}
      title='Documentos de Embarque'
      description='El set de cada booking: lo que falta, lo rechazado y cuánto lleva, desde una semana antes de hoy'
    >
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
              <Badge colorPalette='green' variant='subtle' borderRadius='full'>
                Verde listo · Amarillo en proceso · Rojo bloqueado
              </Badge>
            </HStack>
          </Box>
          <TableDocumentBoard />
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(DocumentBoardPage);

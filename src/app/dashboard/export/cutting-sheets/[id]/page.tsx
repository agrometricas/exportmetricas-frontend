'use client';
import {
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  Text,
  Separator,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdContentCut } from 'react-icons/md';
import LoadingState from '@/components/ui/states/LoadingState';
import CorrectCuttingSheetForm from '../../../../../components/export/cutting-sheet/CorrectCuttingSheetForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useCuttingSheets } from '../../../../../hooks/export/cuttingSheet/getCuttingSheets';
import { usePagination } from '../../../../../hooks/usePagination';
import { CuttingSheetResponse } from '../../../../../types/cuttingSheet.response';

function CorrectCuttingSheetPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { paginationParams } = usePagination();
  const { data, isLoading } = useCuttingSheets(paginationParams);
  const sheet = ((data ?? []) as CuttingSheetResponse[]).find(
    (row) => row.id === Number(id)
  );
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const textColor = 'fg';
  const headBg = 'bg.subtle';

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='sm'
          overflow='hidden'
          borderWidth='1px'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <Card.Header bg={headBg} pb={4}>
            <HStack gap={3} align='center'>
              <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
                <Icon boxSize={5} asChild>
                  <MdContentCut />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Corregir Hoja de Corte
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Cambia el tipo de corte o el empaque y reenvía la hoja
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            {isLoading ? (
              <LoadingState />
            ) : sheet ? (
              <CorrectCuttingSheetForm sheet={sheet} />
            ) : (
              <Text>No se encontró la hoja de corte Nº {id}.</Text>
            )}
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(CorrectCuttingSheetPage);

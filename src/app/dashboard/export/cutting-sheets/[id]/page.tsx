'use client';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
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
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headBg = useColorModeValue('gray.50', 'gray.750');

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <CardHeader bg={headBg} pb={4}>
            <HStack spacing={3} align='center'>
              <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
                <Icon as={MdContentCut} boxSize={5} />
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
          </CardHeader>

          <Divider />

          <CardBody>
            {isLoading ? (
              <LoadingState />
            ) : sheet ? (
              <CorrectCuttingSheetForm sheet={sheet} />
            ) : (
              <Text>No se encontró la hoja de corte Nº {id}.</Text>
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(CorrectCuttingSheetPage);

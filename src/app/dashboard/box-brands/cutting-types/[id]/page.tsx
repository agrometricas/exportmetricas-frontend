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
import AddCuttingTypeForm from '../../../../../components/export/cutting-type/AddCuttingTypeForm';
import { useColorModeValue } from '../../../../../components/ui/color-mode';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useCuttingType } from '../../../../../hooks/export/cutting-type/getCuttingType';
import { CuttingType } from '../../../../../types/cuttingType';

function EditCuttingTypePage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCuttingType(id);
  const cuttingType = data as CuttingType | undefined;
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headBg = useColorModeValue('gray.50', 'gray.750');

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <Card.Header bg={headBg} pb={4}>
            <HStack gap={3} align='center'>
              <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
                <Icon boxSize={5} asChild>
                  <MdContentCut />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Editar Tipo de Corte
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Las hojas ya generadas no cambian; la próxima corrección de
                  una hoja usa estos datos
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            {isLoading ? (
              <LoadingState />
            ) : cuttingType ? (
              <AddCuttingTypeForm cuttingType={cuttingType} />
            ) : (
              <Text>No se encontró el tipo de corte Nº {id}.</Text>
            )}
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(EditCuttingTypePage);

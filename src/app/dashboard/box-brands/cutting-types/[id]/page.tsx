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
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useCuttingType } from '../../../../../hooks/export/cutting-type/getCuttingType';
import { CuttingType } from '../../../../../types/cuttingType';

function EditCuttingTypePage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCuttingType(id);
  const cuttingType = data as CuttingType | undefined;
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

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
import { MdDirectionsBoat } from 'react-icons/md';
import LoadingState from '@/components/ui/states/LoadingState';
import ShippingContractForm from '../../../../../components/shipping-contract/ShippingContractForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useShippingContract } from '../../../../../hooks/shipping-contract/getShippingContract';
import { ShippingContractResponse } from '../../../../../types/shippingContract';

function EditShippingContractPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: contract, isLoading } = useShippingContract(id);
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const textColor = 'fg';

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
          <Card.Header bg={'bg.subtle'} pb={4}>
            <HStack gap={3} align='center'>
              <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
                <Icon boxSize={5} asChild>
                  <MdDirectionsBoat />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Editar Contrato Naviero
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Cambia las rutas, los costos o la vigencia del contrato
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            {isLoading || !contract ? (
              <LoadingState />
            ) : (
              <ShippingContractForm
                contract={contract as ShippingContractResponse}
              />
            )}
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(EditShippingContractPage);
